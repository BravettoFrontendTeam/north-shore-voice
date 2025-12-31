# Backend quick notes

## Validating secrets 🔒

A small convenience script validates that critical environment variables required to run the backend are present:

- Run: `npm run validate-secrets`
- It checks critical variables (`JWT_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`) and reports optional ones (`ABEVOICE_API_KEY`, `ELEVENLABS_API_KEY`).

Tips

- For local development, add these to `backend/.env` (do not commit secrets to the repo).
- Example `backend/.env` (local only):

```
JWT_SECRET=your-very-long-secret
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
ABEVOICE_API_KEY=your-abevoice-api-key   # optional
```

That's it — the validator is intentionally conservative so the repo remains simple and runnable for local dev where possible.
