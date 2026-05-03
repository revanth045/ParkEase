#!/bin/sh
# Installs the post-commit hook that auto-pushes to GitHub on every commit.
# Called automatically by root postinstall (pnpm install) and post-merge.sh.
set -e

HOOKS_DIR="$(git rev-parse --git-dir)/hooks"
mkdir -p "$HOOKS_DIR"
HOOK="$HOOKS_DIR/post-commit"

cat > "$HOOK" << 'HOOK_BODY'
#!/bin/sh
# Auto-syncs every commit to GitHub in the background.
if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_REPO_URL" ]; then
  echo "[github-sync] Skipping — GITHUB_TOKEN or GITHUB_REPO_URL not set."
  exit 0
fi
(
  REPO_URL_WITH_TOKEN=$(echo "$GITHUB_REPO_URL" | sed "s|https://|https://$GITHUB_TOKEN@|")
  git remote set-url github "$REPO_URL_WITH_TOKEN" 2>/dev/null \
    || git remote add github "$REPO_URL_WITH_TOKEN" 2>/dev/null
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  git push github "$BRANCH" --follow-tags --quiet 2>&1 \
    | sed 's/^/[github-sync] /'
) &
HOOK_BODY

chmod +x "$HOOK"
echo "[github-sync] post-commit hook installed at $HOOK"
