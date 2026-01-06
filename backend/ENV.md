# Environment Variables — Backend (Quick Reference) ⚙️

This file lists important environment variables used by the backend and quick examples for local testing / CI.

> Place a `.env` file in `backend/` for local development (loaded by `dotenv` in `backend/src/index.ts`). Do NOT commit secrets.

## Core service settings

- ABEVOICE_API_URL — AbëVoice base URL (default: `http://localhost:8000`)
  - Example: `export ABEVOICE_API_URL=http://127.0.0.1:8000`
- ABEVOICE_API_KEY — AbëVoice API key (optional for local mock)

- ELEVENLABS_API_KEY — (optional) ElevenLabs API key for provider override
- ELEVENLABS_API_URL — optional custom base URL for ElevenLabs

## Auth & sessions

- JWT_SECRET — **required in production** (validated by P0 checks)
- JWT_EXPIRES_IN — token TTL (default: `7d`)
- SESSION_SECRET — session cookie secret (don't use dev default in prod)

## Telephony provider credentials (examples, set the ones you use)

- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
- TELNYX_API_KEY
- PLIVO_AUTH_ID, PLIVO_AUTH_TOKEN
- SIGNALWIRE_PROJECT_ID, SIGNALWIRE_AUTH_TOKEN, SIGNALWIRE_SPACE_URL
- DEFAULT_FROM_NUMBER — default from/to phone number used in telephony routes
- WEBHOOK_BASE_URL — public URL used to configure provider webhooks

## Webhook & third-party secrets

- STRIPE_WEBHOOK_SECRET — used when Stripe webhook verification is required
- Other provider-specific webhook secrets (check `backend/src/routes/webhooks.ts`)

## DB & deployment

- DATABASE_URL — Postgres connection string for Prisma
- AWS_SECRETS_ENABLED — `true` to enable AWS secrets loader in `admin-storage` (optional)
- BACKEND_PORT / BACKEND_HOST — runtime port/host overrides (defaults: `5000` / `127.0.0.1`)

## Test / CI notes

- Many tests set process.env values in test files (see `backend/tests/*`) — follow that pattern for transient overrides.
- For voice smoke tests, CI runs a local AbëVoice mock and sets `ABEVOICE_API_URL=http://127.0.0.1:8000` (see `.github/workflows/voice-smoke.yml`).
- `scripts/validate-p0-fixes.sh` checks for production-critical env usage (e.g., presence of `JWT_SECRET` in production).

## Quick usage examples

Local (temporary):

```bash
# start with local env values
cd backend
export ABEVOICE_API_URL=http://localhost:8000
export JWT_SECRET="a-very-secure-secret-which-is-64-chars-long..."
npm run dev
```

CI (example step):

```yaml
- name: Run demo fallback smoke
  env:
    ABEVOICE_API_URL: http://127.0.0.1:8000
  run: |
    chmod +x scripts/demo-fallback.sh
    ./scripts/demo-fallback.sh "CI smoke test" "abe"
```

---

If you want, I can extend this with a short `backend/.env.example` file containing non-sensitive defaults. Want me to add that next? ✅
