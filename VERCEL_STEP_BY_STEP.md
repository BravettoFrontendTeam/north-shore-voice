# 🚀 Vercel Deployment - Step-by-Step Guide

## 🎯 Path of Least Resistance - ONE Repo, ONE Project

**Goal**: Deploy North Shore Voice to `bravetto.vip/vip/north-shore` with navigation back to main site.

---

## ✅ Step 1: Ignored Build Step Configuration

**Purpose**: Only build when frontend OR backend changes (not both every time)

**Steps**:
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Git**
2. Scroll to **"Ignored Build Step"** section
3. Click the dropdown (currently shows "Automatic")
4. Select: **"Only build if there are changes in a folder"**
5. Enter folder path: `frontend` OR `backend`
   - This means: Build ONLY if changes are in `frontend` OR `backend` folders
   - Skip builds for README/docs-only changes

**Why This?**:
- ✅ Saves build minutes
- ✅ Faster deployments
- ✅ Only builds what changed

**Alternative** (if you want more control):
- Select **"Run my Bash script"**
- Create script: `scripts/vercel-build-check.sh`
- Script returns `0` to build, `1` to skip

---

## ✅ Step 2: Framework Settings Override

**Current Issue**: Vercel detects Next.js, but you're using React + Vite

**Steps**:
1. Go to **Vercel Dashboard** → **Settings** → **Build and Deployment**
2. Scroll to **"Framework Settings"**
3. Click **"Override"** toggle next to Framework Preset
4. Configure manually:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm ci` (or `npm install`)
   - **Development Command**: `cd frontend && npm run dev`

**Why Override?**:
- Vercel auto-detection is wrong (thinks Next.js)
- Manual config ensures correct build process
- Matches your actual project structure

---

## ✅ Step 3: Root Directory Configuration

**For Monorepo (ONE repo, ONE project)** - Recommended:

**Steps**:
1. Go to **Vercel Dashboard** → **Settings** → **General**
2. Find **"Root Directory"** section
3. **Leave it EMPTY** (defaults to repo root)
4. Enable: **"Include files outside the root directory in the Build Step"** ✅
5. **Node.js Version**: Keep at `24.x` ✅

**Why Empty?**:
- Your `vercel.json` handles routing
- Both frontend and backend are in same repo
- Vercel will build both from root

**Alternative** (if you want separate builds):
- Set Root Directory to `frontend` (for frontend-only project)
- Set Root Directory to `backend` (for backend-only project)
- **But this requires TWO projects** (not recommended)

---

## ✅ Step 4: Create GitHub Repository

**You said**: "I will create repos or you can in those two Git Orgs"

**Recommended**: ONE monorepo in ONE org (simplest)

**Option A: Create in BravettoFrontendTeam** (since it's frontend-focused):
```bash
# Create new repo
gh repo create BravettoFrontendTeam/north-shore-voice \
  --public \
  --description "North Shore Voice - AI Phone System Demo"

# Push your code
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore"
git remote add origin https://github.com/BravettoFrontendTeam/north-shore-voice.git
git push -u origin main
```

**Option B: Use Existing Main Bravetto Repo**:
- If you find the main bravetto repo, we can add this as a subdirectory
- Or create a separate repo and connect it

---

## ✅ Step 5: Connect Git to Vercel

**Steps**:
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Git**
2. Click **"Connect Repository"** button
3. Select **GitHub**
4. Authorize Vercel (if needed)
5. Select your repository:
   - If monorepo: `BravettoFrontendTeam/north-shore-voice`
   - Or your main bravetto repo
6. Select branch: `main` (or `master`)
7. Click **"Connect"**

**Result**:
- ✅ Automatic deployments on push
- ✅ Preview environments for PRs
- ✅ Build logs in Vercel

---

## ✅ Step 6: Update vercel.json (Already Done!)

**Current `vercel.json`** (already configured):
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

**Status**: ✅ Already configured correctly!

---

## ✅ Step 7: Set Environment Variables

**Steps**:
1. Go to **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add each variable for **Production** environment:

```bash
# Critical (Required)
JWT_SECRET=<generate-with-command-below>
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

**Get DATABASE_URL**:
1. Go to **Vercel Dashboard** → **Integrations**
2. Find **Neon** → Click **"Manage"**
3. Create database or connect existing
4. Copy connection string
5. Paste as `DATABASE_URL`

---

## ✅ Step 8: Database Setup

**Steps**:
1. Go to **Vercel Dashboard** → **Integrations**
2. Find **Neon** → Click **"Add Integration"**
3. Create new database or connect existing
4. Copy `DATABASE_URL` → Add to Environment Variables
5. Run migrations:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

---

## ✅ Step 9: Deploy!

**Option A: Automatic (via Git)** - Recommended:
```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
# Vercel automatically deploys!
```

**Option B: Manual (via CLI)**:
```bash
vercel --prod
```

---

## ✅ Step 10: Verify Deployment

**Test Frontend**:
```bash
curl https://bravetto.vip/vip/north-shore
# Should return HTML
```

**Test Backend**:
```bash
curl https://bravetto.vip/vip/north-shore-back-end/api/status
# Should return: {"status":"ok","online":true}
```

**Test in Browser**:
- Visit: `https://bravetto.vip/vip/north-shore`
- Should see your React app
- Navigation back to `bravetto.vip` should work

---

## 🎯 Better Idea: Cloudflare + Vercel Hybrid

**Since bravetto.vip is on Cloudflare**, consider:

**Option**: Use Cloudflare Workers for routing
- `bravetto.vip` → Cloudflare (main site)
- `bravetto.vip/vip/north-shore` → Proxy to Vercel
- Simpler than Vercel subdirectory routing

**Steps**:
1. Deploy to Vercel: `north-shore-voice.vercel.app`
2. In Cloudflare:
   - Add route: `/vip/north-shore/*` → Proxy to Vercel
   - Add route: `/vip/north-shore-back-end/*` → Proxy to Vercel
3. Result: Clean URLs, easier management

**Pros**:
- ✅ Simpler routing
- ✅ Use Cloudflare's CDN
- ✅ Easier to navigate back to main site
- ✅ One place for all bravetto.vip routes

**Want me to set this up?** I can create Cloudflare Worker config.

---

## 📋 Quick Checklist

- [ ] Configure Ignored Build Step (Step 1)
- [ ] Override Framework Settings (Step 2)
- [ ] Set Root Directory (Step 3) - Leave empty
- [ ] Create GitHub repo (Step 4)
- [ ] Connect Git to Vercel (Step 5)
- [ ] Verify vercel.json (Step 6) - Already done ✅
- [ ] Set Environment Variables (Step 7)
- [ ] Setup Database (Step 8)
- [ ] Deploy (Step 9)
- [ ] Verify (Step 10)

---

## 🎯 Recommended Path: ONE Repo, ONE Project

**Why?**:
- ✅ Simplest setup
- ✅ Shared environment variables
- ✅ Single deployment pipeline
- ✅ Easier to manage
- ✅ Path of least resistance

**Structure**:
```
GitHub: BravettoFrontendTeam/north-shore-voice (monorepo)
├── frontend/
├── backend/
└── vercel.json (handles routing)

Vercel: Single project
├── Routes /vip/north-shore → Frontend
└── Routes /vip/north-shore-back-end → Backend

Domain: bravetto.vip
├── /vip/north-shore → Frontend
└── /vip/north-shore-back-end → Backend
```

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**  
**🔥 Year of the Fire Horse - Let's Flow! 🔥**

