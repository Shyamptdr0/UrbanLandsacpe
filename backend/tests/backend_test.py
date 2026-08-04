"""End-to-end API regression tests for Urban Landscape auth, CRUD, CMS, storage, and role isolation."""
import re
import uuid
from pathlib import Path

import pytest
import requests
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import dotenv_values

FRONTEND_ENV = dotenv_values("/app/frontend/.env")
BASE_URL = (FRONTEND_ENV.get("REACT_APP_BACKEND_URL") or "").rstrip("/")
if not BASE_URL:
    raise RuntimeError("REACT_APP_BACKEND_URL is missing from /app/frontend/.env")


def load_admin_credentials():
    path = Path("/app/memory/test_credentials.md")
    if not path.exists():
        pytest.skip("Missing /app/memory/test_credentials.md")
    content = path.read_text(encoding="utf-8")
    email = re.search(r"(?im)^- Email:\s*(\S+)", content)
    password = re.search(r"(?im)^- Password:\s*(\S+)", content)
    if not email or not password:
        pytest.skip("Admin email/password missing from test_credentials.md")
    return email.group(1), password.group(1)


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def assert_json_response(response, expected_status):
    assert response.status_code == expected_status, f"{response.request.method} {response.url}: {response.status_code} {response.text[:500]}"
    return response.json()


