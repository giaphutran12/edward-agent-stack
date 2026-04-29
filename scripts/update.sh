#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GSTACK_DIR="${GSTACK_DIR:-$HOME/.gstack/repos/gstack}"

log() { printf '%s\n' "$*"; }

log "Updating Edward Agent Stack"

if git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  old_stack="$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  git -C "$ROOT" fetch origin || true
  if git -C "$ROOT" rev-parse --verify origin/main >/dev/null 2>&1; then
    git -C "$ROOT" reset --hard origin/main
  fi
  new_stack="$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  log "Edward stack: $old_stack -> $new_stack"
fi

if [ -d "$GSTACK_DIR/.git" ]; then
  old_gstack="$(git -C "$GSTACK_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  git -C "$GSTACK_DIR" fetch origin
  git -C "$GSTACK_DIR" reset --hard origin/main
  (cd "$GSTACK_DIR" && ./setup --host codex)
  new_gstack="$(git -C "$GSTACK_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  log "codex-gstack: $old_gstack -> $new_gstack"
else
  log "gstack not installed at $GSTACK_DIR. Run ./scripts/install.sh"
fi

"$ROOT/scripts/verify.sh"
