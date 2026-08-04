"""Urban Landscape backend — construction platform API."""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Header, Query, Response, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, secrets, string, jwt, bcrypt, httpx, requests, io, zipfile, asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGO = os.environ.get('JWT_ALGORITHM', 'HS256')
EMAIL_BASE_URL = os.environ.get('EMAIL_BASE_URL')
EMAIL_KEY = os.environ.get('EMERGENT_EMAIL_KEY')
EMAIL_FROM_NAME = os.environ.get('EMAIL_FROM_NAME')
STORAGE_URL = os.environ.get('STORAGE_URL')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
APP_NAME = os.environ.get('APP_NAME')

storage_key = None

def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_LLM_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()

OBJECT_CACHE = {}

def get_object(path: str):
    if path in OBJECT_CACHE:
        return OBJECT_CACHE[path]
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    res = (resp.content, resp.headers.get("Content-Type", "application/octet-stream"))
    if len(resp.content) < 25 * 1024 * 1024:
        OBJECT_CACHE[path] = res
    return res

async def async_get_object(path: str):
    if path in OBJECT_CACHE:
        return OBJECT_CACHE[path]
    return await asyncio.to_thread(get_object, path)

async def async_put_object(path: str, data: bytes, content_type: str):
    return await asyncio.to_thread(put_object, path, data, content_type)

# ---- App setup ----
app = FastAPI(title="Urban Landscape API")
api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

@app.get("/")
@app.head("/")
async def root_health():
    return {"status": "ok", "app": "Urban Landscape API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def new_id():
    return str(uuid.uuid4())

def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_pw(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def gen_password(n=10):
    alpha = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alpha) for _ in range(n))

