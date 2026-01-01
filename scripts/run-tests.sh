#!/usr/bin/env bash
set -euo pipefail

# Run P0 Launch Fixes Tests
# Works from ANY directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT/backend"

echo "🧪 Running P0 Launch Fixes Tests..."
echo "📁 Backend directory: $(pwd)"
echo ""

npm test -- p0-launch-fixes.test.ts

