#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GSTACK_DIR="${GSTACK_DIR:-$HOME/.gstack/repos/gstack}"
CODEX_GSTACK_RUNTIME="${CODEX_GSTACK_RUNTIME:-$HOME/.codex/skills/gstack}"

fail=0
check() {
  if "$@" >/tmp/edward-agent-stack-check.out 2>/tmp/edward-agent-stack-check.err; then
    printf 'OK   %s\n' "$*"
  else
    printf 'FAIL %s\n' "$*"
    fail=1
  fi
}

printf 'Edward Agent Stack verify\n'

check test -f "$ROOT/AGENTS.md"
check test -f "$ROOT/skills/edward-rules/SKILL.md"
check test -f "$ROOT/skills/edward-decision-capture/SKILL.md"
check test -f "$ROOT/skills/edward-escalation/SKILL.md"
check test -f "$ROOT/skills/edward-project-notes/SKILL.md"
check test -f "$ROOT/projects/_template/PROJECT.md"
check test -f "$ROOT/projects/_template/decisions/_template.md"
check test -x "$ROOT/scripts/install.sh"
check test -x "$ROOT/scripts/update.sh"
check test -x "$ROOT/scripts/repowise-update.sh"

check command -v git
check command -v codex
check command -v gh
check command -v rg
check command -v jq
check command -v tmux
check command -v bun
check command -v node
check command -v npm
check command -v python3
check command -v pip3
check command -v uv
check command -v docker
check command -v ffmpeg
check command -v supabase
check command -v vercel
check command -v claude
check command -v nia

if [ -d "$GSTACK_DIR/.git" ]; then
  printf 'OK   gstack dir exists: %s\n' "$GSTACK_DIR"
  if git -C "$GSTACK_DIR" remote -v | grep -q 'giaphutran12/codex-gstack'; then
    printf 'OK   gstack remote is giaphutran12/codex-gstack\n'
  else
    printf 'FAIL gstack remote is not giaphutran12/codex-gstack\n'
    fail=1
  fi
fi

if [ -f "$CODEX_GSTACK_RUNTIME/SKILL.md" ]; then
  printf 'OK   Codex gstack runtime exists: %s\n' "$CODEX_GSTACK_RUNTIME"
else
  printf 'FAIL Codex gstack runtime missing: %s\n' "$CODEX_GSTACK_RUNTIME"
  fail=1
fi

if [ -f "$HOME/.codex/skills/edward-rules/SKILL.md" ]; then
  printf 'OK   Edward parent skill installed: %s\n' "$HOME/.codex/skills/edward-rules"
else
  printf 'WARN Edward parent skill not installed yet. Run ./scripts/install.sh\n'
fi

if command -v repowise >/dev/null 2>&1; then
  printf 'OK   repowise installed: %s\n' "$(repowise --version 2>/dev/null || echo unknown)"
else
  printf 'WARN repowise not installed\n'
fi

if [ "$fail" -ne 0 ]; then
  printf 'Verify failed.\n'
  exit 1
fi

printf 'Verify passed.\n'
