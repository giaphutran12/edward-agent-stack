#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GSTACK_REPO="${GSTACK_REPO:-$HOME/.gstack/repos/gstack}"
UPSTREAM_URL="${UPSTREAM_URL:-https://github.com/garrytan/gstack.git}"
EXPECTED_ORIGIN_PATTERN="${EXPECTED_ORIGIN_PATTERN:-giaphutran12/codex-gstack}"
PUSH=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --repo)
      GSTACK_REPO="${2:?missing value for --repo}"
      shift 2
      ;;
    --upstream)
      UPSTREAM_URL="${2:?missing value for --upstream}"
      shift 2
      ;;
    --push)
      PUSH=1
      shift
      ;;
    --no-push)
      PUSH=0
      shift
      ;;
    -h|--help)
      cat <<'USAGE'
Usage: sync-upstream.sh [--repo PATH] [--upstream URL] [--push|--no-push]

Merge upstream GStack into Edward's codex-gstack fork, apply Codex overlay
patches, regenerate skills, verify, commit overlay changes, and optionally push.
USAGE
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [ ! -d "$GSTACK_REPO/.git" ]; then
  echo "ERROR: GStack repo not found: $GSTACK_REPO" >&2
  exit 1
fi

cd "$GSTACK_REPO"

current_branch="$(git branch --show-current)"
if [ "$current_branch" != "main" ]; then
  echo "ERROR: expected main branch, got $current_branch" >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: working tree is not clean. Commit/stash first." >&2
  git status --short
  exit 1
fi

origin_url="$(git remote get-url origin 2>/dev/null || true)"
if [ -z "$origin_url" ] || [[ "$origin_url" != *"$EXPECTED_ORIGIN_PATTERN"* ]]; then
  echo "ERROR: origin remote is not Edward's codex-gstack fork." >&2
  echo "Expected pattern: $EXPECTED_ORIGIN_PATTERN" >&2
  echo "Actual origin: ${origin_url:-missing}" >&2
  exit 1
fi

if ! git remote get-url upstream >/dev/null 2>&1; then
  echo "Adding upstream remote: $UPSTREAM_URL"
  git remote add upstream "$UPSTREAM_URL"
else
  upstream_url="$(git remote get-url upstream)"
  if [ "$upstream_url" != "$UPSTREAM_URL" ]; then
    echo "ERROR: upstream remote does not match expected GStack upstream." >&2
    echo "Expected: $UPSTREAM_URL" >&2
    echo "Actual: $upstream_url" >&2
    exit 1
  fi
fi

echo "Fetching origin"
git fetch origin

echo "Fetching upstream"
git fetch upstream

if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  echo "Repository is shallow; fetching full origin history before merge-base check"
  git fetch --unshallow origin || git fetch --deepen=100000 origin
fi

if ! git merge-base main upstream/main >/dev/null 2>&1; then
  echo "ERROR: no merge base between main and upstream/main." >&2
  echo "This usually means the local fork checkout is shallow/grafted or not a real fork clone." >&2
  echo "Do not reset or discard commits. Reclone giaphutran12/codex-gstack with full history, then rerun." >&2
  exit 1
fi

stamp="$(date +%Y%m%d-%H%M%S)"
backup="backup/main-before-upstream-sync-$stamp"
git branch "$backup" HEAD
echo "Backup branch: $backup"

echo "Merging upstream/main"
if ! git merge --no-ff upstream/main -m "Merge upstream gstack main"; then
  echo "ERROR: upstream merge has conflicts." >&2
  echo "Backup branch: $backup" >&2
  echo "Resolve conflicts, then run:" >&2
  echo "  git add <resolved-files>" >&2
  echo "  git commit" >&2
  echo "  $SCRIPT_DIR/apply-overlay.sh" >&2
  echo "  $SCRIPT_DIR/verify.sh" >&2
  exit 1
fi

"$SCRIPT_DIR/apply-overlay.sh"
"$SCRIPT_DIR/verify.sh"

if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "Apply Codex GStack overlay"
else
  echo "No overlay changes to commit"
fi

if [ "$PUSH" -eq 1 ]; then
  echo "Pushing origin main"
  git push origin main
else
  echo "Push skipped. Run with --push to update origin/main."
fi

echo "Done. Backup branch: $backup"
