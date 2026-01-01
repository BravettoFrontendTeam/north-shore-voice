#!/usr/bin/env bash
set -euo pipefail

# Setup Vercel Environment Variables Script
# This script helps set up all required environment variables in Vercel

echo "🚀 North Shore Voice - Vercel Environment Setup"
echo "================================================"
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

echo "✅ Vercel CLI is installed and you are logged in"
echo ""

# Function to prompt for environment variable
prompt_env_var() {
    local var_name=$1
    local description=$2
    local is_secret=${3:-true}
    local default_value=${4:-}
    
    echo ""
    if [ -n "$default_value" ]; then
        echo -n "Enter $var_name ($description) [default: $default_value]: "
    else
        echo -n "Enter $var_name ($description): "
    fi
    
    if [ "$is_secret" = true ]; then
        read -s value
        echo ""
    else
        read value
    fi
    
    if [ -z "$value" ] && [ -n "$default_value" ]; then
        value=$default_value
    fi
    
    if [ -z "$value" ]; then
        echo "⚠️  Skipping $var_name (empty value)"
        return 1
    fi
    
    echo "$value"
}

# Function to set Vercel env var
set_vercel_env() {
    local var_name=$1
    local value=$2
    local environment=${3:-production}
    
    echo "Setting $var_name for $environment environment..."
    echo "$value" | vercel env add "$var_name" "$environment" 2>/dev/null || {
        echo "⚠️  Failed to set $var_name (may already exist)"
    }
}

# Generate secrets
generate_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -hex 64
    elif command -v node &> /dev/null; then
        node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    else
        echo "⚠️  Cannot generate secret (need openssl or node)"
        return 1
    fi
}

echo "📋 Required Environment Variables"
echo "=================================="
echo ""
echo "We'll set up environment variables for your Vercel project."
echo "You can skip any variable by pressing Enter (but it's required for production)."
echo ""

# Critical variables
echo "🔐 CRITICAL VARIABLES (Required for Production)"
echo "-----------------------------------------------"

JWT_SECRET=$(generate_secret)
echo "✅ Generated JWT_SECRET (64 bytes hex)"
read -p "Use generated secret? (Y/n): " use_generated
if [[ ! "$use_generated" =~ ^[Nn]$ ]]; then
    JWT_SECRET_VALUE=$JWT_SECRET
else
    JWT_SECRET_VALUE=$(prompt_env_var "JWT_SECRET" "JWT signing secret (64+ chars)" true)
fi

SESSION_SECRET=$(generate_secret)
echo "✅ Generated SESSION_SECRET (64 bytes hex)"
read -p "Use generated secret? (Y/n): " use_generated
if [[ ! "$use_generated" =~ ^[Nn]$ ]]; then
    SESSION_SECRET_VALUE=$SESSION_SECRET
else
    SESSION_SECRET_VALUE=$(prompt_env_var "SESSION_SECRET" "Session secret (64+ chars)" true)
fi

DATABASE_URL=$(prompt_env_var "DATABASE_URL" "PostgreSQL connection string" false)
ABEVOICE_API_URL=$(prompt_env_var "ABEVOICE_API_URL" "AbëVoice API URL" false "https://api.abevoice.com")
ABEVOICE_API_KEY=$(prompt_env_var "ABEVOICE_API_KEY" "AbëVoice API Key" true)

echo ""
echo "📞 TELEPHONY PROVIDERS (At least one required)"
echo "-----------------------------------------------"

TWILIO_ACCOUNT_SID=$(prompt_env_var "TWILIO_ACCOUNT_SID" "Twilio Account SID" false)
TWILIO_AUTH_TOKEN=$(prompt_env_var "TWILIO_AUTH_TOKEN" "Twilio Auth Token" true)

echo ""
echo "🌐 CORS & DOMAIN CONFIGURATION"
echo "--------------------------------"

CORS_ORIGIN=$(prompt_env_var "CORS_ORIGIN" "Frontend domain (CORS origin)" false "https://northshore.vercel.app")
VITE_API_URL=$(prompt_env_var "VITE_API_URL" "Backend API URL (for frontend)" false "https://api.northshore.com")

echo ""
echo "🔔 WEBHOOK CONFIGURATION"
echo "------------------------"

WEBHOOK_BASE_URL=$(prompt_env_var "WEBHOOK_BASE_URL" "Webhook base URL" false "https://api.northshore.com/api/telephony/webhooks")
STRIPE_WEBHOOK_SECRET=$(prompt_env_var "STRIPE_WEBHOOK_SECRET" "Stripe webhook secret (optional)" true "")

