#!/usr/bin/env bash
set -euo pipefail

# Check Environment Variables
# Works from ANY directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔍 Checking Environment Variables..."
echo ""

REQUIRED_VARS=(
  "JWT_SECRET"
  "DATABASE_URL"
  "ABEVOICE_API_URL"
)

OPTIONAL_VARS=(
  "TWILIO_ACCOUNT_SID"
  "TWILIO_AUTH_TOKEN"
  "TELNYX_API_KEY"
  "PLIVO_AUTH_ID"
  "PLIVO_AUTH_TOKEN"
  "SIGNALWIRE_PROJECT_ID"
  "SIGNALWIRE_AUTH_TOKEN"
  "NODE_ENV"
)

MISSING=0

echo "Required Variables:"
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "  ❌ $var (MISSING)"
    MISSING=1
  else
    if [ "$var" = "JWT_SECRET" ]; then
      LEN=${#!var}
      if [ "$LEN" -lt 32 ]; then
        echo "  ⚠️  $var (TOO SHORT: $LEN chars, need 32+)"
        MISSING=1
      else
        echo "  ✅ $var (set, $LEN chars)"
      fi
    else
      echo "  ✅ $var (set)"
    fi
  fi
done

echo ""
echo "Optional Variables:"
for var in "${OPTIONAL_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "  ⚪ $var (not set)"
  else
    echo "  ✅ $var (set)"
  fi
done

echo ""

if [ $MISSING -eq 1 ]; then
  echo "❌ Missing required environment variables!"
  echo ""
  echo "Set them with:"
  echo "  export JWT_SECRET=\$(node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\")"
  echo "  export DATABASE_URL='your-database-url'"
  echo "  export ABEVOICE_API_URL='https://api.abevoice.com'"
  exit 1
else
  echo "✅ All required environment variables are set!"
fi

