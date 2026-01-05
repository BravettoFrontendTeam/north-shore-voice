#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT/backend"

echo "🧪 Running ElevenLabs provider smoke test..."

npm test -- elevenlabs.provider.test.ts

echo "✅ ElevenLabs smoke test complete"
