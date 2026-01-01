# 🚀 DEPLOY NOW - Path of Least Resistance

## ⚡ 5 Steps to Deploy

---

## Step 1: Create GitHub Repo

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore" && \
gh repo create BravettoFrontendTeam/north-shore-voice --public --description "North Shore Voice Demo" && \
git init && \
git add . && \
git commit -m "Initial commit" && \
git branch -M main && \
git remote add origin https://github.com/BravettoFrontendTeam/north-shore-voice.git && \
git push -u origin main
```

---

## Step 2: Connect to Vercel

1. Go to: https://vercel.com/dashboard
2. Click: **Settings** → **Git**
3. Click: **Connect Repository**
4. Select: `BravettoFrontendTeam/north-shore-voice`
5. Branch: `main`
6. Click: **Connect**

---

## Step 3: Fix Framework Settings

1. Go to: **Settings** → **Build and Deployment**
2. Find: **Framework Settings**
3. Click: **Override** toggle
4. Set:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm ci`

---

## Step 4: Set Environment Variables

1. Go to: **Settings** → **Environment Variables**
2. Click: **Add New**
3. Add these (Production):

```
JWT_SECRET
DATABASE_URL
ABEVOICE_API_URL=https://api.abevoice.com
CORS_ORIGIN=https://bravetto.vip
NODE_ENV=production
VITE_API_URL=https://bravetto.vip/vip/north-shore-back-end
```

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Get DATABASE_URL**:
1. **Settings** → **Integrations** → **Neon** → **Add**
2. Create database → Copy connection string

---

## Step 5: Deploy

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore" && \
git add . && \
git commit -m "Deploy to Vercel" && \
git push origin main
```

**Done!** Vercel auto-deploys.

---

## ✅ Verify

```bash
curl https://bravetto.vip/vip/north-shore-back-end/api/status
```

Should return: `{"status":"ok"}`

---

**That's it. 5 steps. Deployed.** 🚀

