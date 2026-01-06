#!/usr/bin/env bash
set -euo pipefail

# Run voice-specific smoke tests
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT/backend"

echo "🧪 Running AbeVoice emotion metadata smoke tests..."

npm test -- abevoice.emotion.test.ts

echo "✅ Voice smoke tests complete"
