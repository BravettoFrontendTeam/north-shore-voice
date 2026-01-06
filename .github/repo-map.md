# Repository map — North Shore (human summary)

This document summarizes the repository structure and points Copilot/AI agents to the most important files and patterns. For a machine-readable version see `.github/repo-map.json`.

## At a glance
- Full-stack TypeScript app: Backend (Node + Express + Prisma) and Frontend (React + Vite).
- Focus areas: AbëVoice TTS (backend services + tests), multi-provider telephony (Twilio/Plivo/Telnyx/SignalWire), and robust webhook handling.

---

## Quick entry points
- Start: `README.md`, `AGENT_PROMPT.md`
- Backend: `backend/src/` — see `index.ts`, `services/abevoice-integration.ts`, `services/telephony/`
- Frontend: `frontend/src/` — see `pages/Demo.tsx` and `services/abevoice-api.ts`
- Scripts: `scripts/` — test, demo fallback, deploy helpers
- Docs: `docs/` and `AGENT_PROMPT.md` (agent guidance and appraisal-first principles)

---

## Key patterns AI agents should know
- AbëVoice emissions must include metadata fields: `emotion`, `intensity`, `pacing`, `voice_style`, `directive`.
- Webhook routes use `express.raw()` for proper signature verification — do not modify this behavior.
- Telephony providers implement a shared interface (`ITelephonyProvider`) and are selected with priority/cost logic.
- P0 / launch-critical tests are explicitly named; run `bash scripts/run-tests.sh` for P0 checks.

---

## Suggested queries for Copilot agents
- "Where do I change TTS metadata?" → `backend/src/services/abevoice-integration.ts`
- "How to add a telephony provider?" → implement `backend/src/services/telephony/providers/<name>.ts` and update factory
- "How are webhooks verified?" → `backend/src/routes/webhooks.ts` + `backend/src/utils/webhook-security.ts`

---

Key extras added in this PR:
- `.github/ai-flows.md` — canonical agent flows mapping and machine-readable snippets
- `.cursorrules` — repository-level agent rules for Copilot/Cursor/Claude automation
- `.github/workflows/voice-smoke.yml` — CI job to validate `scripts/demo-fallback.sh` against a mocked AbëVoice
- `scripts/mock/abevoice-mock.py` — simple mock server used by CI to simulate AbëVoice

If you'd like, I can now:
- Add a CI job that additionally runs a macOS runner to fully exercise playback paths, or
- Add more deterministic demo audio fixtures under `scripts/demo-audio/` for zero-latency demos.

Tell me which you prefer and I'll proceed. ✅
