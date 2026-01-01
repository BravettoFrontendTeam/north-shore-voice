# 🎯 Bravetto.Vip Vercel Deployment Analysis

## 🔥 Year of the Fire Horse - Full Deployment Strategy

**Project ID**: `prj_JywLu8zc24UBgWLXKeIUNthIJCgP`  
**Target Domain**: `bravetto.vip`  
**Demo Site**: Client/Customer facing

---

## 📊 Current Vercel Configuration Analysis

### Image Analysis Summary

#### 1. **Environments Configuration** ✅
- **Production**: Connected to `www.bravetto.vip` (+3 more domains)
- **Preview**: All unassigned git branches
- **Development**: Accessible via CLI
- **Status**: ✅ Properly configured

#### 2. **Domain Configuration** ✅
- `bravetto.vip` → Production environment
- `www.bravetto.vip` → Production environment
- **Status**: ✅ Domains properly connected

#### 3. **Framework Settings** ⚠️
- **Detected**: Next.js framework
- **Issue**: Your project is **React + Vite**, NOT Next.js
- **Action Required**: Override framework preset or configure manually

#### 4. **Root Directory Settings** ⚠️
- **Node.js Version**: 24.x ✅
- **Root Directory**: Empty (defaults to repo root)
- **Issue**: For subdirectory deployment, need to set root directory

#### 5. **Git Integration** ❌ **CRITICAL**
- **Status**: **NOT CONNECTED** to any Git repository
- **Impact**: No automatic deployments, no preview environments
- **Action Required**: Connect to GitHub repository

#### 6. **Integrations Available** ✅
- Neon (Database) - Billed via Vercel
- Supabase (Auth) - Billed via Vercel
- Stripe (Payments)
- xAI, Perplexity API (AI services)
- **Status**: Ready to integrate

---

## 🎯 Deployment Strategy Options

### **Option 1: Single Project with Subdirectory Routing** (Recommended)

**Structure**:
```
bravetto.vip/
├── /vip/north-shore → Frontend (React SPA)
└── /vip/north-shore-back-end → Backend API
```

**Pros**:
- ✅ Single Vercel project
- ✅ Shared environment variables
- ✅ Easier domain management
- ✅ Single deployment pipeline

**Cons**:
- ⚠️ Requires root directory configuration
- ⚠️ More complex routing setup

**Configuration**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/vip/north-shore-back-end/(.*)",
      "dest": "backend/src/index.ts"
    },
    {
      "src": "/vip/north-shore/(.*)",
      "dest": "frontend/dist/$1"
    },
    {
      "src": "/vip/north-shore",
      "dest": "frontend/dist/index.html"
    }
  ]
}
```

---

### **Option 2: Two Separate Projects** (Alternative)

**Structure**:
- **Project 1**: `bravetto.vip/vip/north-shore` (Frontend)
- **Project 2**: `bravetto.vip/vip/north-shore-back-end` (Backend)

**Pros**:
- ✅ Clear separation
- ✅ Independent deployments
- ✅ Separate scaling

**Cons**:
- ❌ Two projects to manage
- ❌ Duplicate environment variables
- ❌ More complex domain setup

---

## 🔍 Critical Issues & Dependencies

### 1. **Git Repository Connection** ❌ **BLOCKER**

**Current State**:
- Vercel project is **NOT connected** to Git
- No automatic deployments
- No preview environments

**GitHub Organizations**:
- Frontend: `BravettoBackendTeam` (⚠️ Name suggests backend, but you said frontend)
- Backend: `BravettoFrontendTeam` (⚠️ Name suggests frontend, but you said backend)

**Action Required**:
1. **Clarify Git Repository Mapping**:
   - Which org/repo contains frontend code?
   - Which org/repo contains backend code?
   - Or is it a monorepo in one location?

2. **Connect Repository**:
   ```bash
   # In Vercel Dashboard → Settings → Git
   # Connect to GitHub → Select repository
   ```

---

### 2. **Framework Detection Mismatch** ⚠️

**Issue**: Vercel detects Next.js, but your project is React + Vite

**Solution**: Override framework settings:
- **Framework Preset**: Override → Select "Other" or "Vite"
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Root Directory**: Leave empty (or set to `frontend` if deploying separately)

---

### 3. **Root Directory Configuration** ⚠️

**For Subdirectory Deployment**:
- **Option A**: Set root directory to project root, use routing
- **Option B**: Set root directory to `frontend` or `backend` for separate projects

**Recommendation**: Use Option A (single project with routing)

---

### 4. **Domain Path Configuration** ⚠️

**Target Paths**:
- Frontend: `/vip/north-shore`
- Backend: `/vip/north-shore-back-end`

**Vercel Limitation**: Vercel doesn't natively support subdirectory paths on custom domains without:
1. Using rewrites/routes (Option 1)
2. Using separate projects with path prefixes (Option 2)

**Best Practice**: Use Vercel's routing system with rewrites

---

## 🔗 Dependencies & Relationships

### **Frontend → Backend Dependencies**

1. **API Base URL**:
   ```typescript
   // frontend/src/services/abevoice-api.ts
   const API_BASE_URL = process.env.VITE_API_URL || 
     'https://bravetto.vip/vip/north-shore-back-end'
   ```

2. **CORS Configuration**:
   ```typescript
   // backend/src/index.ts
   CORS_ORIGIN: 'https://bravetto.vip'
   ```

3. **WebSocket Connection**:
   ```typescript
   // Frontend WebSocket URL
   wss://bravetto.vip/vip/north-shore-back-end/ws
   ```

### **Backend → External Services**

1. **Database**: Neon (via Vercel integration)
2. **AbëVoice API**: External service
3. **Twilio**: Telephony provider
4. **Stripe**: Payment processing (if needed)

---

## 📋 Deployment Checklist

### **Pre-Deployment** (Critical)

- [ ] **Connect Git Repository** (BLOCKER)
  - [ ] Determine correct GitHub org/repo
  - [ ] Connect in Vercel Dashboard
  - [ ] Verify branch tracking

- [ ] **Fix Framework Settings**
  - [ ] Override Next.js detection
  - [ ] Set correct build commands
  - [ ] Configure output directory

- [ ] **Configure Root Directory**
  - [ ] Decide: Single project vs. Separate projects
  - [ ] Set root directory accordingly
  - [ ] Configure routing/rewrites

- [ ] **Set Environment Variables**
  - [ ] `JWT_SECRET` (64+ chars)
  - [ ] `DATABASE_URL` (Neon connection string)
  - [ ] `ABEVOICE_API_URL`
  - [ ] `CORS_ORIGIN` = `https://bravetto.vip`
  - [ ] `VITE_API_URL` = `https://bravetto.vip/vip/north-shore-back-end`

