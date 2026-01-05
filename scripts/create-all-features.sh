#!/bin/bash

# Create all atomic feature branches from Michael's contributions
# Simple, reliable approach

set -e

BASE_COMMIT="a990c2e950194f7f0fd91a6fbc2d3dd4e0afe1a0"
ORIGINAL_BRANCH=$(git branch --show-current)

echo "🚀 Creating atomic feature branches..."
echo "Base: $BASE_COMMIT"
echo ""

# Create each feature branch
create_branch() {
  local name=$1
  shift
  local commits=("$@")
  
  echo "📦 $name"
  
  # Delete if exists
  git branch -D "$name" 2>/dev/null || true
  
  # Create from base
  git checkout -b "$name" "$BASE_COMMIT" >/dev/null 2>&1
  
  # Cherry-pick commits
  for commit in "${commits[@]}"; do
    if git show "$commit" >/dev/null 2>&1; then
      git cherry-pick "$commit" >/dev/null 2>&1 && echo "   ✓ $commit" || echo "   ✗ $commit (skipped)"
    fi
  done
  
  echo ""
}

# Feature 1: Code Formatting
create_branch "feature/code-formatting" "b04c642a" "04505b58"

# Feature 2: Husky Pre-commit
create_branch "feature/husky-pre-commit" "20ee07a4" "c517f665" "cb8ec406" "0d49a156"

# Feature 3: Launch Preparation
create_branch "feature/launch-preparation" "c1af17ce"

# Feature 4: Vercel Deployment
create_branch "feature/vercel-deployment" "bc9e8084" "62d890ae"

# Feature 5: Security & Secrets
create_branch "feature/security-secrets" "df3479b4" "ef193389"

# Feature 6: CI Voice Smoke
create_branch "feature/ci-voice-smoke" "c7a3d55e" "d776c143"

# Feature 7: Bug Fixes
create_branch "feature/bugfixes" "0ded4cfb" "78c15bf0"

# Feature 8: Docs EI Architecture
create_branch "feature/docs-ei-architecture" "4f7dbdbf"

# Return to original
git checkout "$ORIGINAL_BRANCH" >/dev/null 2>&1

echo "✨ Done! Created feature branches:"
git branch | grep "feature/" | sed 's/^/   /'
echo ""
echo "Push with: git push origin --all"

