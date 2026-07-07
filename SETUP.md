# PortfolioAI — Developer Setup Guide

Complete step-by-step instructions for new developers to run **PortfolioAI** locally (backend, frontend, database, and Gemini AI).

---

## Table of contents

1. [What you are setting up](#1-what-you-are-setting-up)
2. [Prerequisites](#2-prerequisites)
3. [Project layout](#3-project-layout)
4. [PostgreSQL (database)](#4-postgresql-database)
5. [Backend setup](#5-backend-setup)
6. [Google Gemini AI setup](#6-google-gemini-ai-setup)
7. [Frontend setup](#7-frontend-setup)
8. [Run the full stack](#8-run-the-full-stack)
9. [Verify everything works](#9-verify-everything-works)
10. [Optional: Google Sign-In](#10-optional-google-sign-in)
11. [Optional: Google Meet booking](#11-optional-google-meet-booking)
12. [Optional: Email (SMTP)](#12-optional-email-smtp)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. What you are setting up

| Service | Port | Purpose |
|---------|------|---------|
| **Next.js frontend** | 3000 | Dashboard, portfolio builder, public portfolios |
| **FastAPI backend** | 8000 (dev) | REST API, auth, AI, file uploads |
| **PostgreSQL** | 5433 | Database (Docker maps host 5433 → container 5432) |
| **Google Gemini API** | — | Cloud AI for resume import, copilot, portfolio review |

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

**Optional:** [Google Cloud](https://console.cloud.google.com/) account for Google Sign-In and Meet booking.

**AI:** A free [Google AI Studio](https://aistudio.google.com/apikey) API key for Gemini (required for AI features).

---

## 3. Project layout

After clone, you should have **two sibling folders**:

```
your-workspace/
├── AI-powered portfolio/    ← Frontend (Next.js) — open this in your IDE
└── PortfolioAI-Backend/     ← Backend (FastAPI)
```

> If your folders are named differently (`backend/` instead of `PortfolioAI-Backend/`), adjust paths in the commands below. The dev script checks both names.

---

## 4. PostgreSQL (database)

The backend includes Docker Compose for PostgreSQL.

### 4.1 Start the database

```bash
cd PortfolioAI-Backend
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
cd PortfolioAI-Backend
docker compose down
```

Data is kept in a Docker volume (`portfolio_pg_data`). To wipe data: `docker compose down -v`.

---

## 5. Backend setup

All commands below are from the **`PortfolioAI-Backend/`** directory.

### 5.1 Create a virtual environment

```bash
cd PortfolioAI-Backend
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

Edit `PortfolioAI-Backend/.env`. Minimum required for local dev:

```env
DATABASE_URL=postgresql+psycopg://portfolio:portfolio@localhost:5433/portfolio_db
SECRET_KEY=dev-change-me-use-openssl-rand-hex-32-in-production
APP_ENV=development
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# AI — Google Gemini (see section 6)
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key-from-aistudio.google.com
GEMINI_MODEL=gemini-2.0-flash
```

Generate a strong `SECRET_KEY` for production:

```bash
openssl rand -hex 32
```

### 5.4 Run database migrations

```bash
# still in PortfolioAI-Backend/, venv activated
PYTHONPATH=. python -m alembic upgrade head
```

You should see migrations apply without errors.

### 5.5 Seed default data (templates)

```bash
PYTHONPATH=. python -m scripts.seed_db
```

Expected output: `Database seeded successfully.`

### 5.6 Start the API (manual option)

**Option A — recommended:** use the frontend dev script (starts backend on port **8000**). See [section 8](#8-run-the-full-stack).

**Option B — backend only, manually:**

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 5.7 Check the API

```bash
curl http://localhost:8000/api/v1/health
```

Expected:

```json
{"status":"ok","environment":"development"}
```

API docs: http://localhost:8000/docs

---

## 6. Google Gemini AI setup

PortfolioAI uses the **free Google Gemini API** for AI features (portfolio review, resume parsing, copilot chat, etc.). No local LLM install required.

### 6.1 Get a free API key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key into `PortfolioAI-Backend/.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.0-flash
```

### 6.2 Free tier limits

Gemini’s free tier has rate limits (requests per minute/day). If you hit limits, wait a few minutes and try again. Check usage in [Google AI Studio](https://aistudio.google.com/).

### 6.3 Verify AI from the API

With backend running and a logged-in session, open **AI Assistance** in the app or check Swagger at `/docs` → `GET /api/v1/ai/status`.

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
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

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

### Terminal 1 — Backend

```bash
cd "AI-powered portfolio"
./scripts/start-dev.sh
```

Wait for:

```
Dev stack running:
  API:     http://127.0.0.1:8000
```

### Terminal 2 — Frontend

```bash
cd "AI-powered portfolio"
npm run dev
```

### Terminal 3 — Database (one-time / when needed)

```bash
cd PortfolioAI-Backend
docker compose up -d
```

### Quick reference

| URL | What |
|-----|------|
| http://localhost:3000 | Web app |
| http://localhost:8000/docs | Swagger API docs |
| http://localhost:8000/api/v1/health | Health check |

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
2. If your account is Pro and `GEMINI_API_KEY` is set, AI tools should be available  
3. Try **Portfolio review** or **Ask AI** on a dashboard page

### 9.4 Test public portfolio

1. Set a public username in **Settings**  
2. Open `http://localhost:3000/your-username`  
3. Portfolio should render with your chosen template

### 9.5 Checklist

- [ ] `docker compose ps` shows Postgres running  
- [ ] `curl http://localhost:8000/api/v1/health` returns `"ok"`  
- [ ] `GEMINI_API_KEY` is set in backend `.env`  
- [ ] Frontend loads at localhost:3000  
- [ ] Register / login works  
- [ ] Templates page shows templates  

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
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:8000/api/v1/meetings/google/callback
```

### Google OAuth client

Add **Authorized redirect URI:**

```
http://localhost:8000/api/v1/meetings/google/callback
```

### In the app

1. **Settings → Google Meet booking → Connect Google Calendar**  
2. Set availability → enable **Show booking on portfolio**  
3. Test booking on your public portfolio URL  

---

## 12. Optional: Email (SMTP)

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

For production without a custom domain, consider [Brevo](https://www.brevo.com) or [Resend](https://resend.com).

---

## 13. Troubleshooting

### `Backend not found` when running `start-dev.sh`

The script expects `PortfolioAI-Backend/` or `backend/` as a **sibling** of `AI-powered portfolio/`:

```
parent/
├── AI-powered portfolio/
└── PortfolioAI-Backend/
```

### Database connection refused

```bash
cd PortfolioAI-Backend && docker compose up -d
docker compose ps
```

Confirm `DATABASE_URL` uses port **5433**.

### `alembic upgrade head` fails

- Postgres must be running  
- `DATABASE_URL` in `.env` must be correct  
- Virtualenv must be activated  
- Run: `PYTHONPATH=. python -m alembic upgrade head`

### Frontend cannot reach API

- Backend running on 8000?  
- `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`  
- Restart `npm run dev` after changing `.env.local`  

### AI features unavailable

1. Check `GEMINI_API_KEY` is set in `PortfolioAI-Backend/.env`  
2. Confirm `AI_PROVIDER=gemini`  
3. Restart the backend after changing `.env`  
4. Check [Google AI Studio](https://aistudio.google.com/apikey) for quota/errors  
5. AI features require a **Pro** subscription (or bypass flag below)

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
# Find process on 8000
fuser 8000/tcp
# Kill if needed (dev only)
fuser -k 8000/tcp
```

---

## Need more detail?

- Backend API modules: `PortfolioAI-Backend/README.md`  
- Environment reference: `PortfolioAI-Backend/.env.example` and `.env.local.example`  

Welcome to the team — happy building.
