# PortfolioAI — Frontend

Next.js app for the AI-Powered Portfolio Builder.

## New developer?

**Start here:** [SETUP.md](./SETUP.md) — complete guide for database, backend, Gemini AI, frontend, and optional Google OAuth / Meet booking.

## Quick start (after setup)

```bash
# Terminal 1 — Backend
./scripts/start-dev.sh

# Terminal 2 — UI
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `./scripts/start-dev.sh` | Start backend (sibling `../PortfolioAI-Backend`) |

## Environment

Copy `.env.local.example` → `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=   # optional
```

## Tech stack

- Next.js 16 · React 19 · TypeScript  
- Redux Toolkit (RTK Query)  
- Tailwind CSS · shadcn/ui  

Backend repo: sibling folder `../PortfolioAI-Backend` (FastAPI + PostgreSQL + Gemini).
