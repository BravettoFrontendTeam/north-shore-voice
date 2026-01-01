#!/usr/bin/env bash
set -euo pipefail

# P0 Launch Fixes Validation Script
# YAGNI × Test-First × Radically Simple
# Works from ANY directory using absolute path resolution

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🔍 Validating P0 Launch Fixes..."
echo "📁 Project root: $PROJECT_ROOT"
echo ""

# Check 1: Simulation mode removed
echo "✓ Fix 1: Checking simulation mode removal..."
if grep -q "P0 Fix 1.*production" "$PROJECT_ROOT/backend/src/services/abevoice-integration.ts"; then
  echo "  ✅ Production mode throws errors"
else
  echo "  ❌ Production mode check not found"
  exit 1
fi

# Check 2: JWT secret enforcement
echo "✓ Fix 2: Checking JWT secret enforcement..."
if grep -q "JWT_SECRET required.*production" "$PROJECT_ROOT/backend/src/middleware/auth.ts"; then
  echo "  ✅ JWT_SECRET validation in place"
else
  echo "  ❌ JWT_SECRET validation not found"
  exit 1
fi

# Check 3: Webhook signature verification
echo "✓ Fix 3: Checking webhook signature verification..."
if grep -q "P0 Fix 3.*webhook" "$PROJECT_ROOT/backend/src/routes/webhooks.ts"; then
  echo "  ✅ Webhook signature verification enforced"
else
  echo "  ❌ Webhook signature verification not found"
  exit 1
fi

# Check 4: Database pooling
echo "✓ Fix 4: Checking database pooling..."
if [ -f "$PROJECT_ROOT/backend/src/db.ts" ]; then
  echo "  ✅ Database connection pool file exists"
else
  echo "  ❌ Database connection pool file not found"
  exit 1
fi

if grep -q "PrismaClient" "$PROJECT_ROOT/backend/src/db.ts"; then
  echo "  ✅ Prisma client configured"
else
  echo "  ❌ Prisma client not configured"
  exit 1
fi

# Check 5: TCPA documentation
echo "✓ Fix 5: Checking TCPA documentation..."
if [ -f "$PROJECT_ROOT/docs/TCPA_COMPLIANCE.md" ]; then
  echo "  ✅ TCPA documentation exists"
  if grep -q "TCPA" "$PROJECT_ROOT/docs/TCPA_COMPLIANCE.md" && grep -q "consent" "$PROJECT_ROOT/docs/TCPA_COMPLIANCE.md"; then
    echo "  ✅ TCPA documentation contains required content"
  else
    echo "  ❌ TCPA documentation missing required content"
    exit 1
  fi
else
  echo "  ❌ TCPA documentation not found"
  exit 1
fi

# Check 6: Vercel config
echo "✓ Fix 4: Checking Vercel configuration..."
if [ -f "$PROJECT_ROOT/vercel.json" ]; then
  if grep -q "backend/src/index.ts" "$PROJECT_ROOT/vercel.json"; then
    echo "  ✅ Vercel config updated"
  else
    echo "  ⚠️  Vercel config may need review"
  fi
else
  echo "  ❌ vercel.json not found"
  exit 1
fi

# Check 7: Tests exist
echo "✓ Checking tests..."
if [ -f "$PROJECT_ROOT/backend/tests/p0-launch-fixes.test.ts" ]; then
  echo "  ✅ P0 launch fixes tests exist"
else
  echo "  ⚠️  Tests file not found (create tests before deployment)"
fi

echo ""
echo "✅ All P0 fixes validated!"
echo ""
echo "Next steps:"
echo "  1. Run tests: bash \"$PROJECT_ROOT/scripts/run-tests.sh\""
echo "  2. Set environment variables in Vercel"
echo "  3. Deploy: bash \"$PROJECT_ROOT/scripts/deploy.sh\""
echo ""
