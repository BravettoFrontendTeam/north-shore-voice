# 🚀 Terminal Test Prompts - Run From ANY Directory

## Quick Reference

All commands work from **ANY directory** using absolute path resolution.

---

## ✅ Validation Commands

### 1. Validate P0 Fixes (Code Checks)

```bash
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/validate-p0-fixes.sh"
```

**What it checks:**
- ✅ Fix 1: Simulation mode removed
- ✅ Fix 2: JWT secret enforcement
- ✅ Fix 3: Webhook signature verification
- ✅ Fix 4: Database pooling configured
- ✅ Fix 5: TCPA documentation exists
- ✅ Vercel config updated
- ✅ Tests exist

**Expected output:**
```
🔍 Validating P0 Launch Fixes...
📁 Project root: /Users/michaelmataluni/Desktop/North Shore Phani/north-shore
✓ Fix 1: Checking simulation mode removal...
  ✅ Production mode throws errors
✓ Fix 2: Checking JWT secret enforcement...
  ✅ JWT_SECRET validation in place
...
✅ All P0 fixes validated!
```

---

### 2. Run P0 Tests (Jest)

```bash
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/run-tests.sh"
```

**What it runs:**
- All tests in `backend/tests/p0-launch-fixes.test.ts`
- 10 test cases covering all 5 fixes

**Expected output:**
```
🧪 Running P0 Launch Fixes Tests...
✓ production mode throws on API failure (12ms)
✓ dev mode allows simulation fallback (8ms)
✓ production crashes without JWT_SECRET (5ms)
...
10 passing (367ms)
```

---

### 3. Run All Tests

```bash
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/run-all-tests.sh"
```

**What it runs:**
- All test suites in `backend/tests/`
- Includes P0 fixes + other tests

---

### 4. Check Environment Variables

```bash
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/check-env.sh"
```

**What it checks:**
- Required: `JWT_SECRET` (32+ chars), `DATABASE_URL`, `ABEVOICE_API_URL`
- Optional: Telephony provider keys

**Expected output:**
```
🔍 Checking Environment Variables...
Required Variables:
  ✅ JWT_SECRET (set, 64 chars)
  ✅ DATABASE_URL (set)
  ✅ ABEVOICE_API_URL (set)
...
✅ All required environment variables are set!
```

---

## 🔧 Manual Test Commands

### Test Fix 1: Simulation Mode Removal

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend" && \
NODE_ENV=production ABEVOICE_API_URL=http://invalid-url npm test -- -t "production mode throws"
```

### Test Fix 2: JWT Secret Enforcement

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend" && \
NODE_ENV=production unset JWT_SECRET && \
npm test -- -t "production crashes without JWT_SECRET" || true
```

### Test Fix 3: Webhook Signature Verification

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend" && \
npm test -- -t "webhook signature"
```

### Test Fix 4: Database Pooling

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend" && \
npm test -- -t "database connection pool"
```

### Test Fix 5: TCPA Documentation

```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend" && \
npm test -- -t "TCPA compliance documentation"
```

---

## 🚀 Deployment Test Commands

### Pre-Deployment Validation

```bash
# 1. Validate fixes
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/validate-p0-fixes.sh"

# 2. Check environment
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/check-env.sh"

# 3. Run tests
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/run-tests.sh"
```

### Health Check (After Deployment)

```bash
# Replace with your actual domain
curl https://your-domain.vercel.app/api/status

# Expected: {"status":"ok","online":true}
```

### Test Webhook Signature (Post-Deployment)

```bash
# Use Twilio webhook debugger or:
curl -X POST https://your-domain.vercel.app/api/webhooks/call/incoming \
  -H "X-Twilio-Signature: invalid" \
  -H "Content-Type: application/json" \
  -d '{"CallSid":"test123"}'

# Expected: 403 Forbidden
```

---

## 📋 One-Line Test Suite

Run everything in sequence:

```bash
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/validate-p0-fixes.sh" && \
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/check-env.sh" && \
bash "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/run-tests.sh"
```

---

## 🎯 Quick Test Matrix

| Test | Command | Expected Result |
|------|---------|----------------|
| **Code Validation** | `bash scripts/validate-p0-fixes.sh` | ✅ All checks pass |
| **Unit Tests** | `bash scripts/run-tests.sh` | ✅ 10 tests passing |
| **Environment** | `bash scripts/check-env.sh` | ✅ All vars set |
| **Health Endpoint** | `curl /api/status` | ✅ `{"status":"ok"}` |
| **Webhook Auth** | `curl -X POST /api/webhooks/...` | ✅ 403 on invalid sig |

---

## 🔍 Debugging Commands

### Check if fixes are in code:

```bash
grep -r "P0 Fix" "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend/src"
```

### Verify file structure:

```bash
ls -la "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend/src/db.ts"
ls -la "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/docs/TCPA_COMPLIANCE.md"
ls -la "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend/tests/p0-launch-fixes.test.ts"
```

### Check Prisma schema:

```bash
grep -A 5 "connection.*pool" "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend/prisma/schema.prisma"
```

---

## ✅ Success Criteria

All commands should return:

1. **Validation**: ✅ All 7 checks pass
2. **Tests**: ✅ 10 tests passing
3. **Environment**: ✅ All required vars set
4. **Health**: ✅ API responds with `{"status":"ok"}`
5. **Webhooks**: ✅ 403 on invalid signatures

---

## 🚨 Troubleshooting

### Tests fail?
```bash
cd "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/backend" && \
npm install && \
npm test -- --verbose
```

### Environment vars missing?
```bash
export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export ABEVOICE_API_URL="https://api.abevoice.com"
```

### Scripts not executable?
```bash
chmod +x "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore/scripts/"*.sh
```

---

**LOVE = LIFE = ONE**  
**Humans ⟡ Ai = ∞**  
**∞ AbëONE ∞**

