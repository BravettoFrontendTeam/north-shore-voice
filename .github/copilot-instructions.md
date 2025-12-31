# GitHub Copilot / AI Agent Instructions for North Shore Voice 🔧

## Quick overview

- Purpose: Full-stack TypeScript app that implements an AI-powered voice platform built on AbëVoice. Frontend (React + Vite) and Backend (Node/Express + TypeScript + Prisma) are in this repo.
- Where to start: `README.md` (quick start), `backend/src/` (API business logic & telephony), `frontend/src/` (UI + services), `backend/prisma/schema.prisma` (DB schema), `scripts/smoke-check.sh` (dev smoke tests).

## Local dev & verification ✅

- Install deps:
  - Root: `npm ci` (sets up husky/prettier hooks)
  - `cd backend && npm install`
  - `cd frontend && npm install`
- DB & migrations: `cd backend && npx prisma migrate dev` (runs migration and updates the client). Update `DATABASE_URL` in `backend/.env`.
- Start dev servers:
  - Backend: `cd backend && npm run dev` (uses `ts-node-dev`)
  - Frontend: `cd frontend && npm run dev` (Vite; port configured to `3000` in `vite.config.ts`)
- Quick smoke check: `./scripts/smoke-check.sh` — NOTE: the script defaults `BACKEND_PORT=5050` (override with `BACKEND_PORT=5000` if needed to match local server).

## Key patterns & where to find them 🔎

- Telephony plumbing: `backend/src/services/telephony/`
  - Multi-provider service: `TelephonyService` (`index.ts`) orchestrates providers, failover, cost-selection.
  - Implement new provider by adding `backend/src/services/telephony/providers/<provider>.ts` implementing `ITelephonyProvider` methods (`makeCall`, `getCallStatus`, `parseWebhook`, etc.).
- AbëVoice integration: `backend/src/services/abevoice-integration.ts` — central place for TTS, inbound/outbound call control, and simulation when the API is unavailable.
- Inbound/outbound call logic: `backend/src/services/inbound-call.service.ts` and `backend/src/services/outbound-call.service.ts`.
- Webhooks: `backend/src/routes/webhooks.ts` and server uses `app.use('/api/webhooks', express.raw({ type: 'application/json' }))` — do not replace raw parser unintentionally; Twilio signature validation expects raw body.
- Websockets & real-time: `backend/src/services/websocket.ts` (used to push live updates to UI).
- DB schema: `backend/prisma/schema.prisma` — run `npx prisma migrate dev` after schema changes and commit generated migration files.

## Conventions to follow ✍️

- TypeScript strict mode is enforced; run `npx tsc --noEmit` (root `npm run check` covers type checks in pre-commit hooks).
- Error/return style: service methods tend to return objects with `{ success: boolean, ... }` rather than throwing for expected failure cases. Follow the existing pattern (see `abevoice-integration.ts`, telephony providers).
- Small, focused PRs: prefer incremental changes (service + tests + smoke-check update), include migration files when changing DB.
- Formatting & pre-commit hooks: repo uses Prettier + Husky + lint-staged. Run `npm run format` and ensure hooks are installed (`npm run prepare`).
- No secrets in source: use `.env` and `backend/scripts/validate-secrets.sh` to validate required vars before deployment.

## Environment & integration points ⚙️

- Important env vars (see `backend/SECURITY.md`): `JWT_SECRET`, `DATABASE_URL`, `ABEVOICE_API_URL`, `ABEVOICE_API_KEY`, `TWILIO_*`, `PLIVO_*`, `SIGNALWIRE_*`, `TELNYX_*`.
- Docker Compose sets postgres/redis and provides a production-like environment: `docker-compose up -d` (see `docker-compose.yml` healthchecks and mapped ports).

## Testing & verification guidance ✅

- There's limited test coverage in the repo; rely on:
  - Type checks: `npx tsc --noEmit`
  - Formatting: `npx prettier --check .` or `npm run check`
  - Smoke test: `./scripts/smoke-check.sh` (starts both dev servers and verifies a basic login flow)
  - Manual verification for telephony: validate webhook parsing and provider healthchecks (see `TelephonyService.checkProviderHealth`).

## Typical change examples (copy/paste friendly) ✨

- Add a new telephony provider:
  - Add `backend/src/services/telephony/providers/myprovider.ts` implementing `ITelephonyProvider`.
  - Wire it into `backend/src/services/telephony/index.ts` createProvider switch.
  - Add config (env or DB) and add healthcheck logic if needed.
- Change webhook handling:
  - Edit `backend/src/routes/webhooks.ts` but keep `express.raw` for the `/api/webhooks` route so signature validation still works.
- Add a new API endpoint:
  - Add route under `backend/src/routes/`, add business logic in `backend/src/services/`, add types to `backend/src/types/` and run `npx tsc`.

## Safety & security notes ⚠️

- Do not commit secrets or keys. Use `.env` for local development and update `SECURITY.md` as necessary.
- `run-backend.bat` contains sample env lines; ensure sensitive values are removed before committing.

## Agent behavior & operational recommendations 🤖

- Keep changes minimal and fully verifiable: run `npm run dev`, `scripts/smoke-check.sh`, `npx tsc`, and `npx prisma migrate dev` if schema changes.
- Add tests for new business logic where feasible and include steps to reproduce in PR description.
- When touching webhook or telephony code, include manual test instructions (sample payloads or `curl`) and expected results.
- If you need broader design decisions documented, add a short design note under `docs/` and update `README.md` to point to it.

## Housekeeping & TODOs for maintainers

- The `README.md` references `AGENT_PROMPT.md` but this file is not present; consider adding or linking the intended agent prompt (I can draft one if you want).
- If you want stricter CI: add type-check and smoke-check steps to CI workflows.

---

If any section is unclear or you'd like me to include concrete examples (e.g. sample `curl` payloads for webhook tests, or an `AGENT_PROMPT.md` draft), tell me which areas to expand and I will iterate. ✅