def make_token(user_id: str, role: str) -> str:
    payload = {"sub": user_id, "role": role, "exp": datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def current_user(cred: HTTPAuthorizationCredentials = Depends(security)):
    if not cred:
        raise HTTPException(401, "Missing token")
    try:
        payload = jwt.decode(cred.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return user

def require_roles(*roles):
    async def dep(user=Depends(current_user)):
        if user["role"] not in roles:
            raise HTTPException(403, "Forbidden")
        return user
    return dep

# ---- Models ----
class RegisterClient(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    address: str = ""
    city: str = ""
    budget: Optional[str] = None

class RegisterContractor(BaseModel):
    full_name: str
    business_name: str
    email: EmailStr
    phone: str
    address: str = ""
    city: str = ""
    experience_years: Optional[int] = 0
    portfolio_urls: List[str] = []

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class ChangePassword(BaseModel):
    old_password: str
    new_password: str

class ProjectIn(BaseModel):
    project_type: str
    title: str
    description: str = ""
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    rate: Optional[float] = 0
    status: str = "In Progress"
    client_id: Optional[str] = None
    contractor_id: Optional[str] = None
    total_amount: float = 0

class StageIn(BaseModel):
    project_id: str
    stage_name: str
    category: Optional[str] = "General"
    description: str = ""
    status: str = "Not Started"
    order_index: int = 0
    notes: str = ""
    admin_remarks: Optional[str] = ""

class MaterialIn(BaseModel):
    project_id: str
    material_name: str
    quantity: float
    unit: str
    notes: str = ""

class MaterialAction(BaseModel):
    status: Literal["Approved", "Rejected"]
    admin_remarks: str = ""

class PaymentIn(BaseModel):
    project_id: str
    installment_no: int
    amount: float
    due_date: Optional[str] = None
    direction: Literal["received_from_client", "paid_to_contractor"]
    status: str = "Pending"

class PaymentMark(BaseModel):
    status: Literal["Paid", "Pending", "Overdue"]
    paid_date: Optional[str] = None

class QueryIn(BaseModel):
    project_id: str
    subject: str
    message: str

class QueryReply(BaseModel):
    response: str
    resolve: bool = False

class InquiryIn(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    details: str

class CMSHero(BaseModel):
    headline: str
    subheadline: str = ""
    background_image: str = ""

class SignatureProjectIn(BaseModel):
    title: str
    client_name: str
    contractor_name: str
    floors: str
    dimensions: str
    location: str = ""
    description: str = ""
    image_url: str = ""

class ShowcaseProjectIn(BaseModel):
    title: str
    category: str = "Residential Villa"
    location: str = ""
    floors: str = ""
    dimensions: str = ""
    description: str = ""
    overview: str = ""
    image_url: str = ""
    features: List[str] = []

class SignatureProjectIn(BaseModel):
    title: str
    category: str = "Residential Villa"
    location: str = ""
    floors: str = ""
    dimensions: str = ""
    description: str = ""
    overview: str = ""
    image_url: str = ""
    features: List[str] = []

class TestimonialIn(BaseModel):
    name: str
    location: str = ""
    quote: str
    image_url: str = ""

class UserAction(BaseModel):
    status: Literal["Approved", "Rejected"]

async def assert_project_access(project_id: str, user: dict, write: bool = False):
    p = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Project not found")
    if user["role"] == "admin":
        return p
    if user["role"] == "client" and p.get("client_id") == user["id"]:
        if write:
            raise HTTPException(403, "Read-only for clients")
        return p
    if user["role"] == "contractor" and p.get("contractor_id") == user["id"]:
        return p
    raise HTTPException(403, "Forbidden")

# ---- Email helper ----
async def send_email(to_email: str, subject: str, html: str):
    payload = {"to": [to_email], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                             headers={"X-Email-Key": EMAIL_KEY}, json=payload)
        r.raise_for_status()
        return True
    except Exception as e:
        logging.error(f"Email send failed: {e}")
        return False

def credentials_email_html(name, user_id, email, password, role):
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;background:#F4F3EF;padding:40px 20px;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #EAE7DF;">
          <tr><td style="padding:32px 32px 16px 32px;border-bottom:1px solid #EAE7DF;">
            <div style="font-size:11px;letter-spacing:0.24em;color:#8A8A8A;text-transform:uppercase;">Urban Landscape</div>
            <div style="font-size:28px;color:#1A1A1A;font-weight:600;letter-spacing:-0.02em;margin-top:8px;">Welcome, {name}.</div>
          </td></tr>
          <tr><td style="padding:24px 32px;color:#1A1A1A;font-size:14px;line-height:1.7;">
            Your {role} application has been approved. Use the credentials below to access your portal.
            <table style="margin-top:20px;width:100%;border-collapse:collapse;">
              <tr><td style="padding:10px 12px;border:1px solid #EAE7DF;color:#5C5C5C;">User ID</td>
                  <td style="padding:10px 12px;border:1px solid #EAE7DF;color:#1A1A1A;font-family:monospace;">{user_id}</td></tr>
              <tr><td style="padding:10px 12px;border:1px solid #EAE7DF;color:#5C5C5C;">Email</td>
                  <td style="padding:10px 12px;border:1px solid #EAE7DF;color:#1A1A1A;font-family:monospace;">{email}</td></tr>
              <tr><td style="padding:10px 12px;border:1px solid #EAE7DF;color:#5C5C5C;">Password</td>
                  <td style="padding:10px 12px;border:1px solid #EAE7DF;color:#1A1A1A;font-family:monospace;">{password}</td></tr>
            </table>
            <div style="margin-top:24px;color:#5C5C5C;">Please change your password after first login.</div>
          </td></tr>
          <tr><td style="padding:20px 32px;border-top:1px solid #EAE7DF;color:#8A8A8A;font-size:12px;">
            &copy; Urban Landscape — Legacy engineered.
          </td></tr>
        </table>
      </td></tr>
    </table>
    """

# ---- Auth / registration ----
@api.get("/")
async def root():
    return {"service": "Urban Landscape API", "status": "ok"}

@api.post("/auth/register/client")
async def register_client(payload: RegisterClient):
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(400, "Email already registered")
    doc = {
        "id": new_id(),
        "role": "client",
        "status": "pending",
        "user_code": None,
        "password_hash": None,
        "full_name": payload.full_name,
        "email": payload.email,
        "phone": payload.phone,
        "address": payload.address,
        "city": payload.city,
        "budget": payload.budget,
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    return {"message": "Application received. Admin will review shortly.", "id": doc["id"]}

@api.post("/auth/register/contractor")
async def register_contractor(payload: RegisterContractor):
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(400, "Email already registered")
    doc = {
        "id": new_id(),
        "role": "contractor",
        "status": "pending",
        "user_code": None,
        "password_hash": None,
        "full_name": payload.full_name,
        "business_name": payload.business_name,
        "email": payload.email,
        "phone": payload.phone,
        "address": payload.address,
        "city": payload.city,
        "experience_years": payload.experience_years,
        "portfolio_urls": payload.portfolio_urls,
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    return {"message": "Application received. Admin will review shortly.", "id": doc["id"]}

@api.post("/auth/login")
async def login(payload: LoginIn):
    user = await db.users.find_one({"email": payload.email}, {"_id": 0})
    if not user:
        raise HTTPException(401, "Invalid credentials")
    if user["status"] != "approved" and user["role"] != "admin":
        raise HTTPException(403, "Account pending approval")
    if not user.get("password_hash") or not verify_pw(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    token = make_token(user["id"], user["role"])
    return {"token": token, "user": {k: v for k, v in user.items() if k != "password_hash"}}

@api.get("/auth/me")
async def me(user=Depends(current_user)):
    return {k: v for k, v in user.items() if k != "password_hash"}

@api.post("/auth/change-password")
async def change_password(payload: ChangePassword, user=Depends(current_user)):
    if not verify_pw(payload.old_password, user.get("password_hash", "")):
        raise HTTPException(400, "Old password incorrect")
    await db.users.update_one({"id": user["id"]}, {"$set": {"password_hash": hash_pw(payload.new_password)}})
    return {"message": "Password updated"}

class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    business_name: Optional[str] = None
    category: Optional[str] = None
    user_code: Optional[str] = None
    temp_password: Optional[str] = None

# ---- Admin users ----
@api.get("/admin/users")
async def list_users(role: Optional[str] = None, status: Optional[str] = None,
                     user=Depends(require_roles("admin", "client", "contractor"))):
    q = {}
    if role: q["role"] = role
    if status: q["status"] = status
    users = await db.users.find(q, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(1000)
    for u in users:
        if u.get("status") == "approved" and not u.get("temp_password"):
            gen_pw = gen_password(8)
            await db.users.update_one({"id": u["id"]}, {"$set": {"temp_password": gen_pw, "password_hash": hash_pw(gen_pw)}})
            u["temp_password"] = gen_pw
        if user["role"] != "admin":
            u.pop("temp_password", None)
    return users

@api.put("/admin/users/{user_id}")
async def update_user(user_id: str, payload: AdminUserUpdate, user=Depends(require_roles("admin"))):
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(404, "User not found")
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if "temp_password" in update_data and update_data["temp_password"]:
        update_data["password_hash"] = hash_pw(update_data["temp_password"])
    await db.users.update_one({"id": user_id}, {"$set": update_data})
    return await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})

@api.post("/admin/users/{user_id}/action")
async def user_action(user_id: str, payload: UserAction, user=Depends(require_roles("admin"))):
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(404, "User not found")
    update = {"status": payload.status}
    temp_password = None
    is_approve = payload.status == "Approved"
    update["status"] = "approved" if is_approve else "rejected"
    if is_approve:
        prefix = "CL-" if target["role"] == "client" else "CT-"
        count = await db.users.count_documents({"role": target["role"], "user_code": {"$ne": None}})
        code = f"{prefix}{1000 + count + 1}"
        temp_password = gen_password(10)
        update["user_code"] = code
        update["password_hash"] = hash_pw(temp_password)
        update["temp_password"] = temp_password
    await db.users.update_one({"id": user_id}, {"$set": update})
    if is_approve:
        await send_email(
            target["email"],
            "Your Urban Landscape account is approved",
            credentials_email_html(target["full_name"], update["user_code"], target["email"], temp_password, target["role"].title()),
        )
        return {"message": "Approved", "user_code": update["user_code"], "temp_password": temp_password}
    return {"message": "Rejected"}

@api.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, user=Depends(require_roles("admin"))):
    r = await db.users.delete_one({"id": user_id})
    if not r.deleted_count:
        raise HTTPException(404, "User not found")
    return {"message": "User deleted"}

@api.post("/admin/users")
async def admin_create_user(payload: dict, user=Depends(require_roles("admin"))):
    role = payload.get("role", "client")
    email = payload["email"]
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(400, "Email exists")
    prefix = "CL-" if role == "client" else "CT-"
    count = await db.users.count_documents({"role": role, "user_code": {"$ne": None}})
    code = f"{prefix}{1000 + count + 1}"
    temp = gen_password(10)
    doc = {
        "id": new_id(),
        "role": role,
        "status": "approved",
        "user_code": code,
        "password_hash": hash_pw(temp),
        "temp_password": temp,
        "full_name": payload.get("full_name", ""),
        "email": email,
        "phone": payload.get("phone", ""),
        "address": payload.get("address", ""),
        "city": payload.get("city", ""),
        "category": payload.get("category"),
        "business_name": payload.get("business_name"),
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    await send_email(email, "Your Urban Landscape account", credentials_email_html(doc["full_name"], code, email, temp, role.title()))
    return {"user_code": code, "temp_password": temp}

# ---- Project Types ----
@api.get("/project-types")
async def list_project_types():
    pts = await db.project_types.find({}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    return pts

@api.post("/project-types")
async def create_project_type(payload: dict, user=Depends(current_user)):
    name = payload.get("name", "").strip()
    if not name:
        raise HTTPException(400, "Name is required")
    doc = {"id": new_id(), "name": name, "created_at": now_iso()}
    await db.project_types.insert_one(doc)
    doc.pop("_id", None)
    return doc

# ---- Contractor Types ----
@api.get("/contractor-types")
async def list_contractor_types():
    cts = await db.contractor_types.find({}, {"_id": 0}).sort("name", 1).to_list(1000)
    return cts

@api.post("/admin/contractor-types")
async def create_contractor_type(payload: dict, user=Depends(require_roles("admin"))):
    name = payload.get("name", "").strip()
    if not name:
        raise HTTPException(400, "Name is required")
    existing = await db.contractor_types.find_one({"name": name})
    if existing:
        existing.pop("_id", None)
        return existing
    doc = {"id": new_id(), "name": name, "created_at": now_iso()}
    await db.contractor_types.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.delete("/admin/contractor-types/{ct_id}")
async def delete_contractor_type(ct_id: str, user=Depends(require_roles("admin"))):
    await db.contractor_types.delete_one({"id": ct_id})
    return {"message": "Deleted"}

@api.delete("/admin/contractor-types-clear")
async def clear_all_contractor_types(user=Depends(require_roles("admin"))):
    await db.contractor_types.delete_many({})
    return {"message": "All contractor types cleared"}

@api.put("/project-types/{ptid}")
async def update_project_type(ptid: str, payload: dict, user=Depends(current_user)):
    name = payload.get("name", "").strip()
    if not name:
        raise HTTPException(400, "Name is required")
    r = await db.project_types.update_one({"id": ptid}, {"$set": {"name": name}})
    if not r.matched_count:
        raise HTTPException(404, "Project type not found")
    return await db.project_types.find_one({"id": ptid}, {"_id": 0})

@api.delete("/project-types/{ptid}")
async def delete_project_type(ptid: str, user=Depends(current_user)):
    r = await db.project_types.delete_one({"id": ptid})
    if not r.deleted_count:
        raise HTTPException(404, "Project type not found")
    return {"message": "Deleted"}

# ---- Projects ----
async def enrich_project(p):
    if p.get("client_id"):
        c = await db.users.find_one({"id": p["client_id"]}, {"_id": 0, "password_hash": 0})
        p["client"] = c
    if p.get("contractor_id"):
        ct = await db.users.find_one({"id": p["contractor_id"]}, {"_id": 0, "password_hash": 0})
        p["contractor"] = ct
    return p

@api.post("/projects")
async def create_project(payload: ProjectIn, user=Depends(require_roles("admin"))):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.projects.insert_one(doc)
    doc.pop("_id", None)
    return await enrich_project(doc)

@api.get("/projects")
async def list_projects(user=Depends(current_user)):
    q = {}
    if user["role"] == "client":
        q["client_id"] = user["id"]
    elif user["role"] == "contractor":
        q["contractor_id"] = user["id"]
    projects = await db.projects.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    user_ids = list(set([p[k] for p in projects for k in ("client_id", "contractor_id") if p.get(k)]))
    users_map = {}
    if user_ids:
        users = await db.users.find({"id": {"$in": user_ids}}, {"_id": 0, "password_hash": 0}).to_list(len(user_ids))
        users_map = {u["id"]: u for u in users}
        
    for p in projects:
        if p.get("client_id"):
            p["client"] = users_map.get(p["client_id"])
        if p.get("contractor_id"):
            p["contractor"] = users_map.get(p["contractor_id"])
            
    return projects

@api.get("/projects/{pid}")
async def get_project(pid: str, user=Depends(current_user)):
    p = await db.projects.find_one({"id": pid}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Not found")
    if user["role"] == "client" and p.get("client_id") != user["id"]:
        raise HTTPException(403, "Forbidden")
    if user["role"] == "contractor" and p.get("contractor_id") != user["id"]:
        raise HTTPException(403, "Forbidden")
    return await enrich_project(p)

@api.put("/projects/{pid}")
async def update_project(pid: str, payload: ProjectIn, user=Depends(require_roles("admin"))):
    r = await db.projects.update_one({"id": pid}, {"$set": payload.model_dump()})
    if not r.matched_count:
        raise HTTPException(404, "Project not found")
    p = await db.projects.find_one({"id": pid}, {"_id": 0})
    return await enrich_project(p)

@api.delete("/projects/{pid}")
async def delete_project(pid: str, user=Depends(require_roles("admin"))):
    r = await db.projects.delete_one({"id": pid})
    if not r.deleted_count:
        raise HTTPException(404, "Not found")
    return {"message": "Deleted"}

# ---- Drawings (file uploads via object storage) ----
@api.post("/drawings/upload")
async def upload_drawing(
    project_id: str = Form(...),
    category: str = Form("Other"),
    file: UploadFile = File(...),
    user=Depends(current_user),
):
    if user["role"] not in ("admin", "contractor"):
        raise HTTPException(403, "Forbidden")
    await assert_project_access(project_id, user, write=True)
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "bin"
    path = f"{APP_NAME}/drawings/{project_id}/{new_id()}.{ext}"
    data = await file.read()
    last_err = None
    result = None
    for attempt in range(3):
        try:
            result = await async_put_object(path, data, file.content_type or "application/octet-stream")
            break
        except Exception as e:
            last_err = e
            logging.warning(f"Storage PUT attempt {attempt+1} failed: {e}")
    if not result:
        raise HTTPException(502, f"Storage upload failed: {last_err}")
    doc = {
        "id": new_id(),
        "project_id": project_id,
        "category": category,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "uploaded_by": user["id"],
        "uploaded_at": now_iso(),
        "is_deleted": False,
    }
    await db.drawings.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/drawings")
async def list_drawings(project_id: str, user=Depends(current_user)):
    await assert_project_access(project_id, user)
    docs = await db.drawings.find({"project_id": project_id, "is_deleted": False}, {"_id": 0}).sort("uploaded_at", -1).to_list(1000)
    return docs

@api.get("/drawings/{did}/download")
async def download_drawing(did: str, authorization: str = Header(None), auth: str = Query(None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
    elif auth:
        token = auth
    if not token:
        raise HTTPException(401, "Missing token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(401, "User not found")
    d = await db.drawings.find_one({"id": did, "is_deleted": False}, {"_id": 0})
    if not d:
        raise HTTPException(404, "Not found")
    await assert_project_access(d["project_id"], user)
    data, ct = await async_get_object(d["storage_path"])
    return Response(
        content=data,
        media_type=d.get("content_type") or ct,
        headers={"Cache-Control": "public, max-age=86400, immutable"}
    )

@api.delete("/drawings/{did}")
async def delete_drawing(did: str, user=Depends(require_roles("admin", "contractor"))):
    d = await db.drawings.find_one({"id": did}, {"_id": 0})
    if not d:
        raise HTTPException(404, "Not found")
    await assert_project_access(d["project_id"], user, write=True)
    await db.drawings.update_one({"id": did}, {"$set": {"is_deleted": True}})
    if d.get("storage_path") in OBJECT_CACHE:
        OBJECT_CACHE.pop(d["storage_path"], None)
    return {"message": "Deleted"}

@api.delete("/drawings-all")
async def delete_all_drawings(project_id: str = Query(...), user=Depends(require_roles("admin", "contractor"))):
    await assert_project_access(project_id, user, write=True)
    r = await db.drawings.update_many({"project_id": project_id, "is_deleted": False}, {"$set": {"is_deleted": True}})
    return {"message": f"Deleted {r.modified_count} drawings"}

@api.post("/drawings/upload-multiple")
async def upload_multiple_drawings(
    project_id: str = Form(...),
    category: str = Form("Other"),
    files: List[UploadFile] = File(...),
    user=Depends(current_user),
):
    if user["role"] not in ("admin", "contractor"):
        raise HTTPException(403, "Forbidden")
    await assert_project_access(project_id, user, write=True)
    docs = []
    for file in files:
        ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "bin"
        path = f"{APP_NAME}/drawings/{project_id}/{new_id()}.{ext}"
        data = await file.read()
        result = None
        for attempt in range(3):
            try:
                result = await async_put_object(path, data, file.content_type or "application/octet-stream")
                break
            except Exception as e:
                logging.warning(f"Storage PUT attempt {attempt+1} failed: {e}")
        if result:
            doc = {
                "id": new_id(),
                "project_id": project_id,
                "category": category,
                "storage_path": result["path"],
                "original_filename": file.filename,
                "content_type": file.content_type,
                "size": result.get("size", len(data)),
                "uploaded_by": user["id"],
                "uploaded_at": now_iso(),
                "is_deleted": False,
            }
            await db.drawings.insert_one(doc)
            doc.pop("_id", None)
            docs.append(doc)
    return docs

# ---- Stages ----
@api.post("/stages")
async def create_stage(payload: StageIn, user=Depends(require_roles("admin", "contractor"))):
    await assert_project_access(payload.project_id, user, write=True)
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["updated_by"] = user["id"]
    doc["updated_at"] = now_iso()
    await db.stages.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/stages")
async def list_stages(project_id: str, user=Depends(current_user)):
    await assert_project_access(project_id, user)
    stages = await db.stages.find({"project_id": project_id}, {"_id": 0}).sort("order_index", 1).to_list(1000)
    return stages

@api.put("/stages/{sid}")
async def update_stage(sid: str, payload: StageIn, user=Depends(require_roles("admin", "contractor"))):
    existing = await db.stages.find_one({"id": sid}, {"_id": 0})
    if not existing:
        raise HTTPException(404, "Stage not found")
    await assert_project_access(existing["project_id"], user, write=True)

    # Prevent contractor from modifying a completed stage
    if user["role"] == "contractor" and existing.get("status") == "Completed":
        raise HTTPException(403, "Only admin can uncheck or update a completed stage")

    d = payload.model_dump()
    d["project_id"] = existing["project_id"]

    # If contractor tries to mark as Completed, change to Pending Approval for Admin review
    if user["role"] == "contractor" and d.get("status") == "Completed":
        d["status"] = "Pending Approval"

    # If admin marks as Completed, clear any rejection/uncheck remarks
    if user["role"] == "admin" and d.get("status") == "Completed":
        d["admin_remarks"] = ""

    d["updated_by"] = user["id"]
    d["updated_at"] = now_iso()
    await db.stages.update_one({"id": sid}, {"$set": d})
    return await db.stages.find_one({"id": sid}, {"_id": 0})

@api.delete("/stages/{sid}")
async def delete_stage(sid: str, user=Depends(require_roles("admin"))):
    r = await db.stages.delete_one({"id": sid})
    if not r.deleted_count:
        raise HTTPException(404, "Not found")
    return {"message": "Deleted"}

# ---- Materials ----
@api.post("/materials")
async def create_material(payload: MaterialIn, user=Depends(require_roles("contractor", "admin"))):
    await assert_project_access(payload.project_id, user, write=True)
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["requested_by"] = user["id"]
    doc["status"] = "Pending"
    doc["admin_remarks"] = ""
    doc["requested_at"] = now_iso()
    await db.materials.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/materials")
async def list_materials(project_id: Optional[str] = None, user=Depends(current_user)):
    q = {}
    if project_id:
        await assert_project_access(project_id, user)
        q["project_id"] = project_id
    else:
        if user["role"] == "client":
            projs = await db.projects.find({"client_id": user["id"]}, {"id": 1}).to_list(1000)
            q["project_id"] = {"$in": [p["id"] for p in projs]}
        elif user["role"] == "contractor":
            q["requested_by"] = user["id"]
    docs = await db.materials.find(q, {"_id": 0}).sort("requested_at", -1).to_list(1000)
    return docs

@api.post("/materials/{mid}/action")
async def material_action(mid: str, payload: MaterialAction, user=Depends(require_roles("admin"))):
    r = await db.materials.update_one({"id": mid}, {"$set": {"status": payload.status, "admin_remarks": payload.admin_remarks}})
    if not r.matched_count:
        raise HTTPException(404, "Material not found")
    return await db.materials.find_one({"id": mid}, {"_id": 0})

# ---- Payments ----
@api.post("/payments")
async def create_payment(payload: PaymentIn, user=Depends(require_roles("admin"))):
    await assert_project_access(payload.project_id, user)
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["paid_date"] = None
    doc["created_at"] = now_iso()
    await db.payments.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/payments")
async def list_payments(project_id: Optional[str] = None, user=Depends(current_user)):
    q = {}
    if project_id:
        await assert_project_access(project_id, user)
        q["project_id"] = project_id
    else:
        if user["role"] == "client":
            projs = await db.projects.find({"client_id": user["id"]}, {"id": 1}).to_list(1000)
            q["project_id"] = {"$in": [p["id"] for p in projs]}
        elif user["role"] == "contractor":
            projs = await db.projects.find({"contractor_id": user["id"]}, {"id": 1}).to_list(1000)
            q["project_id"] = {"$in": [p["id"] for p in projs]}
    docs = await db.payments.find(q, {"_id": 0}).sort("due_date", 1).to_list(1000)
    return docs

@api.post("/payments/{pid}/mark")
async def payment_mark(pid: str, payload: PaymentMark, user=Depends(require_roles("admin"))):
    update = {"status": payload.status}
    if payload.status == "Paid":
        update["paid_date"] = payload.paid_date or now_iso()
    r = await db.payments.update_one({"id": pid}, {"$set": update})
    if not r.matched_count:
        raise HTTPException(404, "Payment not found")
    return await db.payments.find_one({"id": pid}, {"_id": 0})

@api.delete("/payments/{pid}")
async def payment_delete(pid: str, user=Depends(require_roles("admin"))):
    r = await db.payments.delete_one({"id": pid})
    if not r.deleted_count:
        raise HTTPException(404, "Not found")
    return {"message": "Deleted"}

# ---- Queries ----
@api.post("/queries")
async def create_query(payload: QueryIn, user=Depends(require_roles("client", "contractor"))):
    proj = await db.projects.find_one({"id": payload.project_id}, {"_id": 0})
    if not proj:
        raise HTTPException(404, "Project not found")
    if user["role"] == "client" and proj.get("client_id") != user["id"]:
        raise HTTPException(403, "Forbidden")
    if user["role"] == "contractor" and proj.get("contractor_id") != user["id"]:
        raise HTTPException(403, "Forbidden")
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["raised_by"] = user["id"]
    doc["raised_by_role"] = user["role"]
    doc["raised_by_name"] = user["full_name"]
    doc["status"] = "Open"
    doc["response"] = ""
    doc["created_at"] = now_iso()
    await db.queries.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/queries")
async def list_queries(project_id: Optional[str] = None, user=Depends(current_user)):
    q = {}
    if project_id:
        await assert_project_access(project_id, user)
        q["project_id"] = project_id
    else:
        if user["role"] == "client":
            projs = await db.projects.find({"client_id": user["id"]}, {"id": 1}).to_list(1000)
            q["project_id"] = {"$in": [p["id"] for p in projs]}
        elif user["role"] == "contractor":
            projs = await db.projects.find({"contractor_id": user["id"]}, {"id": 1}).to_list(1000)
            q["project_id"] = {"$in": [p["id"] for p in projs]}
    docs = await db.queries.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api.post("/queries/{qid}/reply")
async def reply_query(qid: str, payload: QueryReply, user=Depends(require_roles("admin"))):
    update = {"response": payload.response}
    if payload.resolve:
        update["status"] = "Resolved"
    r = await db.queries.update_one({"id": qid}, {"$set": update})
    if not r.matched_count:
        raise HTTPException(404, "Query not found")
    return await db.queries.find_one({"id": qid}, {"_id": 0})

# ---- Website CMS ----
@api.get("/cms/hero")
async def get_hero():
    h = await db.cms.find_one({"key": "hero"}, {"_id": 0}) or {
        "key": "hero",
        "headline": "Shape the future of living.",
        "subheadline": "Select your path and discover a tailored experience crafted for your unique journey in construction.",
        "background_image": "https://images.unsplash.com/photo-1628012209120-d9db7abf7eab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDB8fHx8MTc4NTczODIxOHww&ixlib=rb-4.1.0&q=85",
    }
    return h

@api.put("/cms/hero")
async def put_hero(payload: CMSHero, user=Depends(require_roles("admin"))):
    await db.cms.update_one({"key": "hero"}, {"$set": {**payload.model_dump(), "key": "hero"}}, upsert=True)
    return await db.cms.find_one({"key": "hero"}, {"_id": 0})

@api.get("/cms/signature-projects")
async def list_signature():
    docs = await db.signature_projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return docs

@api.post("/cms/signature-projects")
async def add_signature(payload: SignatureProjectIn, user=Depends(require_roles("admin"))):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.signature_projects.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.delete("/cms/signature-projects/{sid}")
async def del_signature(sid: str, user=Depends(require_roles("admin"))):
    r = await db.signature_projects.delete_one({"id": sid})
    if not r.deleted_count:
        raise HTTPException(404, "Not found")
    return {"message": "Deleted"}

@api.get("/cms/testimonials")
async def list_testimonials():
    return await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api.post("/cms/testimonials")
async def add_testimonial(payload: TestimonialIn, user=Depends(require_roles("admin"))):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.testimonials.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.delete("/cms/testimonials/{tid}")
async def del_testimonial(tid: str, user=Depends(require_roles("admin"))):
    r = await db.testimonials.delete_one({"id": tid})
    if not r.deleted_count:
        raise HTTPException(404, "Not found")
    return {"message": "Deleted"}

@api.get("/cms/showcase-projects")
async def list_showcase_projects():
    docs = await db.showcase_projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs

@api.delete("/cms/showcase-projects-clear")
async def clear_showcase_projects(user=Depends(require_roles("admin"))):
    await db.showcase_projects.delete_many({})
    return {"message": "All showcase projects cleared"}

@api.post("/cms/showcase-projects")
async def create_showcase_project(payload: ShowcaseProjectIn, user=Depends(require_roles("admin"))):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.showcase_projects.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.put("/cms/showcase-projects/{sp_id}")
async def update_showcase_project(sp_id: str, payload: ShowcaseProjectIn, user=Depends(require_roles("admin"))):
    existing = await db.showcase_projects.find_one({"id": sp_id})
    if not existing:
        raise HTTPException(404, "Showcase project not found")
    d = payload.model_dump()
    d["updated_at"] = now_iso()
    await db.showcase_projects.update_one({"id": sp_id}, {"$set": d})
    return await db.showcase_projects.find_one({"id": sp_id}, {"_id": 0})

@api.delete("/cms/showcase-projects/{sp_id}")
async def delete_showcase_project(sp_id: str, user=Depends(require_roles("admin"))):
    r = await db.showcase_projects.delete_one({"id": sp_id})
    if not r.deleted_count:
        raise HTTPException(404, "Showcase project not found")
    return {"message": "Deleted"}

# ---- Signature Projects CMS ----
@api.get("/cms/signature-projects")
async def list_signature_projects():
    docs = await db.signature_projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs

@api.delete("/cms/signature-projects-clear")
async def clear_signature_projects(user=Depends(require_roles("admin"))):
    await db.signature_projects.delete_many({})
    return {"message": "All signature projects cleared"}

@api.post("/cms/signature-projects")
async def create_signature_project(payload: SignatureProjectIn, user=Depends(require_roles("admin"))):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.signature_projects.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.post("/cms/signature-projects/select-from-showcase")
async def add_signature_from_showcase(showcase_id: str = Body(..., embed=True), user=Depends(require_roles("admin"))):
    sp = await db.showcase_projects.find_one({"id": showcase_id})
    if not sp:
        raise HTTPException(404, "Showcase project not found")
    
    doc = {
        "id": new_id(),
        "title": sp.get("title", ""),
        "category": sp.get("category", "Residential Villa"),
        "location": sp.get("location", ""),
        "floors": sp.get("floors", ""),
        "dimensions": sp.get("dimensions", ""),
        "description": sp.get("description", ""),
        "overview": sp.get("overview", ""),
        "image_url": sp.get("image_url", ""),
        "features": sp.get("features", []),
        "created_at": now_iso()
    }
    await db.signature_projects.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.put("/cms/signature-projects/{sp_id}")
async def update_signature_project(sp_id: str, payload: SignatureProjectIn, user=Depends(require_roles("admin"))):
    existing = await db.signature_projects.find_one({"id": sp_id})
    if not existing:
        raise HTTPException(404, "Signature project not found")
    d = payload.model_dump()
    d["updated_at"] = now_iso()
    await db.signature_projects.update_one({"id": sp_id}, {"$set": d})
    return await db.signature_projects.find_one({"id": sp_id}, {"_id": 0})

@api.delete("/cms/signature-projects/{sp_id}")
async def delete_signature_project(sp_id: str, user=Depends(require_roles("admin"))):
    r = await db.signature_projects.delete_one({"id": sp_id})
    if not r.deleted_count:
        raise HTTPException(404, "Signature project not found")
    return {"message": "Deleted"}

# ---- Project ZIP download ----
PROJECT_ROOT = Path("/app")
EXCLUDE_DIRS = {"node_modules", "__pycache__", ".venv", "venv", ".git", "build", "dist", ".next", ".cache", ".yarn", ".pytest_cache", "test_reports"}
EXCLUDE_EXTS = {".pyc", ".pyo", ".log"}
EXCLUDE_FILES = {".DS_Store"}

def build_project_zip() -> bytes:
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for root, dirs, files in os.walk(PROJECT_ROOT):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]
            for name in files:
                if name in EXCLUDE_FILES:
                    continue
                if any(name.endswith(ext) for ext in EXCLUDE_EXTS):
                    continue
                full = Path(root) / name
                try:
                    if full.stat().st_size > 5 * 1024 * 1024:  # skip >5MB
                        continue
                except OSError:
                    continue
                rel = full.relative_to(PROJECT_ROOT)
                arcname = f"urban-landscape/{rel.as_posix()}"
                try:
                    zf.write(full, arcname)
                except (OSError, PermissionError):
                    continue
    buf.seek(0)
    return buf.getvalue()

class DownloadRequest(BaseModel):
    name: str
    email: EmailStr

@api.post("/download/request")
async def request_download(payload: DownloadRequest):
    doc = {
        "id": new_id(),
        "name": payload.name,
        "email": payload.email,
        "created_at": now_iso(),
    }
    await db.download_requests.insert_one(doc)
    doc.pop("_id", None)
    return {"token": doc["id"], "message": "Request recorded"}

@api.get("/download/project")
async def download_project(token: str = Query(...)):
    lead = await db.download_requests.find_one({"id": token}, {"_id": 0})
    if not lead:
        raise HTTPException(404, "Invalid download token")
    data = build_project_zip()
    return StreamingResponse(
        io.BytesIO(data),
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="urban-landscape.zip"'},
    )

@api.get("/download/leads")
async def download_leads(user=Depends(require_roles("admin"))):
    return await db.download_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

# ---- Inquiries ----
@api.post("/inquiries")
async def create_inquiry(payload: InquiryIn):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["status"] = "New"
    doc["created_at"] = now_iso()
    await db.inquiries.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.get("/inquiries")
async def list_inquiries(user=Depends(require_roles("admin"))):
    return await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

# ---- Admin dashboard stats ----
@api.get("/admin/stats")
async def admin_stats(user=Depends(require_roles("admin"))):
    total = await db.projects.count_documents({})
    ongoing = await db.projects.count_documents({"status": "In Progress"})
    completed = await db.projects.count_documents({"status": "Completed"})
    pending_users = await db.users.count_documents({"status": "pending"})
    pending_materials = await db.materials.count_documents({"status": "Pending"})
    open_queries = await db.queries.count_documents({"status": "Open"})
    total_clients = await db.users.count_documents({"role": "client", "status": "approved"})
    total_contractors = await db.users.count_documents({"role": "contractor", "status": "approved"})
    payments = await db.payments.find({}, {"_id": 0}).to_list(10000)
    received = sum(p["amount"] for p in payments if p["direction"] == "received_from_client" and p["status"] == "Paid")
    pending_from_clients = sum(p["amount"] for p in payments if p["direction"] == "received_from_client" and p["status"] != "Paid")
    paid_contractors = sum(p["amount"] for p in payments if p["direction"] == "paid_to_contractor" and p["status"] == "Paid")
    remaining_contractors = sum(p["amount"] for p in payments if p["direction"] == "paid_to_contractor" and p["status"] != "Paid")
    return {
        "total_projects": total, "ongoing": ongoing, "completed": completed,
        "pending_users": pending_users, "pending_materials": pending_materials, "open_queries": open_queries,
        "total_clients": total_clients, "total_contractors": total_contractors,
        "received": received, "pending_from_clients": pending_from_clients,
        "paid_contractors": paid_contractors, "remaining_contractors": remaining_contractors,
    }

@api.get("/client/stats")
async def client_stats(user=Depends(require_roles("client", "admin"))):
    active = await db.projects.count_documents({"client_id": user["id"], "status": "In Progress"})
    completed = await db.projects.count_documents({"client_id": user["id"], "status": "Completed"})
    projs = await db.projects.find({"client_id": user["id"]}, {"id": 1, "total_amount": 1}).to_list(1000)
    ids = [p["id"] for p in projs]
    total = sum(p.get("total_amount", 0) for p in projs)
    pays = await db.payments.find({"project_id": {"$in": ids}, "direction": "received_from_client"}, {"_id": 0}).to_list(1000)
    paid = sum(p["amount"] for p in pays if p["status"] == "Paid")
    return {"active_projects": active, "completed_projects": completed, "total_amount": total, "paid": paid, "remaining": max(0, total - paid)}

@api.get("/contractor/stats")
async def contractor_stats(user=Depends(require_roles("contractor", "admin"))):
    active = await db.projects.count_documents({"contractor_id": user["id"], "status": "In Progress"})
    completed = await db.projects.count_documents({"contractor_id": user["id"], "status": "Completed"})
    projs = await db.projects.find({"contractor_id": user["id"]}, {"id": 1, "total_amount": 1}).to_list(1000)
    ids = [p["id"] for p in projs]
    total = sum(p.get("total_amount", 0) for p in projs)
    pays = await db.payments.find({"project_id": {"$in": ids}, "direction": "paid_to_contractor"}, {"_id": 0}).to_list(1000)
    received = sum(p["amount"] for p in pays if p["status"] == "Paid")
    return {"active_projects": active, "completed_projects": completed, "total_amount": total, "received": received, "remaining": max(0, total - received)}

# ---- Startup: seed admin + init storage ----
@app.on_event("startup")
async def startup():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@urbanlandscape.in")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@2026")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": new_id(),
            "role": "admin",
            "status": "approved",
            "user_code": "AD-0001",
            "password_hash": hash_pw(admin_password),
            "full_name": "Urban Landscape Admin",
            "email": admin_email,
            "phone": "",
            "created_at": now_iso(),
        })
        logging.info(f"Seeded admin: {admin_email}")
    else:
        # Always sync password from .env so changes take effect on restart
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {
                "password_hash": hash_pw(admin_password),
                "role": "admin",
                "status": "approved",
            }}
        )
        logging.info(f"Admin password synced from .env for: {admin_email}")
    try:
        init_storage()
        logging.info("Storage initialized")
    except Exception as e:
        logging.error(f"Storage init failed: {e}")

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

@app.on_event("shutdown")
async def shutdown():
    mongo_client.close()
