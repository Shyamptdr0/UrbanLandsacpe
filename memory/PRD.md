# Urban Landscape — Product Requirements

## Original Problem Statement
Modernize https://urbanlandscape.in/. Full v2 spec: construction & design platform connecting Clients with Contractors/Professionals. Public marketing site → Admin approves applicants → role-based dashboards manage the project lifecycle (drawings, stages, materials, payments, queries). Brand tone: premium, precision, legacy.

## User Choices (Feb 2026)
- Scope: full end-to-end (public site + Admin/Client/Contractor dashboards)
- Auth: JWT email/password with admin approval flow
- Email: Resend (Emergent managed)
- Storage: Emergent object storage
- Design: fresh distinctive modern aesthetic → "Earthy Brutalism" (bone-white #F4F3EF, terracotta #C55B43, charcoal #1A1A1A, Cabinet Grotesk + Satoshi via Fontshare)

## Personas
- Admin — full control over users, projects, CMS
- Client (Homeowner/Developer) — view-only project tracking, raise queries, view payments
- Contractor/Professional (Architect / Engineer / Interior Designer / Contractor / Material Dealer) — update stages, upload drawings, request materials

## Implemented (Feb 3, 2026)
### Backend (/app/backend/server.py)
- JWT auth (login/register-client/register-contractor/me/change-password)
- Admin approval → auto user_code (CL-1001 / CT-2001) + temp password + Resend email
- Projects CRUD, tenant-scoped enrich (client/contractor embed)
- Drawings (multipart upload → Emergent object storage, retry x3, JWT header/query download, tenant guard)
- Stages, Materials (approve/reject), Payments (installments both directions), Queries (thread + resolve)
- CMS: Hero, Signature Projects, Testimonials
- Public Inquiries
- Admin/Client/Contractor stats dashboards
- Centralized `assert_project_access()` for tenant isolation

### Frontend (React + shadcn + Tailwind)
- Marketing: Home (hero, signatures, methodology, testimonials, inquiry, value pillars), Services, HowItWorks, CostEstimator (interactive), Projects, About, Contact, JoinClient, JoinContractor
- Auth: Unified /login with tabs (Client/Contractor/Admin), + `/client/login`, `/contractor/login`
- Dashboards: Admin (9 modules), Client (8 modules), Contractor (8 modules) — DashboardShell with sidebar
- Design system: Cabinet Grotesk headings, Satoshi body, JetBrains Mono for markers; terracotta CTAs, stat-chip grid, grain-friendly bone-white bg

## Backlog / Next
- P1: file scan / virus-check on drawings, thumbnail generation
- P1: cascading delete for projects (drawings/stages/materials/queries)
- P1: async object storage client (currently blocking requests)
- P2: notifications (email on material approval, query reply, payment due)
- P2: multi-file / folder upload for drawings (currently single file)
- P2: cost estimator → save to lead
- P2: analytics charts on admin home (payment trend, project mix)