@pytest.fixture(scope="module")
def ctx():
    """Create isolated TEST_ users and projects, then remove all data the API permits deleting."""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    admin_email, admin_password = load_admin_credentials()
    login = session.post(f"{BASE_URL}/api/auth/login", json={"email": admin_email, "password": admin_password}, timeout=30)
    login_data = assert_json_response(login, 200)
    assert login_data["user"]["role"] == "admin"
    assert isinstance(login_data["token"], str) and login_data["token"]
    admin_token = login_data["token"]

    run = uuid.uuid4().hex[:10]
    state = {
        "session": session,
        "admin_token": admin_token,
        "users": [],
        "projects": [],
        "stages": [],
        "payments": [],
        "drawings": [],
        "signatures": [],
        "testimonials": [],
        "run": run,
    }

    # Preserve one real registration + approval flow so the issued-credential defect is tested explicitly.
    approval_email = f"TEST_approval_{run}@example.com"
    approval_registration = assert_json_response(session.post(f"{BASE_URL}/api/auth/register/client", json={
        "full_name": "TEST Approval Client", "email": approval_email, "phone": "7777777777",
        "address": "TEST address", "city": "Indore", "project_type": "Renovation", "budget": "1000000",
    }, timeout=30), 200)
    approval_result = assert_json_response(session.post(
        f"{BASE_URL}/api/admin/users/{approval_registration['id']}/action",
        headers=auth_headers(admin_token), json={"status": "Approved"}, timeout=45,
    ), 200)
    state["approval_flow"] = {
        "id": approval_registration["id"], "email": approval_email,
        "temp_password": approval_result["temp_password"], "user_code": approval_result["user_code"],
    }

    # Use admin-created approved users to continue testing the remaining role workflows independently.
    def create_approved_user(role, suffix):
        email = f"TEST_direct_{role}_{suffix}_{run}@example.com"
        payload = {
            "role": role, "full_name": f"TEST {role.title()} {suffix}", "email": email,
            "phone": "9999999999", "address": "TEST address", "city": "Indore",
        }
        if role == "contractor":
            payload.update({"business_name": f"TEST Build {suffix}", "category": "Contractor"})
        created = assert_json_response(session.post(
            f"{BASE_URL}/api/admin/users", headers=auth_headers(admin_token), json=payload, timeout=45,
        ), 200)
        prefix = "CL-" if role == "client" else "CT-"
        assert created["user_code"].startswith(prefix) and created["temp_password"]
        role_login = session.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": created["temp_password"]}, timeout=30)
        role_data = assert_json_response(role_login, 200)
        assert role_data["user"]["role"] == role and role_data["user"]["email"] == email
        user = {**role_data["user"], "token": role_data["token"], "temp_password": created["temp_password"]}
        state["users"].append(user)
        return user

    state["client"] = create_approved_user("client", "A")
    state["contractor"] = create_approved_user("contractor", "A")
    state["other_client"] = create_approved_user("client", "B")
    state["other_contractor"] = create_approved_user("contractor", "B")

    def create_project(title, client, contractor):
        payload = {
            "project_type": "End-to-End Construction", "title": title, "description": "TEST project",
            "start_date": "2026-08-01", "end_date": "2027-08-01", "floors": "G+2", "dimensions": "40x60",
            "status": "In Progress", "client_id": client["id"], "contractor_id": contractor["id"], "total_amount": 2500000,
        }
        response = session.post(f"{BASE_URL}/api/projects", headers=auth_headers(admin_token), json=payload, timeout=30)
        project = assert_json_response(response, 200)
        assert project["title"] == title and project["client"]["id"] == client["id"]
        state["projects"].append(project["id"])
        return project

    state["project"] = create_project(f"TEST Primary {run}", state["client"], state["contractor"])
    state["other_project"] = create_project(f"TEST Other {run}", state["other_client"], state["other_contractor"])

    original_hero = assert_json_response(session.get(f"{BASE_URL}/api/cms/hero", timeout=30), 200)
    state["original_hero"] = original_hero
    yield state

    for drawing_id in state["drawings"]:
        session.delete(f"{BASE_URL}/api/drawings/{drawing_id}", headers=auth_headers(admin_token), timeout=30)
    for stage_id in state["stages"]:
        session.delete(f"{BASE_URL}/api/stages/{stage_id}", headers=auth_headers(admin_token), timeout=30)
    for payment_id in state["payments"]:
        session.delete(f"{BASE_URL}/api/payments/{payment_id}", headers=auth_headers(admin_token), timeout=30)
    for signature_id in state["signatures"]:
        session.delete(f"{BASE_URL}/api/cms/signature-projects/{signature_id}", headers=auth_headers(admin_token), timeout=30)
    for testimonial_id in state["testimonials"]:
        session.delete(f"{BASE_URL}/api/cms/testimonials/{testimonial_id}", headers=auth_headers(admin_token), timeout=30)
    hero = state["original_hero"]
    session.put(f"{BASE_URL}/api/cms/hero", headers=auth_headers(admin_token), json={
        "headline": hero.get("headline", ""), "subheadline": hero.get("subheadline", ""), "background_image": hero.get("background_image", "")
    }, timeout=30)
    for project_id in state["projects"]:
        session.delete(f"{BASE_URL}/api/projects/{project_id}", headers=auth_headers(admin_token), timeout=30)
    for user in state["users"]:
        session.post(f"{BASE_URL}/api/admin/users/{user['id']}/action", headers=auth_headers(admin_token), json={"status": "Rejected"}, timeout=30)
    session.post(f"{BASE_URL}/api/admin/users/{state['approval_flow']['id']}/action", headers=auth_headers(admin_token), json={"status": "Rejected"}, timeout=30)


def test_public_health_and_validation(ctx):
    session = ctx["session"]
    root = assert_json_response(session.get(f"{BASE_URL}/api/", timeout=30), 200)
    assert root == {"service": "Urban Landscape API", "status": "ok"}
    missing = session.get(f"{BASE_URL}/api/projects", timeout=30)
    assert missing.status_code == 401
    invalid = session.post(f"{BASE_URL}/api/auth/register/client", json={"full_name": "TEST Bad", "email": "not-email", "phone": "1"}, timeout=30)
    assert invalid.status_code == 422


