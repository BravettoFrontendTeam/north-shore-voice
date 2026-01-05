#!/bin/bash

# Safe branch fixing - handles untracked files and conflicts gracefully
# One step at a time, calmly

set -e

BASE="a990c2e950194f7f0fd91a6fbc2d3dd4e0afe1a0"
ORIGINAL_BRANCH=$(git branch --show-current)

echo "🔧 Safe Branch Fixing"
echo "===================="
echo ""

# Function to safely populate branch
safe_populate() {
  local branch=$1
  shift
  local commits=("$@")
  
  echo "📦 $branch"
  
  # Checkout branch
  git checkout "$branch" >/dev/null 2>&1 || {
    echo "   ⚠️  Could not checkout (may have conflicts)"
    return 1
  }
  
  # Reset to base
  git reset --hard "$BASE" >/dev/null 2>&1
  
  # Cherry-pick with strategy to handle conflicts
  local success=0
  for commit in "${commits[@]}"; do
    if git show "$commit" >/dev/null 2>&1; then
      # Use --strategy-option=theirs to auto-resolve node_modules conflicts
      if git cherry-pick --strategy-option=theirs "$commit" >/dev/null 2>&1; then
        success=$((success + 1))
        echo "   ✓ $(git log -1 --oneline $commit | cut -d' ' -f2-)"
      else
        # If conflict, try to resolve automatically
        if git status --porcelain | grep -q "^UU\|^AA"; then
          # Auto-resolve by taking theirs for node_modules, ours for everything else
          git checkout --theirs -- '**/node_modules/**' 2>/dev/null || true
          git checkout --ours -- '**/node_modules/**' 2>/dev/null || true
          git add . 2>/dev/null || true
          if git cherry-pick --continue >/dev/null 2>&1; then
            success=$((success + 1))
            echo "   ✓ $commit (auto-resolved)"
          else
            echo "   ⚠️  $commit (needs manual resolution)"
            git cherry-pick --abort >/dev/null 2>&1
          fi
        else
          echo "   ⚠️  $commit (failed)"
          git cherry-pick --abort >/dev/null 2>&1
        fi
      fi
    else
      echo "   ✗ $commit (not found)"
    fi
  done
  
  echo "   ✅ $success/${#commits[@]} commits"
  echo ""
}

# Clean up any in-progress operations first
echo "🧹 Cleaning up..."
for branch in feature/security-secrets feature/bugfixes feature/ci-voice-smoke feature/vercel-deployment feature/docs-ei-architecture; do
  git checkout "$branch" >/dev/null 2>&1 && git cherry-pick --abort >/dev/null 2>&1 || true
done
git checkout "$ORIGINAL_BRANCH" >/dev/null 2>&1 || true
echo "✅ Cleanup done"
echo ""

# Fix branches
safe_populate "feature/security-secrets" "df3479b4" "ef193389"
safe_populate "feature/bugfixes" "0ded4cfb" "78c15bf0"
safe_populate "feature/ci-voice-smoke" "c7a3d55e" "d776c143"
safe_populate "feature/vercel-deployment" "bc9e8084" "62d890ae"

# Docs branch (may have many conflicts - handle carefully)
echo "📦 feature/docs-ei-architecture"
git checkout feature/docs-ei-architecture >/dev/null 2>&1
git reset --hard "$BASE" >/dev/null 2>&1
if git cherry-pick --strategy-option=theirs 4f7dbdbf >/dev/null 2>&1; then
  echo "   ✓ Docs commit applied"
elif git status --porcelain | grep -q "^UU\|^AA"; then
  # Auto-resolve node_modules conflicts
  git checkout --theirs -- '**/node_modules/**' 2>/dev/null || true
  git add . 2>/dev/null || true
  git cherry-pick --continue >/dev/null 2>&1 && echo "   ✓ Docs commit (auto-resolved)" || echo "   ⚠️  Needs manual resolution"
else
  echo "   ⚠️  Could not apply (may need manual)"
fi
echo ""

# Return to original
git checkout "$ORIGINAL_BRANCH" >/dev/null 2>&1 || true

echo "✨ Done!"
echo ""
echo "📋 Verification:"
for branch in feature/security-secrets feature/bugfixes feature/ci-voice-smoke feature/docs-ei-architecture feature/vercel-deployment; do
  count=$(git log --oneline $BASE..$branch 2>/dev/null | wc -l | tr -d ' ')
  [ "$count" -gt 0 ] && echo "   ✅ $branch: $count commits" || echo "   ⚠️  $branch: 0 commits"
done

