# 🚀 Launch Checklist - North Shore Voice

## Pre-Launch (1-2 Weeks Before)

### Infrastructure Setup
- [ ] Create Vercel account
- [ ] Create Vercel projects (frontend + backend)
- [ ] Set up PostgreSQL database (Vercel Postgres, Supabase, or Neon)
- [ ] Set up Redis (Upstash or Redis Cloud) - Optional
- [ ] Purchase/configure domain names
  - [ ] `northshore.com` (or your domain)
  - [ ] `api.northshore.com` (subdomain for API)
- [ ] Configure DNS records (A/CNAME)
- [ ] Verify SSL certificates (automatic with Vercel)

### API Keys & Secrets
- [ ] Generate `JWT_SECRET` (64+ character hex string)
- [ ] Generate `SESSION_SECRET` (64+ character hex string)
- [ ] Obtain AbëVoice API credentials
  - [ ] API URL
  - [ ] API Key
- [ ] Obtain Twilio credentials
  - [ ] Account SID
  - [ ] Auth Token
- [ ] Set up Stripe account (if using payments)
  - [ ] API Keys
  - [ ] Webhook Secret
- [ ] Configure all environment variables in Vercel dashboard

### Database Setup
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Seed initial data (if needed)
- [ ] Set up database backups
- [ ] Test database connection from production
- [ ] Verify database indexes are created

### Code Preparation
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Update `VITE_API_URL` to production API URL
- [ ] Remove dev fallbacks (JWT_SECRET, etc.)
- [ ] Update webhook URLs in telephony providers
- [ ] Test all API endpoints locally
- [ ] Run full test suite
- [ ] Run smoke tests: `bash scripts/smoke-check.sh`

### Security Hardening
- [ ] Enable webhook signature verification
- [ ] Review and harden authentication middleware
- [ ] Set up rate limiting (verify limits are appropriate)
- [ ] Configure security headers (Helmet)
- [ ] Review file upload security
- [ ] Set up monitoring/alerting (Sentry, etc.)
- [ ] Review and update `SECURITY.md`

### Documentation
- [ ] Update README with production URLs
- [ ] Document API endpoints
- [ ] Create runbook for common issues
- [ ] Document rollback procedures
- [ ] Update `VERCEL_LAUNCH_GUIDE.md` with actual URLs

## Launch Day

### Morning (Pre-Launch)
- [ ] Final code review
- [ ] Run full test suite
- [ ] Deploy to preview/staging environment
- [ ] Test preview deployment thoroughly
- [ ] Verify all environment variables are set
- [ ] Test critical user flows in preview:
  - [ ] User registration
  - [ ] User login
  - [ ] Voice generation
  - [ ] Inbound call webhook
  - [ ] Outbound call initiation
  - [ ] WebSocket connection

### Launch (Afternoon)
- [ ] Deploy frontend to production
  ```bash
  cd frontend
  vercel --prod
  ```
- [ ] Deploy backend to production
  ```bash
  cd backend
  vercel --prod
  ```
- [ ] Run database migrations
  ```bash
  cd backend
  npx prisma migrate deploy
  ```
- [ ] Verify deployments are live
  - [ ] Frontend: `https://northshore.vercel.app`
  - [ ] Backend: `https://api.northshore.com/api/status`
- [ ] Test production endpoints
  - [ ] `/api/status` returns `{"status": "ok"}`
  - [ ] `/api/auth/login` works
  - [ ] `/api/voice/generate` works
- [ ] Verify WebSocket connections
  - [ ] Connect with JWT token
  - [ ] Subscribe to session updates
- [ ] Test inbound/outbound calls
  - [ ] Send test webhook
  - [ ] Verify call handling
- [ ] Monitor error logs (Vercel dashboard)

### Post-Launch (Evening)
- [ ] Monitor application metrics
  - [ ] Response times
  - [ ] Error rates
  - [ ] Request volumes
- [ ] Check error rates (should be < 1%)
- [ ] Verify webhook deliveries
  - [ ] Check Twilio webhook logs
  - [ ] Verify Stripe webhooks (if applicable)
- [ ] Test user registration/login flow
- [ ] Monitor database performance
  - [ ] Query times
  - [ ] Connection pool usage
- [ ] Set up alerts for critical errors
- [ ] Document any issues encountered

## Post-Launch (First Week)

### Monitoring Setup
- [ ] Set up error tracking (Sentry)
  - [ ] Configure DSN
  - [ ] Set up alerts
- [ ] Configure uptime monitoring
  - [ ] Ping `/api/status` every 1 minute
  - [ ] Alert on downtime
- [ ] Set up performance monitoring
  - [ ] Track API response times
  - [ ] Monitor database query times
- [ ] Monitor API usage/limits
  - [ ] AbëVoice API usage
  - [ ] Twilio usage
- [ ] Track user signups
- [ ] Monitor call volumes

### Optimization
- [ ] Review slow queries (database)
- [ ] Optimize API responses
  - [ ] Add caching where appropriate
  - [ ] Optimize database queries
- [ ] Enable CDN caching (Vercel automatic)
- [ ] Review and optimize bundle sizes
  - [ ] Frontend bundle analysis
  - [ ] Code splitting verification
- [ ] Monitor WebSocket connections
  - [ ] Connection count
  - [ ] Message throughput

### Documentation
- [ ] Update README with production URLs
- [ ] Document API endpoints (OpenAPI/Swagger)
- [ ] Create runbook for common issues
- [ ] Document rollback procedures
- [ ] Update deployment guide with lessons learned

### User Testing
- [ ] Test complete user journey
  - [ ] Landing page → Sign up → Dashboard
  - [ ] Voice generation demo
  - [ ] Call management
- [ ] Test on multiple browsers
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test on mobile devices
- [ ] Verify accessibility (WCAG basics)

## Critical Path Items (Must Complete)

### Before Launch
1. ✅ All environment variables set in Vercel
2. ✅ Database migrations run successfully
3. ✅ JWT_SECRET is secure (64+ chars)
4. ✅ CORS_ORIGIN matches production domain
5. ✅ Webhook URLs updated in telephony providers
6. ✅ Smoke tests pass

### Launch Day
1. ✅ Frontend deploys successfully
2. ✅ Backend deploys successfully
3. ✅ Database migrations complete
4. ✅ `/api/status` endpoint returns OK
5. ✅ User can register/login
6. ✅ Voice generation works
7. ✅ WebSocket connections work

### Post-Launch
1. ✅ Error monitoring active
2. ✅ Uptime monitoring configured
3. ✅ No critical errors in first 24 hours
4. ✅ Database performance acceptable
5. ✅ API response times < 500ms

## Rollback Plan

If critical issues occur:

1. **Immediate Rollback**
   ```bash
   # Rollback frontend
   cd frontend
   vercel rollback

   # Rollback backend
   cd backend
   vercel rollback
   ```

2. **Database Rollback** (if needed)
   ```bash
   cd backend
   npx prisma migrate resolve --rolled-back <migration-name>
   ```

3. **Emergency Contacts**
   - Vercel Support: support@vercel.com
   - Database Provider Support
   - Twilio Support
   - AbëVoice Support

## Success Criteria

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

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