def test_jwt_me_and_role_rejection(ctx):
    session = ctx["session"]
    me = assert_json_response(session.get(f"{BASE_URL}/api/auth/me", headers=auth_headers(ctx["client"]["token"]), timeout=30), 200)
    assert me["id"] == ctx["client"]["id"] and me["role"] == "client"
    assert "password_hash" not in me and "_id" not in me
    invalid = session.get(f"{BASE_URL}/api/auth/me", headers=auth_headers("invalid.jwt.token"), timeout=30)
    assert invalid.status_code == 401
    backend_env = dotenv_values("/app/backend/.env")
    expired_token = jwt.encode(
        {"sub": ctx["client"]["id"], "role": "client", "exp": datetime.now(timezone.utc) - timedelta(seconds=1)},
        backend_env["JWT_SECRET"], algorithm=backend_env.get("JWT_ALGORITHM", "HS256"),
    )
    expired = session.get(f"{BASE_URL}/api/auth/me", headers=auth_headers(expired_token), timeout=30)
    assert expired.status_code == 401
    admin_users = session.get(f"{BASE_URL}/api/admin/users", headers=auth_headers(ctx["client"]["token"]), timeout=30)
    assert admin_users.status_code == 403




def test_admin_approval_issued_credentials_can_login(ctx):
    approval = ctx["approval_flow"]
    response = ctx["session"].post(
        f"{BASE_URL}/api/auth/login",
        json={"email": approval["email"], "password": approval["temp_password"]}, timeout=30,
    )
    data = assert_json_response(response, 200)
    assert data["user"]["id"] == approval["id"] and data["user"]["status"] == "approved"

def test_user_filters_and_project_role_lists(ctx):
    session = ctx["session"]
    pending = assert_json_response(session.get(f"{BASE_URL}/api/admin/users", headers=auth_headers(ctx["admin_token"]), params={"role": "client", "status": "approved"}, timeout=30), 200)
    assert any(u["id"] == ctx["client"]["id"] for u in pending)
    client_projects = assert_json_response(session.get(f"{BASE_URL}/api/projects", headers=auth_headers(ctx["client"]["token"]), timeout=30), 200)
    assert any(p["id"] == ctx["project"]["id"] for p in client_projects)
    assert all(p["client_id"] == ctx["client"]["id"] for p in client_projects)
    contractor_projects = assert_json_response(session.get(f"{BASE_URL}/api/projects", headers=auth_headers(ctx["contractor"]["token"]), timeout=30), 200)
    assert all(p["contractor_id"] == ctx["contractor"]["id"] for p in contractor_projects)
    forbidden = session.get(f"{BASE_URL}/api/projects/{ctx['other_project']['id']}", headers=auth_headers(ctx["client"]["token"]), timeout=30)
    assert forbidden.status_code == 403


