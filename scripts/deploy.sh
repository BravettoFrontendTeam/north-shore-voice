#!/usr/bin/env bash
set -euo pipefail

# Vercel Deployment Script
# Works from ANY directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

echo "🚀 North Shore Voice - Vercel Deployment"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "   Install it with: npm install -g vercel"
    exit 1
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel."
    echo "   Run: vercel login"
    exit 1
fi

echo "✅ Vercel CLI ready"
echo ""

# Validate P0 fixes
echo "🔍 Validating P0 fixes..."
if ! bash "$PROJECT_ROOT/scripts/validate-p0-fixes.sh" > /dev/null 2>&1; then
    echo "❌ P0 fixes validation failed!"
    echo "   Run: bash scripts/validate-p0-fixes.sh"
    exit 1
fi
echo "✅ P0 fixes validated"
echo ""

# Run tests
echo "🧪 Running tests..."
cd "$PROJECT_ROOT/backend"
if ! npm test -- p0-launch-fixes.test.ts > /dev/null 2>&1; then
    echo "❌ Tests failed!"
    echo "   Run: bash scripts/run-tests.sh"
    exit 1
fi
echo "✅ All tests passing"
echo ""

cd "$PROJECT_ROOT"

# Prompt for environment setup
read -p "Have you set up environment variables in Vercel? (y/N): " env_setup
if [[ ! "$env_setup" =~ ^[Yy]$ ]]; then
    echo ""
    echo "📋 Setting up environment variables..."
    echo "   Run: bash scripts/setup-vercel-env.sh"
    echo "   Or set them manually in Vercel Dashboard"
    echo ""
    read -p "Continue anyway? (y/N): " continue_anyway
    if [[ ! "$continue_anyway" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Deploy frontend
echo "📦 Deploying frontend..."
cd "$PROJECT_ROOT/frontend"
if vercel --prod; then
    echo "✅ Frontend deployed"
else
    echo "❌ Frontend deployment failed"
    exit 1
fi

echo ""

# Deploy backend
echo "📦 Deploying backend..."
cd "$PROJECT_ROOT/backend"
if vercel --prod; then
    echo "✅ Backend deployed"
else
    echo "❌ Backend deployment failed"
    exit 1
fi

echo ""

# Run migrations
echo "🗄️  Running database migrations..."
if npx prisma migrate deploy; then
    echo "✅ Migrations complete"
else
    echo "⚠️  Migration failed (may need manual intervention)"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Verify deployment: curl https://your-domain.vercel.app/api/status"
echo "   2. Check Vercel logs for any errors"
echo "   3. Test user registration/login"
echo "   4. Test voice generation"
echo ""

