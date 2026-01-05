#!/usr/bin/env bash
# Simple script to start the North Shore Voice demo
# Run from anywhere: bash START_DEMO.sh

set -e

PROJECT_ROOT="/Users/michaelmataluni/Desktop/North Shore Phani/north-shore"
cd "$PROJECT_ROOT"

echo "🚀 Starting North Shore Voice Demo"
echo ""

# Kill any existing processes on these ports
echo "Cleaning up existing processes..."
lsof -ti:5050 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2

# Set required environment variables for demo mode
export JWT_SECRET="demo-jwt-secret-for-local-testing-only-minimum-32-chars-required"
export DATABASE_URL="file:./dev.db"
export ABEVOICE_API_URL="http://localhost:5050"
export NODE_ENV="development"
export PORT=5050
export HOST=127.0.0.1

# Start backend
echo "Starting backend on port 5050..."
cd "$PROJECT_ROOT/backend"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
fi

# Generate Prisma client if needed
if [ ! -d "node_modules/.prisma" ]; then
  echo "Generating Prisma client..."
  npx prisma generate
fi

# Start backend in background
npm run dev > /tmp/northshore-backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend
echo "Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -sf http://127.0.0.1:5050/api/status > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  sleep 1
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start. Check logs:"
    tail -n 50 /tmp/northshore-backend.log
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
  fi
done

# Start frontend
echo ""
echo "Starting frontend on port 3001..."
cd "$PROJECT_ROOT/frontend"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start frontend in background
VITE_API_URL=http://127.0.0.1:5050 npm run dev -- --port 3001 --host 127.0.0.1 > /tmp/northshore-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend
echo "Waiting for frontend to be ready..."
for i in {1..30}; do
  if curl -sf http://127.0.0.1:3001 > /dev/null 2>&1; then
    echo "✅ Frontend is ready!"
    break
  fi
  sleep 1
  if [ $i -eq 30 ]; then
    echo "❌ Frontend failed to start. Check logs:"
    tail -n 50 /tmp/northshore-frontend.log
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 1
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 North Shore Voice Demo is LIVE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Frontend: http://127.0.0.1:3001"
echo "Backend:  http://127.0.0.1:5050"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Logs:"
echo "  Backend:  /tmp/northshore-backend.log"
echo "  Frontend: /tmp/northshore-frontend.log"
echo ""
echo "To stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit 0" INT TERM

# Keep script running
wait