def test_stage_crud_and_progress_data(ctx):
    session = ctx["session"]
    payload = {"project_id": ctx["project"]["id"], "stage_name": f"TEST Foundation {ctx['run']}", "description": "TEST stage", "status": "Not Started", "order_index": 0, "notes": ""}
    created = assert_json_response(session.post(f"{BASE_URL}/api/stages", headers=auth_headers(ctx["admin_token"]), json=payload, timeout=30), 200)
    ctx["stages"].append(created["id"])
    assert created["stage_name"] == payload["stage_name"] and created["status"] == "Not Started"
    updated_payload = {**payload, "status": "Completed"}
    updated = assert_json_response(session.put(f"{BASE_URL}/api/stages/{created['id']}", headers=auth_headers(ctx["contractor"]["token"]), json=updated_payload, timeout=30), 200)
    assert updated["status"] == "Completed"
    rows = assert_json_response(session.get(f"{BASE_URL}/api/stages", headers=auth_headers(ctx["client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30), 200)
    assert any(r["id"] == created["id"] and r["status"] == "Completed" for r in rows)
    ctx["stage"] = created


def test_payment_crud_and_admin_stats(ctx):
    session = ctx["session"]
    before = assert_json_response(session.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers(ctx["admin_token"]), timeout=30), 200)
    for direction, amount in (("received_from_client", 12345), ("paid_to_contractor", 6789)):
        payload = {"project_id": ctx["project"]["id"], "installment_no": len(ctx["payments"]) + 1, "amount": amount, "due_date": "2026-09-01", "direction": direction, "status": "Pending"}
        payment = assert_json_response(session.post(f"{BASE_URL}/api/payments", headers=auth_headers(ctx["admin_token"]), json=payload, timeout=30), 200)
        ctx["payments"].append(payment["id"])
        marked = assert_json_response(session.post(f"{BASE_URL}/api/payments/{payment['id']}/mark", headers=auth_headers(ctx["admin_token"]), json={"status": "Paid"}, timeout=30), 200)
        assert marked["status"] == "Paid" and marked["paid_date"]
    rows = assert_json_response(session.get(f"{BASE_URL}/api/payments", headers=auth_headers(ctx["client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30), 200)
    assert {p["id"] for p in rows}.issuperset(ctx["payments"])
    after = assert_json_response(session.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers(ctx["admin_token"]), timeout=30), 200)
    assert after["received"] == before["received"] + 12345
    assert after["paid_contractors"] == before["paid_contractors"] + 6789


def test_material_request_approval_and_propagation(ctx):
    session = ctx["session"]
    payload = {"project_id": ctx["project"]["id"], "material_name": f"TEST Cement {ctx['run']}", "quantity": 25, "unit": "bags", "notes": "TEST request"}
    material = assert_json_response(session.post(f"{BASE_URL}/api/materials", headers=auth_headers(ctx["contractor"]["token"]), json=payload, timeout=30), 200)
    assert material["status"] == "Pending" and material["requested_by"] == ctx["contractor"]["id"]
    approved = assert_json_response(session.post(f"{BASE_URL}/api/materials/{material['id']}/action", headers=auth_headers(ctx["admin_token"]), json={"status": "Approved", "admin_remarks": "TEST approved"}, timeout=30), 200)
    assert approved["status"] == "Approved" and approved["admin_remarks"] == "TEST approved"
    for actor in (ctx["client"], ctx["contractor"]):
        rows = assert_json_response(session.get(f"{BASE_URL}/api/materials", headers=auth_headers(actor["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30), 200)
        assert any(m["id"] == material["id"] and m["status"] == "Approved" for m in rows)
    ctx["material"] = material


def test_query_reply_and_visibility(ctx):
    session = ctx["session"]
    payload = {"project_id": ctx["project"]["id"], "subject": f"TEST Query {ctx['run']}", "message": "TEST Please confirm"}
    query = assert_json_response(session.post(f"{BASE_URL}/api/queries", headers=auth_headers(ctx["client"]["token"]), json=payload, timeout=30), 200)
    assert query["status"] == "Open" and query["raised_by"] == ctx["client"]["id"]
    replied = assert_json_response(session.post(f"{BASE_URL}/api/queries/{query['id']}/reply", headers=auth_headers(ctx["admin_token"]), json={"response": "TEST Confirmed", "resolve": True}, timeout=30), 200)
    assert replied["status"] == "Resolved" and replied["response"] == "TEST Confirmed"
    rows = assert_json_response(session.get(f"{BASE_URL}/api/queries", headers=auth_headers(ctx["client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30), 200)
    assert any(q["id"] == query["id"] and q["response"] == "TEST Confirmed" for q in rows)
    ctx["query"] = query


def test_object_storage_upload_list_and_both_download_auth_modes(ctx, tmp_path):
    session = ctx["session"]
    source = tmp_path / "TEST_drawing.txt"
    source.write_text(f"TEST drawing {ctx['run']}", encoding="utf-8")
    with source.open("rb") as handle:
        response = requests.post(
            f"{BASE_URL}/api/drawings/upload", headers=auth_headers(ctx["contractor"]["token"]),
            data={"project_id": ctx["project"]["id"], "category": "Other"},
            files={"file": (source.name, handle, "text/plain")}, timeout=150,
        )
    drawing = assert_json_response(response, 200)
    ctx["drawings"].append(drawing["id"])
    assert drawing["original_filename"] == source.name and drawing["size"] > 0
    listed = assert_json_response(session.get(f"{BASE_URL}/api/drawings", headers=auth_headers(ctx["client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30), 200)
    assert any(d["id"] == drawing["id"] for d in listed)
    by_header = session.get(f"{BASE_URL}/api/drawings/{drawing['id']}/download", headers=auth_headers(ctx["client"]["token"]), timeout=90)
    assert by_header.status_code == 200 and by_header.content == source.read_bytes()
    by_query = session.get(f"{BASE_URL}/api/drawings/{drawing['id']}/download", params={"auth": ctx["client"]["token"]}, timeout=90)
    assert by_query.status_code == 200 and by_query.content == source.read_bytes()
    ctx["drawing"] = drawing


def test_cms_crud_and_inquiry_persistence(ctx):
    session = ctx["session"]
    headline = f"TEST Hero {ctx['run']}"
    hero = assert_json_response(session.put(f"{BASE_URL}/api/cms/hero", headers=auth_headers(ctx["admin_token"]), json={"headline": headline, "subheadline": "TEST sub", "background_image": "https://example.com/image.jpg"}, timeout=30), 200)
    assert hero["headline"] == headline
    assert assert_json_response(session.get(f"{BASE_URL}/api/cms/hero", timeout=30), 200)["headline"] == headline
    sig_payload = {"title": f"TEST Signature {ctx['run']}", "client_name": "TEST Client", "contractor_name": "TEST Pro", "floors": "G+1", "dimensions": "30x40", "location": "Indore", "description": "TEST CMS", "image_url": ""}
    signature = assert_json_response(session.post(f"{BASE_URL}/api/cms/signature-projects", headers=auth_headers(ctx["admin_token"]), json=sig_payload, timeout=30), 200)
    ctx["signatures"].append(signature["id"])
    signatures = assert_json_response(session.get(f"{BASE_URL}/api/cms/signature-projects", timeout=30), 200)
    assert any(s["id"] == signature["id"] and s["title"] == sig_payload["title"] for s in signatures)
    testimonial = assert_json_response(session.post(f"{BASE_URL}/api/cms/testimonials", headers=auth_headers(ctx["admin_token"]), json={"name": "TEST Reviewer", "location": "Indore", "quote": f"TEST Quote {ctx['run']}", "image_url": ""}, timeout=30), 200)
    ctx["testimonials"].append(testimonial["id"])
    testimonials = assert_json_response(session.get(f"{BASE_URL}/api/cms/testimonials", timeout=30), 200)
    assert any(t["id"] == testimonial["id"] for t in testimonials)
    inquiry_payload = {"first_name": "TEST", "last_name": "Lead", "email": f"TEST_lead_{ctx['run']}@example.com", "details": "TEST inquiry details"}
    inquiry = assert_json_response(session.post(f"{BASE_URL}/api/inquiries", json=inquiry_payload, timeout=30), 200)
    assert inquiry["status"] == "New" and inquiry["email"] == inquiry_payload["email"]
    inquiries = assert_json_response(session.get(f"{BASE_URL}/api/inquiries", headers=auth_headers(ctx["admin_token"]), timeout=30), 200)
    assert any(i["id"] == inquiry["id"] for i in inquiries)
    ctx["signature"] = signature


# Authorization tests: project-scoped resources must not be exposed through a caller-supplied project_id.
def test_security_other_client_cannot_list_primary_stages(ctx):
    response = ctx["session"].get(f"{BASE_URL}/api/stages", headers=auth_headers(ctx["other_client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30)
    assert response.status_code == 403


def test_security_other_contractor_cannot_create_stage_for_primary_project(ctx):
    payload = {"project_id": ctx["project"]["id"], "stage_name": "TEST unauthorized stage", "description": "", "status": "Not Started", "order_index": 9, "notes": ""}
    response = ctx["session"].post(f"{BASE_URL}/api/stages", headers=auth_headers(ctx["other_contractor"]["token"]), json=payload, timeout=30)
    if response.status_code == 200:
        ctx["stages"].append(response.json()["id"])
    assert response.status_code == 403


def test_security_other_client_cannot_list_primary_materials(ctx):
    response = ctx["session"].get(f"{BASE_URL}/api/materials", headers=auth_headers(ctx["other_client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30)
    assert response.status_code == 403


def test_security_other_client_cannot_list_primary_payments(ctx):
    response = ctx["session"].get(f"{BASE_URL}/api/payments", headers=auth_headers(ctx["other_client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30)
    assert response.status_code == 403


def test_security_other_client_cannot_list_primary_queries(ctx):
    response = ctx["session"].get(f"{BASE_URL}/api/queries", headers=auth_headers(ctx["other_client"]["token"]), params={"project_id": ctx["project"]["id"]}, timeout=30)
    assert response.status_code == 403


def test_security_other_contractor_cannot_upload_to_primary_project(ctx, tmp_path):
    source = tmp_path / "TEST_unauthorized.txt"
    source.write_text("must not upload", encoding="utf-8")
    with source.open("rb") as handle:
        response = requests.post(
            f"{BASE_URL}/api/drawings/upload", headers=auth_headers(ctx["other_contractor"]["token"]),
            data={"project_id": ctx["project"]["id"], "category": "Other"},
            files={"file": (source.name, handle, "text/plain")}, timeout=150,
        )
    if response.status_code == 200:
        ctx["drawings"].append(response.json()["id"])
    assert response.status_code == 403


def test_security_other_client_cannot_download_primary_drawing(ctx):
    response = ctx["session"].get(f"{BASE_URL}/api/drawings/{ctx['drawing']['id']}/download", headers=auth_headers(ctx["other_client"]["token"]), timeout=90)
    assert response.status_code == 403


def test_not_found_mutations_return_404(ctx):
    missing = f"missing-{ctx['run']}"
    project_delete = ctx["session"].delete(f"{BASE_URL}/api/projects/{missing}", headers=auth_headers(ctx["admin_token"]), timeout=30)
    material_action = ctx["session"].post(f"{BASE_URL}/api/materials/{missing}/action", headers=auth_headers(ctx["admin_token"]), json={"status": "Approved", "admin_remarks": ""}, timeout=30)
    payment_mark = ctx["session"].post(f"{BASE_URL}/api/payments/{missing}/mark", headers=auth_headers(ctx["admin_token"]), json={"status": "Paid"}, timeout=30)
    query_reply = ctx["session"].post(f"{BASE_URL}/api/queries/{missing}/reply", headers=auth_headers(ctx["admin_token"]), json={"response": "x", "resolve": True}, timeout=30)
    assert project_delete.status_code == 404
    assert material_action.status_code == 404
    assert payment_mark.status_code == 404
    assert query_reply.status_code == 404



# Cross-tenant matrix: both unrelated user roles must be denied on every project-scoped collection GET.
@pytest.mark.parametrize("endpoint", ["stages", "materials", "payments", "queries", "drawings"])
@pytest.mark.parametrize("actor_key", ["other_client", "other_contractor"])
def test_security_unrelated_users_cannot_list_any_primary_project_resource(ctx, endpoint, actor_key):
    response = ctx["session"].get(
        f"{BASE_URL}/api/{endpoint}",
        headers=auth_headers(ctx[actor_key]["token"]),
        params={"project_id": ctx["project"]["id"]},
        timeout=30,
    )
    assert response.status_code == 403, f"{actor_key} received {response.status_code} from GET /api/{endpoint}: {response.text[:300]}"


# Cross-tenant POSTs must validate project assignment, not only the caller's broad role.
def test_security_other_contractor_cannot_create_material_for_primary_project(ctx):
    payload = {
        "project_id": ctx["project"]["id"], "material_name": "TEST unauthorized material",
        "quantity": 1, "unit": "bag", "notes": "must be forbidden",
    }
    response = ctx["session"].post(
        f"{BASE_URL}/api/materials", headers=auth_headers(ctx["other_contractor"]["token"]),
        json=payload, timeout=30,
    )
    assert response.status_code == 403, response.text[:300]


@pytest.mark.parametrize("actor_key", ["other_client", "other_contractor"])
def test_security_unrelated_user_cannot_create_query_for_primary_project(ctx, actor_key):
    payload = {
        "project_id": ctx["project"]["id"],
        "subject": f"TEST unauthorized query {actor_key} {ctx['run']}",
        "message": "must be forbidden",
    }
    response = ctx["session"].post(
        f"{BASE_URL}/api/queries", headers=auth_headers(ctx[actor_key]["token"]),
        json=payload, timeout=30,
    )
    assert response.status_code == 403, response.text[:300]


@pytest.mark.parametrize("actor_key", ["other_client", "other_contractor"])
def test_security_unrelated_non_admin_cannot_create_payment_for_primary_project(ctx, actor_key):
    payload = {
        "project_id": ctx["project"]["id"], "installment_no": 99, "amount": 1,
        "due_date": "2026-09-01", "direction": "received_from_client", "status": "Pending",
    }
    response = ctx["session"].post(
        f"{BASE_URL}/api/payments", headers=auth_headers(ctx[actor_key]["token"]),
        json=payload, timeout=30,
    )
    assert response.status_code == 403, response.text[:300]


def test_security_contractor_cannot_reassign_owned_stage_to_other_project(ctx):
    payload = {
        "project_id": ctx["project"]["id"], "stage_name": f"TEST isolation stage {ctx['run']}",
        "description": "TEST stage", "status": "Not Started", "order_index": 97, "notes": "",
    }
    created = assert_json_response(ctx["session"].post(
        f"{BASE_URL}/api/stages", headers=auth_headers(ctx["admin_token"]), json=payload, timeout=30,
    ), 200)
    ctx["stages"].append(created["id"])
    attack_payload = {**payload, "project_id": ctx["other_project"]["id"], "status": "Completed"}
    updated = assert_json_response(ctx["session"].put(
        f"{BASE_URL}/api/stages/{created['id']}",
        headers=auth_headers(ctx["contractor"]["token"]), json=attack_payload, timeout=30,
    ), 200)
    assert updated["project_id"] == ctx["project"]["id"]
    assert updated["status"] == "Completed"
    primary_rows = assert_json_response(ctx["session"].get(
        f"{BASE_URL}/api/stages", headers=auth_headers(ctx["contractor"]["token"]),
        params={"project_id": ctx["project"]["id"]}, timeout=30,
    ), 200)
    assert any(row["id"] == created["id"] and row["project_id"] == ctx["project"]["id"] for row in primary_rows)


def test_all_missing_update_delete_routes_return_404(ctx):
    missing = f"missing-all-{ctx['run']}"
    project_payload = {
        "project_type": "Renovation", "title": "TEST missing", "description": "", "start_date": None,
        "end_date": None, "floors": None, "dimensions": None, "status": "In Progress",
        "client_id": None, "contractor_id": None, "total_amount": 0,
    }
    stage_payload = {
        "project_id": ctx["project"]["id"], "stage_name": "TEST missing", "description": "",
        "status": "Not Started", "order_index": 0, "notes": "",
    }
    checks = {
        "PUT project": ctx["session"].put(f"{BASE_URL}/api/projects/{missing}", headers=auth_headers(ctx["admin_token"]), json=project_payload, timeout=30),
        "DELETE project": ctx["session"].delete(f"{BASE_URL}/api/projects/{missing}", headers=auth_headers(ctx["admin_token"]), timeout=30),
        "PUT stage": ctx["session"].put(f"{BASE_URL}/api/stages/{missing}", headers=auth_headers(ctx["admin_token"]), json=stage_payload, timeout=30),
        "DELETE stage": ctx["session"].delete(f"{BASE_URL}/api/stages/{missing}", headers=auth_headers(ctx["admin_token"]), timeout=30),
        "DELETE payment": ctx["session"].delete(f"{BASE_URL}/api/payments/{missing}", headers=auth_headers(ctx["admin_token"]), timeout=30),
        "DELETE drawing": ctx["session"].delete(f"{BASE_URL}/api/drawings/{missing}", headers=auth_headers(ctx["admin_token"]), timeout=30),
        "DELETE signature": ctx["session"].delete(f"{BASE_URL}/api/cms/signature-projects/{missing}", headers=auth_headers(ctx["admin_token"]), timeout=30),
        "DELETE testimonial": ctx["session"].delete(f"{BASE_URL}/api/cms/testimonials/{missing}", headers=auth_headers(ctx["admin_token"]), timeout=30),
    }
    failures = {name: (response.status_code, response.text[:200]) for name, response in checks.items() if response.status_code != 404}
    assert not failures, f"Missing-resource routes not returning 404: {failures}"
