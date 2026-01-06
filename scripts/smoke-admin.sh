#!/usr/bin/env bash
set -euo pipefail

BASE=${BASE_URL:-http://localhost:5000}

echo "Testing Admin empathy config endpoint..."
curl -sS -X POST -H "Content-Type: application/json" -d '{"facilityId":"default", "config":{"friendliness":60,"empathy":60,"warmth":40,"professionalism":80,"context_window":"medium"}}' "$BASE/api/admin/empathy-config" | jq .

echo "Testing AbëKEYs test endpoint..."
curl -sS -X POST -H "Content-Type: application/json" -d '{"facilityId":"default"}' "$BASE/api/admin/abekeys/test" | jq .

echo "Smoke admin checks complete."