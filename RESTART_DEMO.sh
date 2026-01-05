#!/usr/bin/env bash
# Quick restart for North Shore Voice demo after code changes

set -e

echo "🔄 Restarting North Shore Voice Demo..."

# Kill existing processes
echo "Stopping existing services..."
lsof -ti:5050 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
sleep 2

# Restart
echo "Starting services..."
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/START_DEMO.sh"
