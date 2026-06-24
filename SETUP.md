# PortfolioAI — Developer Setup Guide

Complete step-by-step instructions for new developers to run **PortfolioAI** locally (backend, frontend, database, and Ollama AI).

---

## Table of contents

1. [What you are setting up](#1-what-you-are-setting-up)
2. [Prerequisites](#2-prerequisites)
3. [Project layout](#3-project-layout)
4. [PostgreSQL (database)](#4-postgresql-database)
5. [Backend setup](#5-backend-setup)
6. [Ollama setup (local AI)](#6-ollama-setup-local-ai)
7. [Frontend setup](#7-frontend-setup)
8. [Run the full stack](#8-run-the-full-stack)
9. [Verify everything works](#9-verify-everything-works)
10. [Optional: Google Sign-In](#10-optional-google-sign-in)
11. [Optional: Google Meet booking](#11-optional-google-meet-booking)
12. [Optional: Gemini instead of Ollama](#12-optional-gemini-instead-of-ollama)
13. [Optional: Email (SMTP)](#13-optional-email-smtp)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. What you are setting up

| Service | Port | Purpose |
|---------|------|---------|
| **Next.js frontend** | 3000 | Dashboard, portfolio builder, public portfolios |
| **FastAPI backend** | 8001 (dev) | REST API, auth, AI, file uploads |
| **PostgreSQL** | 5433 | Database (Docker maps host 5433 → container 5432) |
| **Ollama** | 11434 | Local LLM for AI features (resume import, copilot, etc.) |

In **development**, Pro features require a Pro subscription (or an explicit bypass flag — see below).

---

## 2. Prerequisites

Install these before you start:

| Tool | Version | Check |
|------|---------|--------|
| **Git** | any recent | `git --version` |
| **Node.js** | 20+ | `node --version` |
| **npm** | 10+ | `npm --version` |
| **Python** | 3.11+ (3.12–3.14 tested) | `python3 --version` |
| **Docker** | recent | `docker --version` |
| **Docker Compose** | v2+ | `docker compose version` |
| **curl** | any | `curl --version` |

**Linux only (Ollama):** `curl`, `sudo` for install script.

**Optional:** [Google Cloud](https://console.cloud.google.com/) account for Google Sign-In and Meet booking.

---

## 3. Project layout

After clone, you should have **two sibling folders**:

```
your-workspace/
├── AI-powered portfolio/    ← Frontend (Next.js) — open this in your IDE
└── backend/                 ← Backend (FastAPI)
```

> If your folders are named differently, adjust paths in the commands below.

---

## 4. PostgreSQL (database)

The backend includes Docker Compose for PostgreSQL.

### 4.1 Start the database

```bash
cd backend
docker compose up -d
```

### 4.2 Confirm it is running

```bash
docker compose ps
```

You should see `portfolio_postgres` with status **running**.

Default connection (used in `.env`):

```
Host:     localhost
Port:     5433
User:     portfolio
Password: portfolio
Database: portfolio_db
```

### 4.3 Stop the database (when needed)

```bash
cd backend
docker compose down
```

Data is kept in a Docker volume (`portfolio_pg_data`). To wipe data: `docker compose down -v`.

---

## 5. Backend setup

All commands below are from the **`backend/`** directory.

### 5.1 Create a virtual environment

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
```

Your shell prompt should show `(.venv)`.

### 5.2 Install Python dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 5.3 Configure environment variables

```bash
cp .env.example .env
```

Edit `backend/.env`. Minimum required for local dev:

```env
DATABASE_URL=postgresql+psycopg://portfolio:portfolio@localhost:5433/portfolio_db
SECRET_KEY=dev-change-me-use-openssl-rand-hex-32-in-production
APP_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# AI — Ollama (see section 6)
AI_PROVIDER=ollama
AI_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434
```

Generate a strong `SECRET_KEY` for production:

```bash
openssl rand -hex 32
```

### 5.4 Run database migrations

```bash
# still in backend/, venv activated
alembic upgrade head
```

You should see migrations apply without errors.

### 5.5 Seed default data (templates)

```bash
python -m scripts.seed_db
```

Expected output: `Database seeded successfully.`

### 5.6 Start the API (manual option)

**Option A — recommended for full stack:** use the frontend dev script (starts Ollama + backend on port **8001**). See [section 8](#8-run-the-full-stack).

**Option B — backend only on port 8000:**

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If you use port **8000**, set the frontend `NEXT_PUBLIC_API_URL` to `http://localhost:8000/api/v1`.

### 5.7 Check the API

```bash
curl http://localhost:8001/api/v1/health
# or port 8000 if you started manually
```

Expected:

```json
{"status":"ok","environment":"development"}
```

API docs: http://localhost:8001/docs

---

## 6. Ollama setup (local AI)

PortfolioAI uses **Ollama** by default for AI features (portfolio review, resume parsing, copilot chat, etc.).

### 6.1 Install Ollama

**Linux / macOS:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:** download the installer from [https://ollama.com](https://ollama.com).

Verify:

```bash
ollama --version
```

### 6.2 Start Ollama

Usually the install starts a background service. Check:

```bash
curl http://localhost:11434/api/tags
```

If that fails, start the server manually:

```bash
ollama serve
```

Keep it running in a terminal, or use `scripts/start-dev.sh` from the frontend (starts Ollama for you).

### 6.3 Pull the default model

```bash
ollama pull llama3.2
```

This downloads ~2GB on first run. Match the model name in `backend/.env`:

```env
AI_MODEL=llama3.2
```

Other models you can try: `llama3.1`, `mistral`, `phi3` — update `AI_MODEL` accordingly.

### 6.4 Verify AI from the API

With backend running:

```bash
curl http://localhost:8001/api/v1/ai/status
```

(Requires a logged-in session for full details; Swagger at `/docs` is easier after you register.)

### 6.5 Ollama + backend together (easy path)

From the **frontend** folder:

```bash
cd "AI-powered portfolio"
./scripts/start-dev.sh
```

This script:

1. Starts Ollama if not running  
2. Pulls `llama3.2` if missing  
3. Starts the FastAPI backend on **http://127.0.0.1:8001**

---

## 7. Frontend setup

All commands below are from the **`AI-powered portfolio/`** directory.

### 7.1 Install Node dependencies

```bash
cd "AI-powered portfolio"
npm install
```

### 7.2 Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
```

Use port **8000** only if you started the backend on 8000 manually.

### 7.3 Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7.4 Production build (optional check)

```bash
npm run build
npm start
```

---

## 8. Run the full stack

Use **two terminals** for daily development.

### Terminal 1 — API + Ollama

```bash
cd "AI-powered portfolio"
./scripts/start-dev.sh
```

Wait for:

```
Dev stack running:
  API:     http://127.0.0.1:8001
```

### Terminal 2 — Frontend

```bash
cd "AI-powered portfolio"
npm run dev
```

### Terminal 3 — Database (one-time / when needed)

```bash
cd backend
docker compose up -d
```

### Quick reference

| URL | What |
|-----|------|
| http://localhost:3000 | Web app |
| http://localhost:8001/docs | Swagger API docs |
| http://localhost:8001/api/v1/health | Health check |
| http://localhost:11434 | Ollama |

---

## 9. Verify everything works

### 9.1 Create an account

1. Open http://localhost:3000  
2. Click **Sign up**  
3. Register with email/password  
4. You should land on the **Dashboard**

### 9.2 Complete onboarding

Fill profile, skills, projects — confirm data saves (no console errors).

### 9.3 Test AI

1. Go to **AI Assistance**  
2. If Ollama is running and your account is Pro, AI tools should be available  
3. Try **Portfolio review** or **Ask AI** on a dashboard page

### 9.4 Test public portfolio

1. Set a public username in **Settings**  
2. Open `http://localhost:3000/your-username`  
3. Portfolio should render with your chosen template

### 9.5 Checklist

- [ ] `docker compose ps` shows Postgres running  
- [ ] `curl http://localhost:8001/api/v1/health` returns `"ok"`  
- [ ] `curl http://localhost:11434/api/tags` returns JSON  
- [ ] Frontend loads at localhost:3000  
- [ ] Register / login works  
- [ ] Templates page shows 7 templates  

---

## 10. Optional: Google Sign-In

### Google Cloud Console

1. Create a project (or use existing)  
2. **APIs & Services → Credentials → Create OAuth client ID**  
3. Type: **Web application**  
4. **Authorized JavaScript origins:** `http://localhost:3000`  
5. Copy **Client ID** and **Client secret**

### Backend `.env`

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

(Client secret is only needed for Calendar OAuth, not basic Google login ID token flow on frontend.)

### Frontend `.env.local`

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Restart frontend after changes.

### OAuth consent screen (Testing mode)

Add your Gmail under **Audience → Test users**, or you will see **403 access_denied**.

---

## 11. Optional: Google Meet booking

Requires Google Sign-In client + Calendar API.

### Enable APIs

1. [Google Calendar API](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com) → **Enable**

### Backend `.env`

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8001/api/v1/meetings/google/callback
```

### Google OAuth client

Add **Authorized redirect URI:**

```
http://localhost:8001/api/v1/meetings/google/callback
```

### In the app

1. **Settings → Google Meet booking → Connect Google Calendar**  
2. Set availability → enable **Show booking on portfolio**  
3. Test booking on your public portfolio URL  

---

## 12. Optional: Gemini instead of Ollama

If you prefer cloud AI over local Ollama:

**Backend `.env`:**

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key-from-aistudio.google.com
GEMINI_MODEL=gemini-2.0-flash
```

Get a key: [Google AI Studio](https://aistudio.google.com/apikey).

Restart the backend. Ollama is not required when `AI_PROVIDER=gemini`.

---

## 13. Optional: Email (SMTP)

Without SMTP, emails (verification, password reset, meeting invites) are **printed to the backend console**.

**Backend `.env`:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=PortfolioAI <your@gmail.com>
SMTP_USE_TLS=true
```

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your main password.

---

## 14. Troubleshooting

### `Backend not found` when running `start-dev.sh`

The script expects `backend/` as a **sibling** of `AI-powered portfolio/`:

```
parent/
├── AI-powered portfolio/
└── backend/
```

### Database connection refused

```bash
cd backend && docker compose up -d
docker compose ps
```

Confirm `DATABASE_URL` uses port **5433**.

### `alembic upgrade head` fails

- Postgres must be running  
- `DATABASE_URL` in `.env` must be correct  
- Virtualenv must be activated  

### Frontend cannot reach API

- Backend running on 8001?  
- `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1`  
- Restart `npm run dev` after changing `.env.local`  

### AI features unavailable

```bash
curl http://localhost:11434/api/tags
ollama pull llama3.2
```

Check `AI_PROVIDER=ollama` and `OLLAMA_BASE_URL` in `backend/.env`.

### Testing Pro features locally

Pro gating is **on** by default. To test Pro as a free user, either:

**Grant Pro in the database:**

```sql
UPDATE users SET subscription_plan = 'pro' WHERE email = 'your@email.com';
```

**Or enable a temporary bypass** (not for production):

- Backend `.env`: `BYPASS_PRO_GATING=true`
- Frontend `.env.local`: `NEXT_PUBLIC_BYPASS_PRO_GATING=true`

Restart the API and `npm run dev` after changing env vars.

### Google OAuth 403 access_denied

Add your email as a **test user** on the OAuth consent screen (Audience).

### Meet booking: Calendar API error

Enable **Google Calendar API** in Google Cloud Console and wait 1–2 minutes.

### Port already in use

```bash
# Find process on 8001
fuser 8001/tcp
# Kill if needed (dev only)
fuser -k 8001/tcp
```

---

## Need more detail?

- Backend API modules: `backend/README.md`  
- Environment reference: `backend/.env.example` and `.env.local.example`  

Welcome to the team — happy building.
