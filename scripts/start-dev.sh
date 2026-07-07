#!/usr/bin/env bash
# Start the FastAPI backend for development.
# Usage: ./scripts/start-dev.sh
# Stop with Ctrl+C.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ -d "$ROOT/../backend" ]]; then
  BACKEND_DIR="$(cd "$ROOT/../backend" && pwd)"
elif [[ -d "$ROOT/../PortfolioAI-Backend" ]]; then
  BACKEND_DIR="$(cd "$ROOT/../PortfolioAI-Backend" && pwd)"
else
  BACKEND_DIR=""
fi
API_PORT="${API_PORT:-8000}"
API_HOST="${API_HOST:-127.0.0.1}"

BACKEND_PID=""

cleanup() {
  echo ""
  echo "Stopping backend..."
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" 2>/dev/null || true
    wait "${BACKEND_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if [[ -z "${BACKEND_DIR}" || ! -d "${BACKEND_DIR}" ]]; then
  echo "Backend not found. Expected ../backend or ../PortfolioAI-Backend next to the frontend."
  exit 1
fi

if [[ ! -x "${BACKEND_DIR}/.venv/bin/python3" ]]; then
  echo "Backend venv not found. Run from ${BACKEND_DIR}:"
  echo "  python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

if [[ -z "${GEMINI_API_KEY:-}" ]] && ! grep -q '^GEMINI_API_KEY=.\+' "${BACKEND_DIR}/.env" 2>/dev/null; then
  echo "Warning: GEMINI_API_KEY is not set in ${BACKEND_DIR}/.env"
  echo "Get a free key: https://aistudio.google.com/apikey"
fi

echo "Starting backend at http://${API_HOST}:${API_PORT} ..."
(
  cd "${BACKEND_DIR}"
  exec .venv/bin/python3 -m uvicorn app.main:app --reload --host "${API_HOST}" --port "${API_PORT}"
) &
BACKEND_PID=$!

for _ in $(seq 1 30); do
  if curl -sf "http://${API_HOST}:${API_PORT}/api/v1/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo ""
echo "Dev stack running:"
echo "  API:     http://${API_HOST}:${API_PORT}"
echo "  AI:      http://${API_HOST}:${API_PORT}/api/v1/ai/status"
echo "  Docs:    http://${API_HOST}:${API_PORT}/docs"
echo ""
echo "AI provider: Google Gemini (set GEMINI_API_KEY in backend .env)"
echo "Start the frontend separately: npm run dev"
echo "Press Ctrl+C to stop the backend."

wait "${BACKEND_PID}"
