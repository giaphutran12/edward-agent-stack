#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GSTACK_REPO="${GSTACK_REPO:-https://github.com/giaphutran12/codex-gstack.git}"
GSTACK_DIR="${GSTACK_DIR:-$HOME/.gstack/repos/gstack}"

log() { printf '%s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

log "Installing Edward Agent Stack"

if ! have git; then
  log "ERROR: git is required."
  exit 1
fi

mkdir -p "$(dirname "$GSTACK_DIR")" "$HOME/.codex/skills"

if [ -d "$GSTACK_DIR/.git" ]; then
  log "Updating gstack fork at $GSTACK_DIR"
  git -C "$GSTACK_DIR" fetch origin
  git -C "$GSTACK_DIR" reset --hard origin/main
else
  if [ -e "$GSTACK_DIR" ]; then
    backup="$GSTACK_DIR.bak.$(date +%Y%m%d%H%M%S)"
    log "Backing up existing non-git gstack dir to $backup"
    mv "$GSTACK_DIR" "$backup"
  fi
  log "Cloning $GSTACK_REPO"
  git clone --single-branch --depth 1 "$GSTACK_REPO" "$GSTACK_DIR"
fi

if [ -x "$GSTACK_DIR/setup" ]; then
  (cd "$GSTACK_DIR" && ./setup --host codex)
else
  log "ERROR: $GSTACK_DIR/setup not found or not executable."
  exit 1
fi

mkdir -p "$ROOT/dist"
cat > "$ROOT/dist/user-scope-AGENTS-snippet.md" <<'SNIPPET'
## Edward Agent Stack

At the start of coding tasks, load Edward Agent Stack rules:
- ~/edward-agent-stack/edward-rules/README.md
- the current project's PROJECT.md when present
- recent relevant decision notes under decisions/
- AGENTS.local.md when present

Before opening a PR or ending a meaningful task, run decision capture:
read the conversation and diff, update Project Notes or Decision Notes if Edward made a reusable decision or project context changed, and cross-link related notes. If no update is needed, say "No note update needed" and why.
SNIPPET

log "Wrote suggested user-scope snippet: $ROOT/dist/user-scope-AGENTS-snippet.md"

if have repowise; then
  log "Repowise found: $(repowise --version 2>/dev/null || echo installed)"
else
  log "Repowise not found. Install separately if this machine needs repo intelligence."
fi

log "Install complete. Run ./scripts/verify.sh"