- [ ] **Database Setup**
  - [ ] Create Neon database (via Vercel integration)
  - [ ] Run Prisma migrations: `npx prisma migrate deploy`
  - [ ] Verify connection

### **Deployment**

- [ ] **Deploy Frontend**
  - [ ] Verify build succeeds
  - [ ] Test `/vip/north-shore` route
  - [ ] Verify static assets load

- [ ] **Deploy Backend**
  - [ ] Verify serverless functions deploy
  - [ ] Test `/vip/north-shore-back-end/api/status`
  - [ ] Verify API endpoints work

- [ ] **Test Integration**
  - [ ] Frontend can call backend API
  - [ ] WebSocket connections work
  - [ ] Authentication flow works
  - [ ] Voice generation works

### **Post-Deployment**

- [ ] **Verify Domains**
  - [ ] `bravetto.vip/vip/north-shore` loads frontend
  - [ ] `bravetto.vip/vip/north-shore-back-end/api/status` responds
  - [ ] SSL certificates valid

- [ ] **Monitor**
  - [ ] Check Vercel logs for errors
  - [ ] Monitor function execution times
  - [ ] Check database connections

---

## 🚀 Recommended Deployment Path

### **Step 1: Connect Git** (Do This First!)

```bash
# 1. Push code to GitHub (if not already)
git remote add origin <your-github-repo-url>
git push -u origin main

# 2. In Vercel Dashboard:
# Settings → Git → Connect Repository
# Select your GitHub repository
```

### **Step 2: Configure Project Settings**

**In Vercel Dashboard → Settings → General**:

1. **Root Directory**: Leave empty (monorepo root)
2. **Framework Preset**: Override → "Other"
3. **Build Command**: `cd frontend && npm run build`
4. **Output Directory**: `frontend/dist`
5. **Install Command**: `npm ci` (or `npm install`)

**In Vercel Dashboard → Settings → Build and Deployment**:

1. **Root Directory**: Empty (uses repo root)
2. **Node.js Version**: 24.x ✅

### **Step 3: Update vercel.json**

Create/update root `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/vip/north-shore-back-end/(.*)",
      "dest": "backend/src/index.ts"
    },
    {
      "src": "/vip/north-shore/(.*)",
      "dest": "frontend/dist/$1"
    },
    {
      "src": "/vip/north-shore",
      "dest": "frontend/dist/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "backend/src/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### **Step 4: Set Environment Variables**

**In Vercel Dashboard → Settings → Environment Variables**:

```bash
# Critical
JWT_SECRET=<64-char-hex>
DATABASE_URL=<neon-connection-string>
ABEVOICE_API_URL=https://api.abevoice.com
CORS_ORIGIN=https://bravetto.vip
NODE_ENV=production

# Frontend
VITE_API_URL=https://bravetto.vip/vip/north-shore-back-end

# Optional
TWILIO_ACCOUNT_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
```

### **Step 5: Deploy**

```bash
# Option 1: Via Git (Recommended)
git push origin main  # Triggers automatic deployment

# Option 2: Via CLI
vercel --prod
```

---

## ⚠️ Critical Questions to Answer

1. **Git Repository Structure**:
   - Is this a monorepo (frontend + backend in one repo)?
   - Or separate repos in the GitHub orgs?
   - Which org/repo contains what?

2. **Deployment Preference**:
   - Single project with routing? (Recommended)
   - Or two separate projects?

3. **Domain Configuration**:
   - Are `/vip/north-shore` paths required?
   - Or can we use subdomains? (`north-shore.bravetto.vip`)

4. **Database**:
   - Use Neon (via Vercel integration)? (Recommended)
   - Or external PostgreSQL?

---

## 🎯 Next Steps

1. **Immediate**: Connect Git repository to Vercel
2. **Immediate**: Clarify GitHub org/repo structure
3. **Then**: Configure framework settings (override Next.js)
4. **Then**: Set environment variables
5. **Then**: Deploy and test

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**  
**🔥 Year of the Fire Horse - Let's FUCKING GO! 🔥**

