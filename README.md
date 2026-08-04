# Urban Landscape — Construction & Design Platform

A full-stack platform connecting **Clients** (homeowners/developers) with **Contractors/Professionals** (architects, engineers, interior designers, contractors, material dealers). Public marketing site → Admin approves → role-based dashboards manage the full project lifecycle: drawings, stages, materials, payments, and queries.

Built with **FastAPI + MongoDB + React** and a modern *Earthy Brutalism* design system (Cabinet Grotesk + Satoshi, bone-white / terracotta / charcoal).

---

## 1. Project structure

```
/app
├── backend/                # FastAPI + Motor (MongoDB async driver)
│   ├── server.py           # All API routes (auth, projects, drawings, stages, materials, payments, queries, CMS, inquiries, downloads)
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend environment (MongoDB URL, JWT secret, keys)
├── frontend/               # React 19 + Tailwind + shadcn/ui + framer-motion
│   ├── src/
│   │   ├── App.js          # Routes
│   │   ├── contexts/AuthContext.jsx
│   │   ├── lib/api.js      # Axios instance with JWT interceptor
│   │   ├── components/     # marketing/, dashboard/, ui/
│   │   └── pages/          # marketing/, auth/, dashboard/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env                # REACT_APP_BACKEND_URL
└── README.md
```

---

## 2. Prerequisites

- **Python 3.11+**
- **Node.js 20+** with **Yarn** (do **not** use npm — the project uses yarn.lock)
- **MongoDB 6+** running locally on `mongodb://localhost:27017` (or update `MONGO_URL` in `backend/.env`)

Install core tooling if you don't already have it:

```bash
# macOS (Homebrew)
brew install python@3.11 node yarn mongodb-community
brew services start mongodb-community

# Ubuntu / Debian
sudo apt install python3.11 python3-pip
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn
# MongoDB: follow https://www.mongodb.com/docs/manual/administration/install-on-linux/
```

---

## 3. Backend setup

```bash
cd backend
python3 -m venv .venv  
py -3.12 -m venv .venv  

source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python -m uvicorn server:app --reload   
```
 
### Environment (`backend/.env`)

The file is included in this ZIP. Key variables:

| Key | Purpose |
| --- | --- |
| `MONGO_URL` | MongoDB connection string (default `mongodb://localhost:27017`) |
| `DB_NAME` | Database name (default `test_database`) |
| `JWT_SECRET` | Random string used to sign JWT tokens — **change in production** |
| `EMERGENT_EMAIL_KEY` | Emergent-managed Resend key (for the credentials email on approval) |
| `EMERGENT_LLM_KEY` | Emergent universal key (used to init object storage) |
| `EMAIL_FROM_NAME` | Sender name on transactional emails |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seeded admin account (auto-created on first startup) |
| `CORS_ORIGINS` | Comma-separated allowed origins (default `*`) |

### Run

```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The API is now at `http://localhost:8001/api/` and on first boot it seeds the admin user + initializes object storage.


What you want to do	Correct command
Install from requirements.txt	uv pip install -r requirements.txt
Install a single package	uv pip install pydantic
List installed packages	uv pip list
Run a script/server	uv run uvicorn server:app --reload


---

## 4. Frontend setup

```bash
cd frontend
yarn install
```

### Environment (`frontend/.env`)

```
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
```

If the backend is on a different host or port, change `REACT_APP_BACKEND_URL` (no trailing slash).

### Run

```bash
yarn start
```

Frontend opens at `http://localhost:3000`.

---

## 5. First-time login

Once both services are running:

1. Visit `http://localhost:3000`
2. Open the "More" menu → **Admin Login** (or go to `/login` → Admin tab)
3. Sign in with the seeded credentials (see `backend/.env`):
   - **Email:** `admin@urbanlandscape.in`
   - **Password:** `Admin@2026`
4. You will land at `/admin`. From there:
   - **Users** → review pending client/contractor applications, click **Approve** to auto-generate a user code + temp password (also emailed via Resend)
   - **Projects** → create a project and assign it to an approved client + contractor
   - **CMS** → edit the hero, add signature projects & testimonials — these render on the homepage

**Client / Contractor workflow:**
1. Visitor registers at `/join/client` or `/join/contractor`
2. Application appears as *pending* in the admin **Users** tab
3. Admin approves → applicant receives credentials by email
4. Applicant signs in at `/client/login` or `/contractor/login`

---

## 6. Feature summary

### Public marketing site
- Homepage (hero, signature projects, methodology, testimonials, inquiry form, value pillars)
- Services, How it Works, Cost Estimator (interactive), Projects, About, Contact
- Join as Client / Join as Professional (registration forms)

### Admin dashboard
- Overview stats (projects, payments, users, materials, queries)
- Users (approve/reject applicants, filter by role/status)
- Projects (CRUD, assign client/contractor)
- Drawings (upload to Emergent object storage, category tagging)
- Stages (add/edit, status flow, progress bar)
- Materials (approve/reject contractor requests with remarks)
- Payments (per-project installments, both directions)
- Queries (thread + resolve)
- Website CMS (hero, signature projects, testimonials)

### Client dashboard
- Stats (active/completed projects, paid/remaining)
- Read-only project details, stages, drawings, materials
- Payment schedule
- Raise queries
- Profile + password change

### Contractor dashboard
- Stats (assigned projects, agreed vs received)
- Update stage status, upload drawings, request materials
- View payment schedule
- Raise queries
- Profile + password change

---

## 7. Security & configuration notes

- **Change `JWT_SECRET`** in `backend/.env` before deploying to production.
- **Change `ADMIN_PASSWORD`** in `backend/.env` (or rotate the seeded admin via the *Change Password* screen after first login).
- All backend routes are prefixed with `/api` and gated by JWT + role checks. Cross-tenant reads/writes are blocked by a centralized `assert_project_access` guard.
- File uploads go through Emergent's managed object storage; the `EMERGENT_LLM_KEY` is required to initialize it on startup.
- Cross-Origin Resource Sharing (`CORS_ORIGINS`) is `*` by default — restrict in production.

---

## 8. Deployment tips

The app expects backend on port `8001` and frontend on `3000`. In production:

- Reverse-proxy `/api/*` requests to the backend (nginx / Cloudflare / Emergent ingress already handles this)
- Serve the built frontend (`yarn build`) as static assets
- Point `REACT_APP_BACKEND_URL` to the public API URL before running `yarn build`
- Run backend under a process manager (e.g. supervisor, systemd) — do **not** rely on `--reload` in production

---

## 9. Tech stack

**Backend:** FastAPI · Motor (async MongoDB) · PyJWT · bcrypt · httpx · requests · Uvicorn
**Frontend:** React 19 · React Router 7 · Tailwind 3 · shadcn/ui · Radix UI · framer-motion · axios · sonner (toasts) · lucide-react
**Fonts:** Cabinet Grotesk (headings) + Satoshi (body) + JetBrains Mono (markers) via Fontshare

---

## 10. Troubleshooting

- **Login says "Invalid credentials"** — confirm the applicant was approved and the temp password was copied from the admin dialog (or the credentials email).
- **File upload returns 502** — the object storage service may be temporarily unavailable; the backend already retries 3x. Check backend logs.
- **Homepage hero not updating** — the hero is fetched from `/api/cms/hero`; verify the admin *Website* section saved successfully.
- **"Module not found" on frontend start** — always use `yarn install`, never `npm install`.

---

© Urban Landscape — Legacy engineered.
