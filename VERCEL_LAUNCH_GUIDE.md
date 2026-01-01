# 🚀 Vercel Launch Guide - North Shore Voice
## Complete Data Flows, UI Flows, API Keys & CI/CD Configuration

---

## 📊 TABLE OF CONTENTS

1. [Data Flow Diagrams](#data-flow-diagrams)
2. [UI Flow Diagrams](#ui-flow-diagrams)
3. [API Keys & Secrets Inventory](#api-keys--secrets-inventory)
4. [Vercel CI/CD Configuration](#vercel-cicd-configuration)
5. [Launch Checklist](#launch-checklist)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Deployment Architecture](#deployment-architecture)

---

## 📊 DATA FLOW DIAGRAMS

### 1. Authentication Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ POST /api/auth/login
       │ { email, password }
       ▼
┌─────────────────────────────────────┐
│      Backend API (Express)          │
│  ┌───────────────────────────────┐  │
│  │  routes/auth.ts               │  │
│  │  - Validate input             │  │
│  │  - Check rate limit           │  │
│  │  - Hash password (bcrypt)     │  │
│  │  - Generate JWT               │  │
│  │  - Set session cookie         │  │
│  └───────────────────────────────┘  │
└──────┬──────────────────────────────┘
       │
       │ JWT Token + User Data
       ▼
┌─────────────┐
│   Browser   │
│  (Frontend) │
│  - Store JWT in sessionStorage      │
│  - Redirect to /dashboard           │
└─────────────┘
```

### 2. Voice Generation Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ POST /api/voice/generate
       │ Authorization: Bearer <JWT>
       │ { text, voice, stability, similarity }
       ▼
┌─────────────────────────────────────┐
│      Backend API (Express)          │
│  ┌───────────────────────────────┐  │
│  │  routes/voice.ts               │  │
│  │  - Verify JWT                  │  │
│  │  - Validate input              │  │
│  └───────────┬─────────────────────┘  │
│              │                        │
│              ▼                        │
│  ┌───────────────────────────────┐  │
│  │  services/abevoice-integration │  │
│  │  - POST to AbëVoice API        │  │
│  │  - Handle response             │  │
│  └───────────┬─────────────────────┘  │
└──────────────┼────────────────────────┘
               │
               │ HTTP POST
               │ /api/v1/text-to-speech
               ▼
┌─────────────────────────────────────┐
│      AbëVoice API Server            │
│  - Generate audio from text          │
│  - Return base64 audio               │
└──────┬──────────────────────────────┘
       │
       │ { success: true, audio_base64 }
       ▼
┌─────────────────────────────────────┐
│      Backend API                    │
│  - Return audio to frontend          │
└──────┬──────────────────────────────┘
       │
       │ { success, audio_base64 }
       ▼
┌─────────────┐
│   Browser   │
│  - Convert base64 to Blob            │
│  - Play audio via HTML5 Audio        │
└─────────────┘
```

### 3. Inbound Call Flow

```
┌─────────────────────────────────────┐
│   Telephony Provider (Twilio/etc)   │
│  - Incoming call detected            │
└──────┬──────────────────────────────┘
       │
       │ Webhook POST
       │ /api/webhooks/inbound-call
       │ X-Twilio-Signature: <sig>
       │ { callSid, from, to, direction }
       ▼
┌─────────────────────────────────────┐
│      Backend API                    │
│  ┌───────────────────────────────┐  │
│  │  routes/webhooks.ts           │  │
│  │  - Verify signature           │  │
│  └───────────┬─────────────────────┘  │
│              │                        │
│              ▼                        │
│  ┌───────────────────────────────┐  │
│  │  services/inbound-call.service │  │
│  │  - Create call record          │  │
│  │  - Get routing rules            │  │
│  │  - Determine action             │  │
│  └───────────┬─────────────────────┘  │
│              │                        │
│              ▼                        │
│  ┌───────────────────────────────┐  │
│  │  services/abevoice-integration │  │
│  │  - acceptInboundCall()         │  │
│  └───────────┬─────────────────────┘  │
└──────────────┼────────────────────────┘
               │
               │ POST /api/v1/calls/accept
               ▼
┌─────────────────────────────────────┐
│      AbëVoice API Server            │
│  - Initialize AI agent               │
│  - Return session_id                 │
└──────┬──────────────────────────────┘
       │
       │ { success, session_id }
       ▼
┌─────────────────────────────────────┐
│      Backend API                    │
│  - Emit WebSocket event              │
│  - Update call status                │
│  - Return TwiML response             │
└──────┬──────────────────────────────┘
       │
       │ TwiML XML
       ▼
┌─────────────────────────────────────┐
│   Telephony Provider                │
│  - Execute TwiML                     │
│  - Connect call to AbëVoice          │
└─────────────────────────────────────┘
```

### 4. Outbound Call Campaign Flow

```
┌─────────────┐
│   Browser   │
│  (Dashboard)│
└──────┬──────┘
       │
       │ POST /api/outbound/campaign
       │ { businessId, contacts, script, schedule }
       ▼
┌─────────────────────────────────────┐
│      Backend API                    │
│  ┌───────────────────────────────┐  │
│  │  routes/outbound.ts           │  │
│  │  - Validate input             │  │
│  │  - Check rate limits          │  │
│  └───────────┬─────────────────────┘  │
│              │                        │
│              ▼                        │
│  ┌───────────────────────────────┐  │
│  │  services/outbound-call.service│  │
│  │  - Create campaign             │  │
│  │  - Schedule calls               │  │
│  │  - Process queue               │  │
│  └───────────┬─────────────────────┘  │
│              │                        │
│              ▼                        │
│  ┌───────────────────────────────┐  │
│  │  services/abevoice-integration │  │
│  │  - initiateOutboundCall()      │  │
│  └───────────┬─────────────────────┘  │
└──────────────┼────────────────────────┘
               │
               │ POST /api/v1/calls/outbound
               ▼
┌─────────────────────────────────────┐
│      AbëVoice API Server            │
│  - Initiate call                     │
│  - Return call_id                    │
└──────┬──────────────────────────────┘
       │
       │ { success, call_id }
       ▼
┌─────────────────────────────────────┐
│      Backend API                    │
│  - Update campaign stats             │
│  - Emit WebSocket progress           │
└─────────────────────────────────────┘
```

### 5. WebSocket Real-Time Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ WebSocket Connection
       │ wss://api.northshore.com/ws
       │ ?token=<JWT>
       ▼
┌─────────────────────────────────────┐
│      Backend API                   │
│  ┌───────────────────────────────┐  │
│  │  services/websocket.ts        │  │
│  │  - Verify JWT                 │  │
│  │  - Authenticate connection     │  │
│  │  - Create client session       │  │
│  └───────────┬─────────────────────┘  │
│              │                        │
│              ▼                        │
│  ┌───────────────────────────────┐  │
│  │  Client subscribed to:         │  │
│  │  - Session updates             │  │
│  │  - Call events                 │  │
│  │  - Campaign progress           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
       │
       │ Real-time events
       │ { type: 'call:started', data: {...} }
       ▼
┌─────────────┐
│   Browser   │
│  - Update UI in real-time            │
│  - Show call status                  │
│  - Display transcripts                │
└─────────────┘
```

### 6. Database Flow (Prisma)

```
┌─────────────────────────────────────┐
│      Backend API                    │
│  ┌───────────────────────────────┐  │
│  │  Prisma Client                 │  │
│  │  - Generated from schema.prisma│  │
│  └───────────┬─────────────────────┘  │
└──────────────┼────────────────────────┘
               │
               │ SQL Queries
               ▼
┌─────────────────────────────────────┐
│      PostgreSQL Database            │
│  ┌───────────────────────────────┐  │
│  │  Tables:                      │  │
│  │  - users                      │  │
│  │  - call_sessions              │  │
│  │  - inbound_calls              │  │
│  │  - outbound_calls             │  │
│  │  - voice_models               │  │
│  │  - training_samples           │  │
│  │  - businesses                 │  │
│  │  - campaigns                  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🎨 UI FLOW DIAGRAMS

### 1. Landing Page → Dashboard Flow

```
┌─────────────────────────────────────┐
│      Landing Page (/)                │
│  - Hero section                       │
│  - Features                           │
│  - Pricing                            │
│  - Testimonials                       │
└──────┬───────────────────────────────┘
       │
       │ Click "Get Started" / "Sign Up"
       ▼
┌─────────────────────────────────────┐
│      Sign Up Page (/signup)         │
│  - Email, Password, Name             │
│  - Company (optional)                │
└──────┬───────────────────────────────┘
       │
       │ POST /api/auth/register
       │ → JWT Token
       ▼
┌─────────────────────────────────────┐
│      Login Page (/login)            │
│  - Email, Password                   │
│  - Social login buttons              │
└──────┬───────────────────────────────┘
       │
       │ POST /api/auth/login
       │ → JWT Token → sessionStorage
       ▼
┌─────────────────────────────────────┐
│      Dashboard (/dashboard)         │
│  ┌───────────────────────────────┐  │
│  │  Sidebar Navigation:          │  │
│  │  - Overview                   │  │
│  │  - Inbound Calls              │  │
│  │  - Outbound Calls             │  │
│  │  - Analytics                  │  │
│  │  - Voice Training             │  │
│  │  - Call Logs                  │  │
│  │  - Settings                   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### 2. Dashboard Navigation Flow

```
┌─────────────────────────────────────┐
│      Dashboard Home                 │
│  - Overview stats                    │
│  - Recent calls                      │
│  - Quick actions                     │
└──────┬───────────────────────────────┘
       │
       ├─── Inbound Calls ────────────────┐
       │                                   │
       ├─── Outbound Calls ───────────────┤
       │                                   │
       ├─── Analytics ────────────────────┤
       │                                   │
       ├─── Voice Training ───────────────┤
       │                                   │
       ├─── Call Logs ────────────────────┤
       │                                   │
       └─── Settings ─────────────────────┤
                                           │
┌──────────────────────────────────────────┐
│  Inbound Call Dashboard                 │
│  - Active calls list                    │
│  - Queue status                         │
│  - Routing rules                        │
│  - Call history                         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Outbound Call Manager                   │
│  - Campaign list                         │
│  - Create campaign                       │
│  - Contact import                        │
│  - Campaign analytics                    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Analytics Dashboard                     │
│  - Call volume charts                    │
│  - Sentiment analysis                    │
│  - Peak hours                            │
│  - Performance metrics                   │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Voice Training                          │
│  - Upload samples                        │
│  - Train model                           │
│  - Model status                          │
│  - Voice preview                         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Settings                                │
│  - Profile                               │
│  - Business info                         │
│  - API keys                              │
│  - Notifications                         │
│  - Billing                               │
└──────────────────────────────────────────┘
```

### 3. Demo Flow

```
┌─────────────────────────────────────┐
│      Landing Page                    │
│  - "Try Demo" button                  │
└──────┬───────────────────────────────┘
       │
       │ Navigate to /demo
       ▼
┌─────────────────────────────────────┐
│      Demo Page (/demo)               │
│  - Voice call interface               │
│  - Microphone controls                │
│  - Settings panel                     │
└──────┬───────────────────────────────┘
       │
       │ Click "Start Call"
       │ → Request microphone permission
       ▼
┌─────────────────────────────────────┐
│      Speech Recognition Active       │
│  - Browser Web Speech API             │
│  - Continuous listening               │
│  - Interim transcripts               │
└──────┬───────────────────────────────┘
       │
       │ User speaks → Transcript
       │ → Generate AI response
       ▼
┌─────────────────────────────────────┐
│      AI Response Generation          │
│  - POST /api/voice/generate          │
│  - AbëVoice API (or browser TTS)     │
│  - Play audio response                │
└──────┬───────────────────────────────┘
       │
       │ Loop: Listen → Process → Respond
       │
       │ Click "End Call"
       ▼
┌─────────────────────────────────────┐
│      Call Ended                      │
│  - Show summary                       │
│  - Return to landing                  │
└─────────────────────────────────────┘
```

---

## 🔑 API KEYS & SECRETS INVENTORY

### Required Environment Variables

#### Backend (Production)

```bash
# ============================================
# CRITICAL - REQUIRED IN PRODUCTION
# ============================================

# JWT Authentication (REQUIRED)
JWT_SECRET=<64-char-random-hex-string>
JWT_EXPIRES_IN=7d
SESSION_SECRET=<64-char-random-hex-string>

# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/northshore_voice?schema=public

# AbëVoice API (REQUIRED for voice features)
ABEVOICE_API_URL=https://api.abevoice.com
ABEVOICE_API_KEY=<your-abevoice-api-key>

# CORS Configuration (REQUIRED)
CORS_ORIGIN=https://northshore.vercel.app
BACKEND_PORT=5000
BACKEND_HOST=0.0.0.0

# ============================================
# TELEPHONY PROVIDERS (At least one required)
# ============================================

# Twilio (Primary)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>

# Optional Providers
TELNYX_API_KEY=<your-telnyx-key>
PLIVO_AUTH_ID=<your-plivo-id>
PLIVO_AUTH_TOKEN=<your-plivo-token>
SIGNALWIRE_PROJECT_ID=<your-project-id>
SIGNALWIRE_AUTH_TOKEN=<your-auth-token>
SIGNALWIRE_SPACE_URL=<your-space>.signalwire.com

# ============================================
# WEBHOOK SECURITY (REQUIRED)
# ============================================

STRIPE_WEBHOOK_SECRET=whsec_<your-stripe-webhook-secret>
WEBHOOK_BASE_URL=https://api.northshore.com/api/telephony/webhooks

# ============================================
# OPTIONAL - ENHANCED FEATURES
# ============================================

# Redis (Optional - for caching/sessions)
REDIS_URL=redis://host:6379

# Email Service (Optional)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>

# File Storage (Optional - for training samples)
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
AWS_S3_BUCKET=northshore-voice-uploads
AWS_REGION=us-east-1

# Monitoring (Optional)
SENTRY_DSN=<sentry-dsn>
LOG_LEVEL=info
```

#### Frontend (Production)

```bash
# ============================================
# FRONTEND ENVIRONMENT VARIABLES
# ============================================

# API Base URL (REQUIRED)
VITE_API_URL=https://api.northshore.com

# Feature Flags (Optional)
VITE_ENABLE_DEMO=true
VITE_ENABLE_ANALYTICS=true

# Analytics (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_POSTHOG_KEY=<posthog-key>
```

### How to Generate Secure Secrets

```bash
# Generate JWT_SECRET (64 bytes hex)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate SESSION_SECRET (64 bytes hex)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate using OpenSSL
openssl rand -hex 64

# Generate using PowerShell (Windows)
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

### API Key Sources

| Service | Where to Get | Required For |
|---------|--------------|--------------|
| **AbëVoice** | AbëVoice Dashboard | Voice generation, call handling |
| **Twilio** | https://console.twilio.com | Telephony (primary) |
| **Telnyx** | https://portal.telnyx.com | Telephony (alternative) |
| **Plivo** | https://console.plivo.com | Telephony (alternative) |
| **SignalWire** | https://signalwire.com | Telephony (alternative) |
| **Stripe** | https://dashboard.stripe.com | Payment webhooks |
| **PostgreSQL** | Database provider (Vercel Postgres, Supabase, etc.) | Data persistence |
| **Redis** | Redis provider (Upstash, Redis Cloud, etc.) | Caching (optional) |

---

## ⚙️ VERCEL CI/CD CONFIGURATION

### 1. Vercel Configuration Files

#### `vercel.json` (Root)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/src/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### `frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.northshore.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. GitHub Actions Workflow

#### `.github/workflows/vercel-deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - production
  pull_request:
    branches:
      - main

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy-frontend:
    name: Deploy Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    name: Deploy Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Install Dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Run Migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  smoke-tests:
    name: Smoke Tests
    runs-on: ubuntu-latest
    needs: [deploy-frontend, deploy-backend]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run Smoke Tests
        run: bash scripts/smoke-check.sh
        env:
          BACKEND_HOST: api.northshore.com
          BACKEND_PORT: 443
          FRONTEND_HOST: northshore.vercel.app
          FRONTEND_PORT: 443
```

### 3. Vercel Environment Variables Setup

#### Required Secrets in Vercel Dashboard

Go to: **Project Settings → Environment Variables**

**Production Environment:**

```
JWT_SECRET=<64-char-hex>
SESSION_SECRET=<64-char-hex>
DATABASE_URL=<postgres-connection-string>
ABEVOICE_API_URL=https://api.abevoice.com
ABEVOICE_API_KEY=<abevoice-key>
TWILIO_ACCOUNT_SID=<twilio-sid>
TWILIO_AUTH_TOKEN=<twilio-token>
CORS_ORIGIN=https://northshore.vercel.app
STRIPE_WEBHOOK_SECRET=<stripe-secret>
WEBHOOK_BASE_URL=https://api.northshore.com/api/telephony/webhooks
NODE_ENV=production
```

**Preview Environment:**

```
JWT_SECRET=<preview-secret>
DATABASE_URL=<preview-db-url>
ABEVOICE_API_URL=https://api.abevoice.com
CORS_ORIGIN=https://northshore-git-*.vercel.app
NODE_ENV=preview
```

### 4. Vercel Project Setup

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Link Project

```bash
# From project root
vercel link
```

#### Step 4: Configure Project

```bash
# Frontend
cd frontend
vercel

# Backend
cd backend
vercel
```

#### Step 5: Set Environment Variables

```bash
# Set production env vars
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production
vercel env add ABEVOICE_API_KEY production
# ... (repeat for all required vars)

# Pull env vars locally (optional)
vercel env pull .env.local
```

---

## ✅ LAUNCH CHECKLIST

### Pre-Launch (1-2 weeks before)

#### Infrastructure
- [ ] Set up Vercel account and projects
- [ ] Set up PostgreSQL database (Vercel Postgres, Supabase, or Neon)
- [ ] Set up Redis (Upstash or Redis Cloud) - Optional
- [ ] Configure domain names (northshore.com, api.northshore.com)
- [ ] Set up SSL certificates (automatic with Vercel)
- [ ] Configure DNS records

#### API Keys & Secrets
- [ ] Generate secure JWT_SECRET (64+ chars)
- [ ] Generate secure SESSION_SECRET (64+ chars)
- [ ] Obtain AbëVoice API credentials
- [ ] Obtain Twilio credentials (or alternative provider)
- [ ] Set up Stripe account (if using payments)
- [ ] Configure all environment variables in Vercel

#### Database
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Seed initial data (if needed)
- [ ] Set up database backups
- [ ] Test database connection

#### Code Preparation
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Update `VITE_API_URL` to production API URL
- [ ] Remove dev fallbacks (JWT_SECRET, etc.)
- [ ] Update webhook URLs in telephony providers
- [ ] Test all API endpoints
- [ ] Run smoke tests

#### Security
- [ ] Enable webhook signature verification
- [ ] Review and harden authentication
- [ ] Set up rate limiting
- [ ] Configure security headers
- [ ] Review file upload security
- [ ] Set up monitoring/alerting

### Launch Day

#### Morning (Pre-Launch)
- [ ] Final code review
- [ ] Run full test suite
- [ ] Deploy to preview environment
- [ ] Test preview deployment
- [ ] Verify all environment variables
- [ ] Test critical user flows

#### Launch (Afternoon)
- [ ] Deploy frontend to production
- [ ] Deploy backend to production
- [ ] Run database migrations
- [ ] Verify deployments are live
- [ ] Test production endpoints
- [ ] Verify WebSocket connections
- [ ] Test inbound/outbound calls
- [ ] Monitor error logs

#### Post-Launch (Evening)
- [ ] Monitor application metrics
- [ ] Check error rates
- [ ] Verify webhook deliveries
- [ ] Test user registration/login
- [ ] Monitor database performance
- [ ] Set up alerts for critical errors

### Post-Launch (First Week)

#### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Monitor API usage/limits
- [ ] Track user signups
- [ ] Monitor call volumes

#### Optimization
- [ ] Review slow queries
- [ ] Optimize API responses
- [ ] Enable CDN caching
- [ ] Review and optimize bundle sizes
- [ ] Monitor WebSocket connections

#### Documentation
- [ ] Update README with production URLs
- [ ] Document API endpoints
- [ ] Create runbook for common issues
- [ ] Document rollback procedures

---

## 🏗️ DEPLOYMENT ARCHITECTURE

### Vercel Deployment Structure

```
┌─────────────────────────────────────────┐
│         Vercel Edge Network             │
│  (Global CDN + Edge Functions)          │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐  ┌─────────────┐
│  Frontend   │  │   Backend   │
│  (Static)   │  │  (Serverless)│
│             │  │             │
│  - React    │  │  - Express  │
│  - Vite     │  │  - Node.js  │
│  - Assets   │  │  - API      │
└─────────────┘  └──────┬──────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   External Services   │
            │                       │
            │  - PostgreSQL         │
            │  - Redis (optional)    │
            │  - AbëVoice API       │
            │  - Twilio             │
            │  - Stripe             │
            └───────────────────────┘
```

### Domain Configuration

```
northshore.com (or .vercel.app)
├── / → Frontend (React SPA)
├── /demo → Demo page
├── /dashboard → Dashboard (protected)
├── /login → Login page
└── /signup → Signup page

api.northshore.com (or api-*.vercel.app)
├── /api/auth/* → Authentication
├── /api/voice/* → Voice generation
├── /api/calls/* → Call management
├── /api/inbound/* → Inbound calls
├── /api/outbound/* → Outbound calls
├── /api/telephony/* → Telephony operations
├── /api/webhooks/* → Webhook handlers
└── /ws → WebSocket endpoint
```

### Environment-Specific URLs

**Production:**
- Frontend: `https://northshore.vercel.app`
- Backend: `https://api.northshore.com` (or custom domain)
- WebSocket: `wss://api.northshore.com/ws`

**Preview:**
- Frontend: `https://northshore-git-<branch>-<user>.vercel.app`
- Backend: `https://api-northshore-git-<branch>-<user>.vercel.app`
- WebSocket: `wss://api-northshore-git-<branch>-<user>.vercel.app/ws`

---

## 📝 QUICK START COMMANDS

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Production Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy Frontend
cd frontend
vercel --prod

# Deploy Backend
cd backend
vercel --prod

# Run migrations
cd backend
npx prisma migrate deploy
```

### Environment Setup

```bash
# Pull Vercel env vars locally
cd backend
vercel env pull .env.local

# Validate secrets
npm run validate-secrets
```

---

## 🔍 TROUBLESHOOTING

### Common Issues

**1. CORS Errors**
- Verify `CORS_ORIGIN` matches frontend domain
- Check Vercel headers configuration

**2. Database Connection Errors**
- Verify `DATABASE_URL` is correct
- Check database firewall settings
- Ensure SSL is enabled

**3. WebSocket Connection Failures**
- Verify WebSocket URL uses `wss://` (not `ws://`)
- Check JWT token is valid
- Verify CORS allows WebSocket upgrade

**4. API Key Errors**
- Verify all required env vars are set in Vercel
- Check API key permissions
- Verify API endpoints are correct

**5. Build Failures**
- Check Node.js version (should be 20+)
- Verify all dependencies are installed
- Check for TypeScript errors

---

## 📞 SUPPORT & RESOURCES

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Twilio Docs**: https://www.twilio.com/docs
- **AbëVoice API**: Contact AbëVoice team

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

---

*Last Updated: $(date)*  
*Version: 1.0.0*

