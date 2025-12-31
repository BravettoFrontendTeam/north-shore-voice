You are an expert full-stack TypeScript engineer finalizing a production North Shore system.

CONTEXT:
- Frontend (React/Vite) builds cleanly, serves at http://localhost:3000
- Backend (Express/Node) builds cleanly, API at http://localhost:5000/api
- Both have been type-checked, linted, tested (Jest passing)
- Both compile with zero errors
- Current issue: Frontend loads login form but auth session not establishing

ARCHITECTURE:
- Frontend: React + Vite + TypeScript (strict mode)
- Backend: Express + Node + TypeScript (strict mode)
- Auth: JWT via express-session (backend/src/auth.ts)
- DB: SQLite (currently in-memory for dev)
- API integration: abevoice-api.ts in frontend

YOUR TASK: Complete operational state by fixing these 5 items:

=== TASK 1: SESSION COOKIE ESTABLISHMENT ===
File: backend/src/auth.ts
Issue: express-session not setting cookies properly on login response
Fix needed:
1. Verify SessionOptions has: httpOnly: true, secure: false (dev), sameSite: 'lax'
2. Verify login endpoint returns Set-Cookie header with JSESSIONID
3. Verify res.json() after session.save() callback

Expected: POST /auth/login → 200 with Set-Cookie header
Test: curl -c cookies.txt http://localhost:5000/api/auth/login -d '{"email":"test","password":"test"}'

=== TASK 2: FRONTEND CREDENTIAL SUBMISSION ===
File: frontend/src/pages/Login.tsx (or similar)
Issue: Login form exists but may not be submitting to backend correctly
Fix needed:
1. Form onSubmit handler POSTs to http://localhost:5000/api/auth/login
2. Request includes { email, password } JSON body
3. Credentials: credentials: 'include' in fetch options (for cookies)
4. On success (200), store token in sessionStorage or localStorage
5. On success, redirect to /dashboard

Expected: Submit form → backend validates → session created → redirected to dashboard

=== TASK 3: AUTHENTICATED API CALLS ===
File: frontend/src/api/abevoice-api.ts
Issue: Subsequent API calls may not send auth token
Fix needed:
1. Every fetch call after login includes: credentials: 'include'
2. Every fetch call includes Authorization: Bearer {token} header (if using JWT)
3. Or: sessionStorage.getItem('token') and pass in header
4. Verify cookie is automatically sent with credentials: 'include'

Expected: GET /api/calls → 200 with data (not 403)

=== TASK 4: CORS & CREDENTIALS POLICY ===
File: backend/src/index.ts (or server setup)
Issue: Frontend localhost:3000 may be blocked by CORS when sending credentials
Fix needed:
1. Enable CORS middleware with: credentials: true
2. Set origin: ['http://localhost:3000', 'http://localhost:5000'] (allow both)
3. Verify: Access-Control-Allow-Credentials: true header returned
4. Verify: Access-Control-Allow-Origin: http://localhost:3000 header returned

Code snippet:
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

Expected: CORS preflight (OPTIONS) returns 200 with correct headers

=== TASK 5: SMOKE TEST VALIDATION ===
File: smoke-check.sh (at repo root)
Issue: Smoke check script needs to validate end-to-end flow
Fix needed:
1. Start backend: cd backend && npm run dev > /tmp/backend.log 2>&1 &
2. Wait 3 seconds for backend to boot
3. Start frontend: cd frontend && npm run dev > /tmp/frontend.log 2>&1 &
4. Wait 5 seconds for frontend to boot
5. Run validation checks:
   a. curl http://localhost:5000/api/status → expects { status: 'ok' }
   b. curl -X POST http://localhost:5000/api/auth/login -d '{"email":"test","password":"test"}' -H "Content-Type: application/json" → expects 200
   c. curl http://localhost:3000 → expects 200 (HTML response, not 403)
6. Kill both processes on exit
7. Report success/failure

Expected output: All checks pass, both services operational

---

COMPLETION CHECKLIST:

After implementing the above 5 tasks, verify:

✅ Task 1: backend/src/auth.ts has SessionOptions with proper cookie config
✅ Task 2: frontend login form POSTs to backend and handles response
✅ Task 3: frontend API calls include credentials: 'include'
✅ Task 4: backend CORS middleware enables credentials and correct origin
✅ Task 5: smoke-check.sh passes all 6 validation checks

VALIDATION COMMANDS (run after implementation):

# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend (in another terminal)
cd frontend && npm run dev

# Terminal 3: Run smoke check
./smoke-check.sh

# Expected results:
# 1. http://localhost:5000/api/status returns { status: 'ok' }
# 2. http://localhost:5000/api/auth/login (POST with creds) returns 200
# 3. http://localhost:3000 loads login form (not 403)
# 4. Login form submits → redirects to dashboard
# 5. Dashboard loads data from /api/calls (not 403)
# 6. System stable for 30 seconds with both services running

FINAL STATE = OPERATIONAL:
- Both services boot cleanly with 'npm run dev'
- Authentication flow works end-to-end
- API calls succeed with proper auth
- Frontend accessible at localhost:3000 without 403
- No console errors in either service
- All type-checks pass: npm run typecheck (both dirs)
