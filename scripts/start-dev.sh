#!/usr/bin/env bash
# Start Ollama (local AI) and the FastAPI backend for development.
# Usage: ./scripts/start-dev.sh
# Stop with Ctrl+C — both processes are shut down together.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$(cd "$ROOT/../backend" && pwd)"
API_PORT="${API_PORT:-8001}"
API_HOST="${API_HOST:-127.0.0.1}"
OLLAMA_HOST="${OLLAMA_HOST:-127.0.0.1:11434}"
OLLAMA_URL="http://${OLLAMA_HOST}"

export PATH="${HOME}/.local/bin:${PATH}"
export LD_LIBRARY_PATH="${HOME}/.local/ollama/lib/ollama:${LD_LIBRARY_PATH:-}"
export OLLAMA_HOST

OLLAMA_PID=""
BACKEND_PID=""

cleanup() {
  echo ""
  echo "Stopping dev services..."
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    kill "${BACKEND_PID}" 2>/dev/null || true
    wait "${BACKEND_PID}" 2>/dev/null || true
  fi
  if [[ -n "${OLLAMA_PID}" ]] && kill -0 "${OLLAMA_PID}" 2>/dev/null; then
    kill "${OLLAMA_PID}" 2>/dev/null || true
    wait "${OLLAMA_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if [[ ! -d "${BACKEND_DIR}" ]]; then
  echo "Backend not found at ${BACKEND_DIR}"
  exit 1
fi

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama not found. Install it first:"
  echo "  curl -fsSL https://ollama.com/install.sh | sh"
  exit 1
fi

if [[ ! -x "${BACKEND_DIR}/.venv/bin/uvicorn" ]]; then
  echo "Backend venv not found. Run from ${BACKEND_DIR}:"
  echo "  python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

wait_for_ollama() {
  for _ in $(seq 1 30); do
    if curl -sf "${OLLAMA_URL}/api/tags" >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

if curl -sf "${OLLAMA_URL}/api/tags" >/dev/null 2>&1; then
  echo "Ollama already running at ${OLLAMA_URL}"
else
  echo "Starting Ollama at ${OLLAMA_URL}..."
  ollama serve >/tmp/portfolio-ollama.log 2>&1 &
  OLLAMA_PID=$!
  if ! wait_for_ollama; then
    echo "Ollama failed to start. Log: /tmp/portfolio-ollama.log"
    exit 1
  fi
  echo "Ollama is ready."
fi

AI_MODEL="${AI_MODEL:-llama3.2}"
if ! ollama list 2>/dev/null | grep -q "${AI_MODEL}"; then
  echo "Pulling model ${AI_MODEL} (first run only, ~2GB)..."
  ollama pull "${AI_MODEL}"
fi

echo "Starting backend at http://${API_HOST}:${API_PORT} ..."
(
  cd "${BACKEND_DIR}"
  # shellcheck disable=SC1091
  source .venv/bin/activate
  exec uvicorn app.main:app --reload --host "${API_HOST}" --port "${API_PORT}"
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
echo "  Ollama:  ${OLLAMA_URL}"
echo "  API:     http://${API_HOST}:${API_PORT}"
echo "  AI:      http://${API_HOST}:${API_PORT}/api/v1/ai/status"
echo "  Docs:    http://${API_HOST}:${API_PORT}/docs"
echo ""
echo "Start the frontend separately: npm run dev"
echo "Press Ctrl+C to stop Ollama and the backend."

wait "${BACKEND_PID}"