echo ""
echo "⚙️  OPTIONAL CONFIGURATION"
echo "--------------------------"

read -p "Set up Redis? (y/N): " setup_redis
if [[ "$setup_redis" =~ ^[Yy]$ ]]; then
    REDIS_URL=$(prompt_env_var "REDIS_URL" "Redis connection URL" false)
fi

read -p "Set up email (SMTP)? (y/N): " setup_email
if [[ "$setup_email" =~ ^[Yy]$ ]]; then
    SMTP_HOST=$(prompt_env_var "SMTP_HOST" "SMTP host" false)
    SMTP_PORT=$(prompt_env_var "SMTP_PORT" "SMTP port" false "587")
    SMTP_USER=$(prompt_env_var "SMTP_USER" "SMTP username" false)
    SMTP_PASSWORD=$(prompt_env_var "SMTP_PASSWORD" "SMTP password" true)
fi

echo ""
echo "🚀 DEPLOYMENT CONFIGURATION"
echo "---------------------------"

read -p "Which environment? (production/preview/development) [production]: " env_type
env_type=${env_type:-production}

echo ""
echo "📤 Setting environment variables in Vercel..."
echo ""

# Set critical variables
[ -n "$JWT_SECRET_VALUE" ] && set_vercel_env "JWT_SECRET" "$JWT_SECRET_VALUE" "$env_type"
[ -n "$SESSION_SECRET_VALUE" ] && set_vercel_env "SESSION_SECRET" "$SESSION_SECRET_VALUE" "$env_type"
[ -n "$DATABASE_URL" ] && set_vercel_env "DATABASE_URL" "$DATABASE_URL" "$env_type"
[ -n "$ABEVOICE_API_URL" ] && set_vercel_env "ABEVOICE_API_URL" "$ABEVOICE_API_URL" "$env_type"
[ -n "$ABEVOICE_API_KEY" ] && set_vercel_env "ABEVOICE_API_KEY" "$ABEVOICE_API_KEY" "$env_type"

# Set telephony variables
[ -n "$TWILIO_ACCOUNT_SID" ] && set_vercel_env "TWILIO_ACCOUNT_SID" "$TWILIO_ACCOUNT_SID" "$env_type"
[ -n "$TWILIO_AUTH_TOKEN" ] && set_vercel_env "TWILIO_AUTH_TOKEN" "$TWILIO_AUTH_TOKEN" "$env_type"

# Set CORS & domain
[ -n "$CORS_ORIGIN" ] && set_vercel_env "CORS_ORIGIN" "$CORS_ORIGIN" "$env_type"
[ -n "$VITE_API_URL" ] && set_vercel_env "VITE_API_URL" "$VITE_API_URL" "$env_type"

# Set webhook config
[ -n "$WEBHOOK_BASE_URL" ] && set_vercel_env "WEBHOOK_BASE_URL" "$WEBHOOK_BASE_URL" "$env_type"
[ -n "$STRIPE_WEBHOOK_SECRET" ] && set_vercel_env "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET" "$env_type"

# Set optional variables
[ -n "${REDIS_URL:-}" ] && set_vercel_env "REDIS_URL" "$REDIS_URL" "$env_type"
[ -n "${SMTP_HOST:-}" ] && set_vercel_env "SMTP_HOST" "$SMTP_HOST" "$env_type"
[ -n "${SMTP_PORT:-}" ] && set_vercel_env "SMTP_PORT" "$SMTP_PORT" "$env_type"
[ -n "${SMTP_USER:-}" ] && set_vercel_env "SMTP_USER" "$SMTP_USER" "$env_type"
[ -n "${SMTP_PASSWORD:-}" ] && set_vercel_env "SMTP_PASSWORD" "$SMTP_PASSWORD" "$env_type"

# Always set NODE_ENV
set_vercel_env "NODE_ENV" "$env_type" "$env_type"

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "📋 Summary:"
echo "   Environment: $env_type"
echo "   Variables set: $(vercel env ls 2>/dev/null | grep -c "$env_type" || echo "0")"
echo ""
echo "🔍 Verify your environment variables:"
echo "   vercel env ls"
echo ""
echo "🚀 Next steps:"
echo "   1. Run database migrations: npx prisma migrate deploy"
echo "   2. Deploy: vercel --prod"
echo "   3. Test: curl https://api.northshore.com/api/status"
echo ""

