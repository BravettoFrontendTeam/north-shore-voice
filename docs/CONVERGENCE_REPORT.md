# North Shore Voice — Convergence Report

## 🎯 Executive Summary

Perfect! This report consolidates the deep codebase analysis, adversarial review, semantic search findings, and a prioritized, actionable plan for full system convergence (security, persistence, AI fidelity, UX, testing, and operations).

Key outcomes:
- **P0 (Immediate)**: Fix JWT/session hardening, persist in-memory state, secure WebSockets, enforce webhook signatures, and harden file uploads.
- **P1 (Near-term)**: Add observability, testing, connect demo to real AI/NLU, and remove dev-only API fallbacks in production.
- **P2–P3 (Medium/Low)**: RBAC, rate-limits per-account, i18n, accessibility, audit logging, API versioning, and DevOps enhancements.

---

## 🔎 Findings (Code & System-Level)

### Auth & Sessions
- **What**: `backend/src/routes/auth.ts` uses an in-memory user map and has a dev fallback JWT secret.
- **Risk**: Secret leakage, inability to revoke tokens, silent insecure defaults in production.
- **Files**: `backend/src/routes/auth.ts`, `backend/src/index.ts` (session config)

### Statefulness
- **What**: Calls, sessions, training samples use in-memory `Map` stores (e.g., `call-handler.ts`, `inbound-call.service.ts`, `outbound-call.service.ts`).
- **Risk**: Data loss on restart; poor horizontal scaling.
- **Files**: `backend/src/services/call-handler.ts`, `backend/src/services/inbound-call.service.ts`

### WebSocket
- **What**: `websocket.ts` accepts `authenticate` messages and sets `userId` without verifying JWT.
- **Risk**: Unauthorized subscription to live call data.
- **Files**: `backend/src/services/websocket.ts`

### Telephony & Webhooks
- **What**: Webhook route exists, express raw body used correctly, but signature verification is partial/commented.
- **Risk**: Forged webhooks; financial or call-flow manipulations.
- **Files**: `backend/src/routes/webhooks.ts`

### AbëVoice Integration
- **What**: Integration provides `generate`, `streamGenerate`, `initiateOutboundCall`, `acceptInboundCall`. It **simulates success** on failures (dev-friendly).
- **Risk**: Production could mask real failures; false positives in operational health.
- **Files**: `backend/src/services/abevoice-integration.ts`

### File Uploads & Training
- **What**: `training.ts` uses multer disk storage with MIME checks but no virus scanning or quotas.
- **Risk**: Malware injection, DoS via upload volume.
- **Files**: `backend/src/routes/training.ts`

### Frontend
- **What**: Demo is scripted (`frontend/src/pages/Demo.tsx`) and not connected to real AI. JWT stored in `sessionStorage` on login and no refresh flow present.
- **Risk**: Misleading demo, session expiry UX issues.
- **Files**: `frontend/src/pages/Demo.tsx`, `frontend/src/pages/Login.tsx`

### Observability & Testing
- **What**: Console logs prevalent, no centralized logging/tracing, minimal tests (`tests/` limited coverage).
- **Risk**: Harder to debug incidents, increased regression risk.

---

## ✅ Prioritized Remediation Plan (Actionable)

### P0 — Immediate (0–2 weeks): Stabilize & Secure
- Enforce `JWT_SECRET` presence; convert dev fallback to hard failure in production (owner: Backend). (2–3d)
- Migrate in-memory state to Redis/Postgres (sessions, call sessions, training indexes). Create migration pattern. (owner: Backend + Infra). (5–10d)
- Validate and require JWT on WebSocket upgrade; implement server-side token verification and per-session ACLs. (owner: Backend). (2–3d)
- Enforce webhook signature verification for each provider and add unit tests with sample payloads. (owner: Backend). (2–3d)
- Add virus scanning / signed S3 uploads and per-user quotas for training uploads. (owner: Backend + Infra). (3–5d)

### P1 — Near Term (2–6 weeks): Observability & AI fidelity
- Integrate structured logging + tracing (OpenTelemetry), metrics (Prometheus), and dashboards/alerts (owner: DevOps). (5–8d)
- Add CI smoke tests that run `scripts/smoke-check.sh` and fail PRs when basic endpoints are down. (owner: CI). (1–2d)
- Replace scripted demo with a backend-backed sandbox that uses a configurable LLM/NLU + AbëVoice sandbox. (owner: Backend + Frontend). (7–14d)
- Disable AbëVoice simulation in prod via env flag and add monitoring/alerting for API unavailability. (owner: Backend). (1–2d)

### P2 — Medium (1–3 months): Scale & Robustness
- Implement RBAC and per-account rate limiting (owner: Backend + Auth). (7–14d)
- Add audit logging for model training, call starts, exports, API key usage. (owner: Backend). (3–5d)
- Add e2e tests for critical flows (webhooks, inbound/outbound calls, training). (owner: QA/Backend). (5–10d)

### P3 — Product Polish & Compliance (3+ months)
- Accessibility audit and remediation across UI (owner: Frontend). (7–14d)
- Internationalization (i18n) for voice and UI (owner: Product + Frontend). (2–4 weeks)
- Data export/import features for compliance and migration (owner: Backend + Frontend). (2–4 weeks)

---

## 📊 Risk Matrix
- High: session secrets, webhook integrity, WebSocket auth
- Medium: AbëVoice availability (operational but masked), upload security
- Low: Demo fidelity (user confusion) and missing docs

---

## 🛠 Tactical Next Steps (Concrete PRs / Tasks)
1. PR: `backend/auth/jwt-hard-fail` — make `JWT_SECRET` mandatory in production and add env validation script. (Quick)
2. PR: `backend/session-redis` — extract session and active-calls to Redis; add migrations and feature flags. (Medium)
3. PR: `backend/ws-auth` — require JWT on WebSocket upgrade and apply ACLs. (Quick)
4. PR: `backend/webhooks/signature-tests` — add provider test vectors & strict verification. (Quick)
5. PR: `ci/smoke-check` — run `scripts/smoke-check.sh` in CI on every PR. (Quick)

---

## 📋 Suggested PR Checklist (for each change)
- [ ] Type-checks (`npx tsc --noEmit`)
- [ ] Unit tests added/updated
- [ ] Integration/e2e test (if relevant) or smoke test added
- [ ] Docs updated (`README`, `SECURITY.md`) if behavior changed
- [ ] Feature flag or migration path included
- [ ] Security review for new sensitive code

---

## 📌 Appendix — File References
- Auth: `backend/src/routes/auth.ts`
- WebSocket: `backend/src/services/websocket.ts`
- Call Handler: `backend/src/services/call-handler.ts`
- AbëVoice integration: `backend/src/services/abevoice-integration.ts`
- Webhooks: `backend/src/routes/webhooks.ts`
- Training uploads: `backend/src/routes/training.ts`
- Demo: `frontend/src/pages/Demo.tsx`

---

## Wrap-up
- All high-risk items have concrete short-term remediation steps in this plan. I can start implementing P0 fixes immediately (pick an item and I will draft the PR). 

> Note: I can also generate a prioritized sprint board (tickets, estimates, owners) and prepare the initial PRs; say "Start P0" and I will create the first PR and tests.

---

*Generated by GitHub Copilot (Raptor mini (Preview))*
