#!/usr/bin/env bash
set -euo pipefail

# Simple dev smoke check: start backend and frontend dev servers and validate endpoints
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
BACKEND_PORT="${BACKEND_PORT:-5050}"
BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
FRONTEND_HOST="${FRONTEND_HOST:-127.0.0.1}"

# Check if a TCP port is already in use. Uses lsof or nc if available.
check_port_free() {
  local port="$1"
  local host="${2:-127.0.0.1}"

  if command -v lsof >/dev/null 2>&1; then
    if lsof -iTCP:"$port" -sTCP:LISTEN -P -n >/dev/null 2>&1; then
      return 1
    else
      return 0
    fi
  elif command -v nc >/dev/null 2>&1; then
    if nc -z "$host" "$port" >/dev/null 2>&1; then
      return 1
    else
      return 0
    fi
  else
    echo "Warning: cannot check ports (no lsof or nc). Proceeding without port pre-checks."
    return 0
  fi
}

# Check backend port availability
if ! check_port_free "$BACKEND_PORT" "$BACKEND_HOST"; then
  echo "Port $BACKEND_PORT appears to be in use. If you're running the backend in Docker, use the container-mapped port (e.g. 5001) or stop the process using the port."
  if command -v lsof >/dev/null 2>&1; then
    echo "Processes listening on $BACKEND_PORT:"
    lsof -iTCP:"$BACKEND_PORT" -sTCP:LISTEN -P -n || true
  fi
  exit 1
fi

echo "Starting backend (dev)..."
cd "$BACKEND_DIR"
PORT="$BACKEND_PORT" HOST="$BACKEND_HOST" npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
cd - >/dev/null

# Wait for backend
echo "Waiting for backend /api/status..."
for i in $(seq 1 30); do
  if curl -sSf "http://${BACKEND_HOST}:${BACKEND_PORT}/api/status" >/dev/null 2>&1; then
    echo "Backend is up"
    break
  fi
  echo "waiting for backend... ($i)"
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "Backend did not become ready"
    tail -n 200 /tmp/backend.log || true
    kill $BACKEND_PID || true
    exit 1
  fi
done

# Start frontend
# Check frontend port availability
if ! check_port_free "$FRONTEND_PORT" "$FRONTEND_HOST"; then
  echo "Port $FRONTEND_PORT appears to be in use. Stop it or set FRONTEND_PORT to a free port."
  if command -v lsof >/dev/null 2>&1; then
    echo "Processes listening on $FRONTEND_PORT:"
    lsof -iTCP:"$FRONTEND_PORT" -sTCP:LISTEN -P -n || true
  fi
  kill $BACKEND_PID || true
  exit 1
fi

echo "Starting frontend (dev)..."
cd "$FRONTEND_DIR"
# Force Vite to use the requested port/host (overrides vite.config.ts server.port)
npm run dev -- --port "$FRONTEND_PORT" --host "$FRONTEND_HOST" > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
cd - >/dev/null

# Wait for frontend
echo "Waiting for frontend root..."
for i in $(seq 1 30); do
  if curl -sSf -o /dev/null "http://${FRONTEND_HOST}:${FRONTEND_PORT}/"; then
    echo "Frontend is up"
    break
  fi
  echo "waiting for frontend... ($i)"
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "Frontend did not become ready"
    tail -n 200 /tmp/frontend.log || true
    kill $BACKEND_PID || true
    kill $FRONTEND_PID || true
    exit 1
  fi
done

# Run checks
echo "Checking backend status response"
STATUS=$(curl -sSf "http://${BACKEND_HOST}:${BACKEND_PORT}/api/status" | jq -r '.status' || true)
echo "status=$STATUS"
if [ "$STATUS" != "ok" ] && [ "$STATUS" != "online" ]; then
  echo "Unexpected backend status: $STATUS"
  kill $BACKEND_PID || true
  kill $FRONTEND_PID || true
  exit 1
fi

# Test login (expect 200 and Set-Cookie)
echo "Testing login"
LOGIN_RESP=$(curl -s -i -X POST "http://${BACKEND_HOST}:${BACKEND_PORT}/api/auth/login" -H "Content-Type: application/json" -d '{"email":"test","password":"test"}' || true)
if echo "$LOGIN_RESP" | grep -i "Set-Cookie: JSESSIONID" >/dev/null 2>&1; then
  echo "Set-Cookie present"
else
  echo "Set-Cookie not found. Response:"
  echo "$LOGIN_RESP"
  kill $BACKEND_PID || true
  kill $FRONTEND_PID || true
  exit 1
fi

# Check frontend root
curl -sSf -o /dev/null "http://${FRONTEND_HOST}:${FRONTEND_PORT}/" || (echo "Frontend root failed" && kill $BACKEND_PID || true && kill $FRONTEND_PID || true && exit 1)

echo "Smoke checks passed"

# Teardown
kill $BACKEND_PID || true
kill $FRONTEND_PID || true

exit 0
