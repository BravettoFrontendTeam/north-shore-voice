# ⚡ Quick Launch Reference - North Shore Voice

## 🎯 One-Page Launch Guide

### Essential Commands

```bash
# 1. Setup Vercel Environment Variables
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

## 📊 Data Flow Summary

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

## 🎨 UI Flow Summary

```
Landing (/) → Sign Up → Login → Dashboard
    ↓
  Demo (/demo) → Voice Call Interface
    ↓
Dashboard Routes:
  - Overview
  - Inbound Calls
  - Outbound Calls
  - Analytics
  - Voice Training
  - Call Logs
  - Settings
```

---

## 🔑 Required API Keys

| Key | Source | Required |
|-----|--------|----------|
| `JWT_SECRET` | Generated (64+ chars) | ✅ Yes |
| `SESSION_SECRET` | Generated (64+ chars) | ✅ Yes |
| `DATABASE_URL` | PostgreSQL provider | ✅ Yes |
| `ABEVOICE_API_KEY` | AbëVoice dashboard | ✅ Yes |
| `TWILIO_ACCOUNT_SID` | Twilio console | ✅ Yes |
| `TWILIO_AUTH_TOKEN` | Twilio console | ✅ Yes |
| `CORS_ORIGIN` | Your domain | ✅ Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard | ⚠️ Optional |

---

## 🚀 Vercel Deployment Steps

### 1. Initial Setup
```bash
npm install -g vercel
vercel login
vercel link
```

### 2. Set Environment Variables
```bash
# Use the setup script
bash scripts/setup-vercel-env.sh

# Or manually
vercel env add JWT_SECRET production
vercel env add DATABASE_URL production
# ... (repeat for all vars)
```

### 3. Deploy
```bash
# Frontend
cd frontend
vercel --prod

# Backend
cd backend
vercel --prod
```

### 4. Migrate Database
```bash
cd backend
npx prisma migrate deploy
```

---

## 📋 Pre-Launch Checklist (Quick)

- [ ] All env vars set in Vercel
- [ ] Database created and accessible
- [ ] JWT_SECRET generated (64+ chars)
- [ ] CORS_ORIGIN matches frontend domain
- [ ] Webhook URLs updated in Twilio
- [ ] Smoke tests pass
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Run migrations
- [ ] Test `/api/status`
- [ ] Test login/register
- [ ] Test voice generation
- [ ] Monitor error logs

---

## 🔍 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Check `CORS_ORIGIN` matches frontend domain |
| Database Error | Verify `DATABASE_URL` and firewall settings |
| WebSocket Fail | Use `wss://` (not `ws://`) and valid JWT |
| Build Fail | Check Node.js version (20+) and dependencies |
| 401 Unauthorized | Verify JWT_SECRET is set correctly |

---

## 📞 Quick Links

- **Full Launch Guide**: `VERCEL_LAUNCH_GUIDE.md`
- **Launch Checklist**: `LAUNCH_CHECKLIST.md`
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs

---

## 🎯 Critical Path (Must Do)

1. ✅ Set all environment variables
2. ✅ Deploy frontend + backend
3. ✅ Run database migrations
4. ✅ Test `/api/status` endpoint
5. ✅ Test user registration/login
6. ✅ Monitor error logs

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

