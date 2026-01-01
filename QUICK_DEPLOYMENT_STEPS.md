# ⚡ Quick Deployment Steps - Bravetto.Vip

## 🎯 Immediate Actions Required

### 1. **Connect Git Repository** (BLOCKER - Do This First!)

**Current Status**: Vercel project is NOT connected to Git

**Steps**:
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Click "Connect Repository"
3. Select GitHub
4. Choose the correct repository:
   - **Question**: Which GitHub org/repo contains your code?
   - Frontend org: `BravettoBackendTeam` (name seems backwards?)
   - Backend org: `BravettoFrontendTeam` (name seems backwards?)
   - **OR** is it a monorepo in one location?

5. Select the repository and branch (usually `main` or `master`)

---

### 2. **Fix Framework Settings**

**Current Issue**: Vercel detects Next.js, but you're using React + Vite

**Steps**:
1. Go to Vercel Dashboard → Settings → Build and Deployment
2. Scroll to "Framework Settings"
3. Click "Override" next to Framework Preset
4. Select "Other" or manually configure:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm ci` (or `npm install`)

---

### 3. **Configure Root Directory**

**Decision**: Single project (recommended) vs. Separate projects

**For Single Project** (Recommended):
- **Root Directory**: Leave empty (uses repo root)
- **Include files outside root**: Enabled ✅
- Use the updated `vercel.json` I created

**For Separate Projects**:
- Frontend project: Root Directory = `frontend`
- Backend project: Root Directory = `backend`

---

### 4. **Set Environment Variables**

Go to Vercel Dashboard → Settings → Environment Variables

**Add these for Production**:

```bash
# Critical
JWT_SECRET=<generate-64-char-hex>
DATABASE_URL=<neon-connection-string>
ABEVOICE_API_URL=https://api.abevoice.com
CORS_ORIGIN=https://bravetto.vip
NODE_ENV=production

# Frontend API URL
VITE_API_URL=https://bravetto.vip/vip/north-shore-back-end

# Optional - Telephony
TWILIO_ACCOUNT_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
```

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 5. **Database Setup** (Neon Integration)

1. Go to Vercel Dashboard → Integrations
2. Find "Neon" → Click "Manage"
3. Create new database or connect existing
4. Copy the `DATABASE_URL` connection string
5. Add to Environment Variables (see step 4)

**Run Migrations**:
```bash
cd backend
npx prisma migrate deploy
```

---

### 6. **Deploy**

**Option A: Via Git** (Recommended - Automatic)
```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
# Vercel will automatically deploy
```

**Option B: Via CLI**
```bash
vercel --prod
```

---

## 🔍 Verify Deployment

### Check Frontend
```bash
curl https://bravetto.vip/vip/north-shore
# Should return HTML
```

### Check Backend
```bash
curl https://bravetto.vip/vip/north-shore-back-end/api/status
# Should return: {"status":"ok","online":true}
```

---

## ⚠️ Critical Questions to Answer

1. **Git Repository**: Which GitHub org/repo contains your code?
   - Monorepo in one location?
   - Separate repos in the orgs?

2. **Deployment Structure**: 
   - Single project with routing? (Recommended)
   - Or two separate projects?

3. **Path Requirements**: 
   - Must use `/vip/north-shore` paths?
   - Or can use subdomains?

---

## 📋 Pre-Deployment Checklist

- [ ] Git repository connected to Vercel
- [ ] Framework settings corrected (override Next.js)
- [ ] Root directory configured
- [ ] Environment variables set
- [ ] Database created and connected (Neon)
- [ ] Prisma migrations run
- [ ] `vercel.json` updated with correct routes
- [ ] Frontend API URL updated (if needed)
- [ ] CORS origin set to `https://bravetto.vip`

---

## 🚀 After Deployment

1. **Test Frontend**: Visit `https://bravetto.vip/vip/north-shore`
2. **Test Backend**: `curl https://bravetto.vip/vip/north-shore-back-end/api/status`
3. **Test Integration**: Frontend → Backend API calls
4. **Check Logs**: Vercel Dashboard → Logs
5. **Monitor**: Watch for errors in first 24 hours

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**  
**🔥 Year of the Fire Horse - LET'S GO! 🔥**

