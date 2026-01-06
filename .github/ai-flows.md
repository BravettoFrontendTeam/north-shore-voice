# AI Flows & Agent Playbook — North Shore

Purpose: provide a single, actionable reference that maps agent inputs → code paths → expected outputs, and documents rules agents must follow when changing voice/telephony flows. This file is **the** canonical place Copilot/agents should consult before making code changes.

## Quick summary
- Trigger types: inbound call webhook, outbound call schedule, admin voice training, demo UI TTS request.
- Primary code paths: `backend/src/routes/webhooks.ts` → `call-handler` / `inbound-call.service` → `abevoice-integration.ts` → `telephony` service to play audio. Frontend demo calls `frontend/src/services/abevoice-api.ts` → backend `/api/voice`.
- Tests & smoke: `backend/tests/abevoice.emotion.test.ts`, `scripts/run-voice-smoke.sh`, `scripts/demo-fallback.sh`.

---

## High-level agent flows (textual)

1) Inbound call (de-escalation):
   - Trigger: vendor webhook POST `/api/webhooks/call/incoming` (raw body required)
   - Route: `backend/src/routes/webhooks.ts` → validates signature (`webhook-security.ts`) → `call-handler` → determine appraisal → generate TTS via `abevoice-integration.ts` (include metadata) → choose telephony provider and play audio.
   - Expected outputs: call event logged, TTS emission with metadata (emotion,intensity,pacing), provider action initiated.

2) Demo UI TTS: 
   - Flow: Frontend: `frontend/src/pages/Demo.tsx` → `frontend/src/services/abevoice-api.ts` → POST `/api/voice/generate` → backend `abevoice-integration` → return `audio_base64` and `metadata`
   - Fallback: `scripts/demo-fallback.sh` uses cached audio or macOS `say` when AbëVoice is down.

3) Outbound call orchestration:
   - Flow: `backend/src/routes/outbound.ts` → `outbound-call.service.ts` → provider selection in telephony service (priority/cost) → scheduling & callbacks.

4) Admin voice training / empathy tuning:
   - Flow: `frontend/src/pages/AdminEmpathy.tsx` → admin endpoints under `backend/src/routes/admin.ts` → training artifacts saved and metrics persisted via DB.

---

## Actionable rules & conventions for agents
- AbëVoice metadata: every generated emission returned by `abevoice-integration.ts` must include `metadata` with keys: `emotion` (string), `intensity` (1-10), `pacing` (slow|normal|fast), `voice_style`, and `directive` (string). Unit tests must assert these fields.
- Webhook raw body: **do not change** `express.raw({ type: 'application/json' })` or signature verification breaks.
- Return shapes: many service functions return `{ success: boolean, ... }` for expected failures. Match existing patterns.
- Secrets: never log secrets or commit API keys. Use `scripts/setup-vercel-env.sh` and `.env*` files for local testing.
- PR requirement (voice-affecting PRs): include an "Appraisal" short summary, list of "Primary vulnerabilities" (from `AGENT_PROMPT.md`), tests added, and smoke-check instructions.

---

## Machine-readable flow snippets (examples agents can use to auto-infer changes)

Example webhook handling path (JSON):
```json
{
  "trigger": "webhook:call:incoming",
  "route": "backend/src/routes/webhooks.ts",
  "validator": "backend/src/utils/webhook-security.ts",
  "handler": "backend/src/services/call-handler.ts",
  "tts": "backend/src/services/abevoice-integration.ts",
  "telephony": "backend/src/services/telephony/index.ts"
}
```

Example TTS emission schema (JSON Schema-ish):
```json
{
  "type": "object",
  "required": ["emotion","intensity","pacing","voice_style","directive"],
  "properties": {
    "emotion": { "type": "string" },
    "intensity": { "type": "integer", "minimum": 1, "maximum": 10 },
    "pacing": { "type": "string", "enum": ["slow","normal","fast"] },
    "voice_style": { "type": "string" },
    "directive": { "type": "string" }
  }
}
```

---

## Cursor & agent rule mapping
- Agent behavior rules live in `AGENT_PROMPT.md` (appraisal-first, vulnerabilities, tone selection). Agents must consult that file for any voice generation change.
- A repository-level agent rule file exists: `.cursorrules` — follow it as the authoritative list for automation safety & PR expectations.
- If other agent rule files are present (e.g., `.windsurfrules`), respect their priority; when absent, `.cursorrules` is the primary source of agent rules.

---

## Suggested automated checks for PRs (agents should add these)
- Unit test: `backend/tests/abevoice.emotion.test.ts` asserts emission metadata presence and valid ranges
- Smoke test: run `scripts/run-voice-smoke.sh` or `scripts/demo-fallback.sh` (mock health endpoint in CI)
- Lint & typecheck: `npm run check` in root
- DB migrations: if `prisma/schema.prisma` changed, run `npx prisma migrate dev` and include migration files

---

## Example tasks agents can perform automatically
- Add missing metadata assertions to tests and create a small failing test if missing.
- Add a CI workflow that starts a minimal mocked AbëVoice health & API endpoint and runs `scripts/demo-fallback.sh`.
- Auto-fill PR template fields for voice PRs (Appraisal, Vulnerabilities, Chosen Tone & Why) from a short generated summary.

---

## Where agents should NOT act without human review
- Deploy scripts & production environment variable changes
- Signature verification logic for webhook security
- Changes that materially change voice behavior impacting P0 flows without manual QA

---

If this looks good I will: 1) add a CI job to validate `scripts/demo-fallback.sh` against a mocked AbëVoice endpoint, 2) add a test assertion (if missing) to `backend/tests/abevoice.emotion.test.ts`, and 3) add a concise PR template snippet for voice-affecting changes. Please confirm which of those you'd like next.