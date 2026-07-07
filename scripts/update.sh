#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GSTACK_DIR="${GSTACK_DIR:-$HOME/.gstack/repos/gstack}"

log() { printf '%s\n' "$*"; }

log "Updating Edward Agent Stack"

if git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  old_stack="$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  stack_branch="$(git -C "$ROOT" branch --show-current 2>/dev/null || true)"
  git -C "$ROOT" fetch origin main || true
  if [ -n "$(git -C "$ROOT" status --porcelain)" ]; then
    log "WARN: Edward stack has local changes. Skipping auto-update to avoid overwriting work."
  elif [ "$stack_branch" != "main" ]; then
    log "WARN: Edward stack is on branch ${stack_branch:-unknown}. Skipping auto-update."
  elif git -C "$ROOT" rev-parse --verify origin/main >/dev/null 2>&1; then
    if ! git -C "$ROOT" merge --ff-only origin/main; then
      log "WARN: Edward stack could not fast-forward. Keeping existing checkout."
    fi
  fi
  new_stack="$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  log "Edward stack: $old_stack -> $new_stack"
fi

if [ -d "$GSTACK_DIR/.git" ]; then
  old_gstack="$(git -C "$GSTACK_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  # codex-gstack is frozen at tag frozen-v1: fast-forward from Edward's fork
  # origin only. Never sync upstream garrytan/gstack.
  current_branch="$(git -C "$GSTACK_DIR" branch --show-current 2>/dev/null || true)"
  if [ -n "$(git -C "$GSTACK_DIR" status --porcelain)" ]; then
    log "WARN: gstack dir has local changes. Skipping auto-update to avoid overwriting work."
  elif [ "$current_branch" != "main" ]; then
    log "WARN: gstack dir is on branch ${current_branch:-unknown}. Skipping auto-update."
  else
    git -C "$GSTACK_DIR" fetch origin main
    git -C "$GSTACK_DIR" merge --ff-only origin/main || log "WARN: codex-gstack could not fast-forward."
    (cd "$GSTACK_DIR" && ./setup --host codex)
  fi
  new_gstack="$(git -C "$GSTACK_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  log "codex-gstack: $old_gstack -> $new_gstack"
else
  log "gstack not installed at $GSTACK_DIR. Run ./scripts/install.sh"
fi

"$ROOT/scripts/verify.sh"
