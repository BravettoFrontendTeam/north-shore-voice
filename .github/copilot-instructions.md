# GitHub Copilot / AI Agent Instructions — North Shore Voice 🔧

## TL;DR

- Full-stack TypeScript: **Frontend** (React + Vite) + **Backend** (Node/Express + TypeScript + Prisma). Core focus: AbëVoice TTS + multi-provider telephony and robust webhook handling.
- Start here: `README.md`, `AGENT_PROMPT.md`, `backend/src/`, `frontend/src/`, `backend/prisma/schema.prisma`.

---

## Quick commands (copy/paste) ✅

- Install deps: `npm ci` (repo root)
- Run backend: `cd backend && npm run dev` (default port 5000)
- Run frontend: `cd frontend && npm run dev` (Vite, port 3000)
- Run P0 smoke tests: `bash scripts/run-tests.sh` (includes `p0-launch-fixes.test.ts`)
- Run full tests: `bash scripts/run-all-tests.sh`
- Validate & deploy: `bash scripts/validate-p0-fixes.sh` then `bash scripts/deploy.sh` (uses Vercel; ensure envs are set)
- Demo fallback (macOS): `scripts/demo-fallback.sh` (tries AbëVoice → cached audio → macOS `say`)

---

## AbëVoice, voice flows & tests 🔊

(Agent-focused actionable items you can automate)

- Where to edit voice/TTS: `backend/src/services/abevoice-integration.ts` (generation & emission metadata).
  - Required metadata fields in emission: **`emotion`**, **`intensity`**, **`pacing`**, **`voice_style`**, **`directive`**.
  - Tests: add/modify `backend/tests/abevoice.emotion.test.ts` to mock the network call and assert returned body/metadata includes those fields.
  - Smoke script: `scripts/run-voice-smoke.sh` / `scripts/demo-fallback.sh` examine generated audio or fallback path and should be runnable in CI (mocking endpoint).
- Prompt & appraisal guidance: see `AGENT_PROMPT.md` (appraisal-first, vulnerability mapping, and PR checklist: include appraisal summary + vulnerability mapping in PR notes).

---

## Telephony & Webhooks 🚨

- Telephony core: `backend/src/services/telephony/` (see `index.ts` and `providers/`) — new providers implement `ITelephonyProvider` and are wired via the factory (`createTelephonyService` / `createProvider`).
- Provider pattern: provider config objects use `priority`, `enabled`, and provider credentials; cost/priority logic lives in `TelephonyService`.
- Webhooks: `backend/src/routes/webhooks.ts` MUST be mounted with raw body parsing in `index.ts`:
  - `app.use('/api/webhooks', express.raw({ type: 'application/json' }))` — do not change this or signature verification breaks.
  - Production MUST verify signatures (Twilio `x-twilio-signature`, Stripe `stripe-signature`). Dev/test fixtures may bypass verification.

---

## DB & Migrations 🗃️

- Prisma schema: `backend/prisma/schema.prisma`.
- After schema edits: `cd backend && npx prisma migrate dev --name <desc>`; commit `prisma/migrations` and review generated SQL.
- Deploy uses `prisma migrate deploy` — ensure migrations are vetted in PRs.

---

## Testing, CI & Conventions ✅

- P0-focused tests are explicit (look for `p0-` filenames and `P0 Fix` comments). Running `bash scripts/run-tests.sh` should be part of pre-merge checks.
- Conventions to follow in code changes:
  - Expected-return shape: many services return `{ success: boolean, ... }` rather than throwing for expected errors — match existing patterns.
  - Keep PRs small for voice flows: include an appraisal blurb, mention vulnerabilities, and add a unit test asserting emotion metadata.
  - Don't log secrets; use `scripts/setup-vercel-env.sh` or Vercel UI for production envs.

---

## Examples (copy/paste) ✨

- Add AbëVoice unit test (Jest):
  - Mock the HTTP client, call `abevoice-integration` with a canonical prompt, assert `response.metadata` includes `emotion` and `pacing`.
- Add a telephony provider:
  1. Create `backend/src/services/telephony/providers/<name>.ts` implementing `ITelephonyProvider`.
  2. Wire into the factory in `backend/src/services/telephony/index.ts`.
- Local webhook quick test (dev signatures off):
  curl -X POST http://localhost:5000/api/webhooks/call/incoming \
   -H 'Content-Type: application/json' \
   --data '{"callSid":"C1","from":"+1555123","to":"+1555000","direction":"inbound"}'

---

## Agent Playbook & Where to look next (docs & examples) 📚

- Agent guidance (primary): `AGENT_PROMPT.md` — **appraisal-first**, vulnerability mapping, and required PR checklist for voice flows.
- Unified AI flows doc: `.github/ai-flows.md` — machine + human readable agent flows, actionable rules, and example JSON snippets (use this as the canonical mapping for agent automation).
- Voice integration & tests: `backend/src/services/abevoice-integration.ts`, `backend/tests/abevoice.emotion.test.ts`, `scripts/run-voice-smoke.sh`, `scripts/demo-fallback.sh`
- Telephony & webhooks: `backend/src/services/telephony/`, `backend/src/routes/webhooks.ts` (NOTE: webhooks rely on `express.raw()` for signature verification; do not change parsing)

---

If you'd like, I can run a quick checklist against the repo (look for missing voice tests, missing smoke scripts in CI, or missing PR checklist notes) and prepare a small PR that adds/updates the tests and a CI job — which do you prefer me to start with? ✅
