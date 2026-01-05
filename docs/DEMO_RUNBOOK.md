# Demo Runbook — Owner & Failure Modes

Purpose: give a concise, human- and AI-friendly runbook to run the full demo, understand failure patterns, and know when the human must act.

Quick one-liner (directory-agnostic)

```bash
sh -c 'REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo "/Users/michaelmataluni/Desktop/North Shore Phani/north-shore")"; bash "$REPO_ROOT/run-demo.sh" --frontend-port 3001 --skip-env-check --skip-external'
```

What to watch for (fast checks)
- "Frontend is up" — frontend dev server reachable. Wait for it before continuing.
- "Full Demo Test completed successfully" — success indicator.
- Logs: `logs/demo-test-*.log` — attach these if filing an issue.

Owner responsibilities (human)
- Terminal control: the human running the demo owns the terminal and makes decisions (e.g., freeing ports, providing secrets, confirming a `kill` of a stray process).
- Confirm destructive actions before they run (explicit `kill <PID>` or `kill -9 <PID>`).
- Supply secrets in a secure store (Vercel/OS env) — never paste secrets in PRs.

Common failure modes & simple remedies
- Port conflict (frontend or backend):
  - Inspect: `lsof -iTCP:3001 -sTCP:LISTEN -P -n`
  - Confirm process: `ps -p <PID> -o pid,uid,user,command`
  - If you own it, stop: `kill <PID>`; verify `lsof` shows no listener.
  - Retry with alternate port: `--frontend-port 3002`.
- Missing env vars (AbëVoice / ElevenLabs): set keys via `export ABEVOICE_API_KEY=...` or use Vercel envs; rerun the demo.
- AbëVoice API errors: run admin test: `curl -X POST http://127.0.0.1:5050/api/admin/abekeys/test -d '{"facilityId":"default"}'` and inspect `status.abevoice` and `sample_base64`.
- Jest not exiting: restart tests, collect logs, and report to the team (we added guards to avoid interval leaks; provide reproduction steps).

What AI should do automatically (when running in co-create mode)
- Provide the one-line command and highlight the expected final output and logs path.
- When a port conflict is detected, propose two options: (1) suggest an alternate port and re-run, or (2) propose a safe sequence to inspect and kill the process (always ask for explicit user confirmation before issuing `kill`).
- When a fatal external API error occurs, collect the last 200 lines of the demo log and the failing HTTP request/response, and present them to the human as a concise incident summary.

Incident report template (copy/paste)
- Summary: one-sentence summary of failure
- Command run: (exact command used)
- Last 50 lines of `logs/demo-test-*.log`
- Steps attempted: (e.g., killed PID 50796, re-ran demo)
- Ownership: who executed (name/handle) and whether any destructive actions were taken

If you want, I can add a small PR that adds `docs/DEMO_RUNBOOK.md` to the repo and a short README pointer (I’ve already added the README snippet). Would you like me to open that PR now?