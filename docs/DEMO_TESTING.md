# Demo Testing Guide

This doc explains the simplest way to run a full demo test locally for a pre-deploy verification.

Quick one-liner

```bash
# from the project root
bash scripts/run-demo-test.sh
```

What this does

- Runs `scripts/check-env.sh` (environment variable checks)
- Runs `scripts/validate-p0-fixes.sh` (quick validation of P0 changes)
- Runs `scripts/run-all-tests.sh` (unit tests)
- Runs `scripts/run-voice-smoke.sh` (voice-related smoke tests)
- Runs `scripts/run-elevenlabs-smoke.sh` (only if `ELEVENLABS_API_KEY` is set)
- Runs `scripts/smoke-check.sh` (starts dev servers and validates endpoints)
- Generates demo audio via `scripts/generate-demo-audio.sh` (non-fatal)

Flags

- `--skip-env-check` — skip the env var validation step (useful for local runs)
- `--skip-external` — skip external-provider tests (ElevenLabs)

Common troubleshooting

- If `scripts/check-env.sh` fails: export required environment variables (see the script for instructions).
- If ElevenLabs tests fail: set `ELEVENLABS_API_KEY` in your environment or run with `--skip-external`.
- If `smoke-check.sh` fails: ensure ports 5050 (backend) and 3000 (frontend) are free or set `BACKEND_PORT`/`FRONTEND_PORT` environment variables.

Tips

- Run `bash scripts/run-demo-test.sh | tee demo-test.log` to capture output.
- For CI usage, set necessary secrets and run the script in a clean environment.

Contact

If anything is unclear or you want a CI job that runs this automatically, open an issue or ask for it in the repo.
