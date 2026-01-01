#!/usr/bin/env bash
set -euo pipefail

# Run All Tests
# Works from ANY directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT/backend"

echo "🧪 Running All Tests..."
echo "📁 Backend directory: $(pwd)"
echo ""

npm test

