# 🚀 Deployment Guide - North Shore Voice

Complete deployment guide for Vercel production launch.

---

## 📋 Quick Start

```bash
# 1. Setup Environment Variables
bash scripts/setup-vercel-env.sh

# 2. Deploy Frontend
cd frontend && vercel --prod

# 3. Deploy Backend  
cd backend && vercel --prod

# 4. Run Database Migrations
cd backend && npx prisma migrate deploy

# 5. Verify Deployment
curl https://api.northshore.com/api/status
```

---

## 🔑 Environment Variables

### Required

| Variable | Source | Generate Command |
|----------|--------|------------------|
| `JWT_SECRET` | Generated (64+ chars) | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `DATABASE_URL` | PostgreSQL provider | Vercel Postgres connection string |
| `ABEVOICE_API_URL` | AbëVoice dashboard | `https://api.abevoice.com` |
| `CORS_ORIGIN` | Your domain | `https://northshore.vercel.app` |
| `NODE_ENV` | Set to `production` | - |

### Optional (Telephony Providers)

| Variable | Source | Required |
|----------|--------|----------|
| `TWILIO_ACCOUNT_SID` | Twilio console | ✅ Yes (if using Twilio) |
| `TWILIO_AUTH_TOKEN` | Twilio console | ✅ Yes (if using Twilio) |
| `TELNYX_API_KEY` | Telnyx dashboard | ⚠️ Optional |
| `PLIVO_AUTH_ID` | Plivo dashboard | ⚠️ Optional |
| `SIGNALWIRE_PROJECT_ID` | SignalWire dashboard | ⚠️ Optional |

---

## 📊 Data Flows

### Authentication
```
User → POST /api/auth/login → Backend → JWT Token → Frontend → Dashboard
```

### Voice Generation
```
Frontend → POST /api/voice/generate → Backend → AbëVoice API → Audio → Frontend
```

### Inbound Call
```
Twilio → Webhook → Backend → AbëVoice API → TwiML → Twilio → Call Connected
```

### Outbound Call
```
Dashboard → POST /api/outbound/call → Backend → AbëVoice API → Call Initiated
```

### WebSocket
```
Frontend → wss://api/ws?token=JWT → Backend → Real-time Updates → Frontend
```

---

## 🚀 Pre-Launch Checklist (1-2 Weeks Before)

### Infrastructure
- [ ] Create Vercel account
- [ ] Create Vercel projects (frontend + backend)
- [ ] Set up PostgreSQL database (Vercel Postgres)
- [ ] Purchase/configure domain names
- [ ] Configure DNS records
- [ ] Verify SSL certificates (automatic with Vercel)

### API Keys & Secrets
- [ ] Generate `JWT_SECRET` (64+ character hex string)
- [ ] Obtain AbëVoice API credentials
- [ ] Obtain Twilio credentials (if using)
- [ ] Configure all environment variables in Vercel dashboard

### Database Setup
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Seed initial data (if needed)
- [ ] Set up database backups
- [ ] Test database connection from production

### Code Preparation
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Update `VITE_API_URL` to production API URL
- [ ] Run full test suite: `bash scripts/run-tests.sh`
- [ ] Run smoke tests: `bash scripts/smoke-check.sh`
- [ ] Validate P0 fixes: `bash scripts/validate-p0-fixes.sh`

### Security Hardening
- [ ] Enable webhook signature verification
- [ ] Review authentication middleware
- [ ] Set up rate limiting
- [ ] Configure security headers (Helmet)
- [ ] Review file upload security

---

## 🚀 Launch Day

### Morning (Pre-Launch)
- [ ] Final code review
- [ ] Run full test suite
- [ ] Deploy to preview/staging environment
- [ ] Test preview deployment thoroughly
- [ ] Verify all environment variables are set
- [ ] Test critical user flows:
  - [ ] User registration
  - [ ] User login
  - [ ] Voice generation
  - [ ] Inbound call webhook
  - [ ] Outbound call initiation
  - [ ] WebSocket connection

### Launch (Afternoon)
- [ ] Deploy frontend to production
  ```bash
  cd frontend && vercel --prod
  ```
- [ ] Deploy backend to production
  ```bash
  cd backend && vercel --prod
  ```
- [ ] Run database migrations
  ```bash
  cd backend && npx prisma migrate deploy
  ```
- [ ] Verify deployments are live
  - Frontend: `https://northshore.vercel.app`
  - Backend: `https://api.northshore.com/api/status`
- [ ] Test production endpoints
  - `/api/status` returns `{"status": "ok"}`
  - `/api/auth/login` works
  - `/api/voice/generate` works
- [ ] Verify WebSocket connections
- [ ] Test inbound/outbound calls
- [ ] Monitor error logs (Vercel dashboard)

### Post-Launch (Evening)
- [ ] Monitor application metrics
- [ ] Check error rates (should be < 1%)
- [ ] Verify webhook deliveries
- [ ] Test user registration/login flow
- [ ] Monitor database performance
- [ ] Set up alerts for critical errors

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Check `CORS_ORIGIN` matches frontend domain |
| Database Error | Verify `DATABASE_URL` and firewall settings |
| WebSocket Fail | Use `wss://` (not `ws://`) and valid JWT |
| Build Fail | Check Node.js version (20+) and dependencies |
| 401 Unauthorized | Verify JWT_SECRET is set correctly |
| 403 Forbidden (Webhook) | Check webhook signature verification |

---

## 🔄 Rollback Plan

If critical issues occur:

```bash
# Rollback frontend
cd frontend && vercel rollback

# Rollback backend
cd backend && vercel rollback

# Database rollback (if needed)
cd backend && npx prisma migrate resolve --rolled-back <migration-name>
```

---

## ✅ Success Criteria

Launch is successful when:
- ✅ All smoke tests pass
- ✅ User registration/login works
- ✅ Voice generation works
- ✅ Inbound/outbound calls work
- ✅ Error rate < 1%
- ✅ API response times < 500ms
- ✅ No critical security issues
- ✅ Monitoring/alerting active

---

## 📚 Related Documentation

- **P0 Fixes**: `P0_FIXES.md`
- **Terminal Commands**: `TERMINAL_TEST_PROMPTS.md`
- **TCPA Compliance**: `docs/TCPA_COMPLIANCE.md`
- **Security**: `backend/SECURITY.md`

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

