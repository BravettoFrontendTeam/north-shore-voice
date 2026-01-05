#!/usr/bin/env bash
set -euo pipefail

# Run full demo test for local verification and pre-deploy smoke checks
# Usage: bash scripts/run-demo-test.sh [--skip-env-check] [--skip-external]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT"

# Ensure logs directory exists and set a timestamped logfile for persistent records
mkdir -p "$PROJECT_ROOT/logs"
LOGFILE="$PROJECT_ROOT/logs/demo-test-$(date +%Y%m%dT%H%M%S).log"
# Capture all output (stdout+stderr) to the logfile while also echoing to console
exec > >(tee -a "$LOGFILE") 2>&1

echo "Logging demo test output to: $LOGFILE"

# Export FRONTEND_PORT so subscripts can read it
export FRONTEND_PORT

SKIP_ENV_CHECK=0
SKIP_EXTERNAL=0
# Default frontend port (can be overridden by env or CLI)
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

# Parse CLI args (supports --skip-env-check, --skip-external, --frontend-port <port>)
while (( "$#" )); do
  case "$1" in
    --skip-env-check)
      SKIP_ENV_CHECK=1
      shift
      ;;
    --skip-external)
      SKIP_EXTERNAL=1
      shift
      ;;
    --frontend-port)
      if [ -n "${2-}" ] && [[ "${2-}" != --* ]]; then
        FRONTEND_PORT="$2"
        shift 2
      else
        echo "Error: --frontend-port requires a value"
        exit 2
      fi
      ;;
    *)
      echo "Unknown arg: $1"
      shift
      ;;
  esac
done


echo "🔬 Running Full Demo Test"
echo "Project: $PROJECT_ROOT"
echo "Skip env check: $SKIP_ENV_CHECK"
echo "Skip external tests: $SKIP_EXTERNAL"
echo ""

# 1) Environment check (non-fatal)
if [ "$SKIP_ENV_CHECK" -eq 0 ]; then
  echo "Step 1: Checking environment variables (scripts/check-env.sh)"
  if ! bash "$PROJECT_ROOT/scripts/check-env.sh"; then
    echo "⚠️  Environment check failed. You can export required variables or re-run with --skip-env-check to continue anyway."
    echo "Proceeding, but some tests may fail due to missing env vars."
  else
    echo "✅ Environment OK"
  fi
else
  echo "Skipping environment check"
fi

echo ""

# Helper to run a script and capture status
run_and_record() {
  local name="$1"; shift
  local cmd=("$@")
  echo "---" 
  echo "Running: $name"
  if "${cmd[@]}"; then
    echo "✅ $name succeeded"
    return 0
  else
    echo "❌ $name failed"
    return 1
  fi
}

# 2) P0 validation - should be quick and deterministic
echo "Step 2: Validating P0 launch fixes (scripts/validate-p0-fixes.sh)"
if ! bash "$PROJECT_ROOT/scripts/validate-p0-fixes.sh"; then
  echo "❌ P0 validation failed -- aborting demo test"
  exit 1
fi

# 3) Run unit tests
echo "Step 3: Running unit tests (scripts/run-all-tests.sh)"
if ! bash "$PROJECT_ROOT/scripts/run-all-tests.sh"; then
  echo "❌ Unit tests failed -- aborting demo test"
  exit 1
fi

# 4) Voice smoke tests (local, limited)
echo "Step 4: Running voice smoke tests"
if ! bash "$PROJECT_ROOT/scripts/run-voice-smoke.sh"; then
  echo "⚠️  Voice smoke tests failed (non-fatal). See output above for details."
fi

# 5) ElevenLabs smoke only if key present and not skipped
if [ "$SKIP_EXTERNAL" -eq 0 ] && [ -n "${ELEVENLABS_API_KEY:-}" ]; then
  echo "Step 5: Running ElevenLabs smoke test"
  if ! bash "$PROJECT_ROOT/scripts/run-elevenlabs-smoke.sh"; then
    echo "⚠️  ElevenLabs smoke failed (non-fatal). Check ELEVENLABS_API_KEY and network access."
  fi
else
  echo "Skipping ElevenLabs smoke (no ELEVENLABS_API_KEY set or --skip-external)"
fi

# 6) Smoke check: start dev servers and run quick end-to-end checks
echo "Step 6: Running smoke-check (starts dev servers, tests endpoints)"
if ! bash "$PROJECT_ROOT/scripts/smoke-check.sh"; then
  echo "❌ Smoke check failed -- aborting demo test"
  exit 1
fi

# 7) Generate demo audio artifacts (non-fatal)
echo "Step 7: Generating demo audio (scripts/generate-demo-audio.sh)"
if ! bash "$PROJECT_ROOT/scripts/generate-demo-audio.sh"; then
  echo "⚠️  Demo audio generation failed (non-fatal)."
else
  echo "✅ Demo audio generated under scripts/demo-audio/"
fi

# Summary
echo ""
echo "🎉 Full Demo Test completed successfully"
echo "Next steps: (if any failures above) review the specific failing step and re-run the script with appropriate env vars set."

echo "Usage notes:"
echo "  - To skip environment checks:    bash scripts/run-demo-test.sh --skip-env-check"
echo "  - To skip external provider tests: bash scripts/run-demo-test.sh --skip-external"

echo "Exiting with success"
exit 0
