# ⚡ EXECUTE NOW - 5 Steps

## 🎯 Path of Least Resistance

---

## STEP 1: Push to Existing Repo

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore" && \
git add . && \
git commit -m "Ready for Vercel deployment" && \
git push origin main
```

---

## STEP 2: Connect Vercel

1. Open: https://vercel.com/dashboard
2. **Settings** → **Git** → **Connect Repository**
3. Select: `bravetto/north-shore`
4. Branch: `main` → **Connect**

---

## STEP 3: Fix Framework

1. **Settings** → **Build and Deployment** → **Framework Settings**
2. Click **Override** toggle
3. Set:
   - Build: `cd frontend && npm run build`
   - Output: `frontend/dist`
   - Install: `npm ci`

---

## STEP 4: Environment Variables

**Settings** → **Environment Variables** → **Add** (Production):

```
JWT_SECRET=<paste-below>
DATABASE_URL=<get-from-neon>
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
- **Settings** → **Integrations** → **Neon** → **Add** → Create → Copy URL

---

## STEP 5: Deploy (Auto)

**Done!** Push triggers auto-deploy.

**Verify**:
```bash
curl https://bravetto.vip/vip/north-shore-back-end/api/status
```

---

**5 steps. Done.** 🚀
