#!/usr/bin/env bash
set -euo pipefail

# Setup Test Environment Variables
# Run this before running tests

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🔧 Setting up test environment variables..."
echo ""

# Generate JWT_SECRET if not set
if [ -z "${JWT_SECRET:-}" ]; then
  export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  echo "✅ Generated JWT_SECRET"
else
  echo "✅ JWT_SECRET already set"
fi

# Set defaults for test environment
export DATABASE_URL="${DATABASE_URL:-postgresql://localhost/northshore}"
export ABEVOICE_API_URL="${ABEVOICE_API_URL:-https://api.abevoice.com}"
export TWILIO_ACCOUNT_SID="${TWILIO_ACCOUNT_SID:-ACtest}"
export TWILIO_AUTH_TOKEN="${TWILIO_AUTH_TOKEN:-test-token}"
export NODE_ENV="${NODE_ENV:-test}"

echo ""
echo "📋 Test Environment Variables:"
echo "  JWT_SECRET: ${JWT_SECRET:0:20}... (${#JWT_SECRET} chars)"
echo "  DATABASE_URL: $DATABASE_URL"
echo "  ABEVOICE_API_URL: $ABEVOICE_API_URL"
echo "  TWILIO_ACCOUNT_SID: $TWILIO_ACCOUNT_SID"
echo "  NODE_ENV: $NODE_ENV"
echo ""
echo "✅ Test environment ready!"
echo ""
echo "Run tests with:"
echo "  cd backend && npm test -- p0-launch-fixes.test.ts"
echo ""

