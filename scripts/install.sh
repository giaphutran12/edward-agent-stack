#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GSTACK_REPO="${GSTACK_REPO:-https://github.com/giaphutran12/codex-gstack.git}"
GSTACK_DIR="${GSTACK_DIR:-$HOME/.gstack/repos/gstack}"
CAVEMAN_REPO="${CAVEMAN_REPO:-JuliusBrussee/caveman}"

log() { printf '%s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

log "Installing Edward Agent Stack"

if ! have git; then
  log "ERROR: git is required."
  exit 1
fi

mkdir -p "$(dirname "$GSTACK_DIR")" "$HOME/.codex/skills"

"$ROOT/scripts/install-tools.sh" || log "WARN: core CLI bootstrap had warnings."
"$ROOT/scripts/setup-mcp.sh" || log "WARN: MCP setup had warnings."

if [ -d "$GSTACK_DIR/.git" ]; then
  log "Updating gstack fork at $GSTACK_DIR"
  current_branch="$(git -C "$GSTACK_DIR" branch --show-current 2>/dev/null || true)"
  if [ -n "$(git -C "$GSTACK_DIR" status --porcelain)" ]; then
    log "WARN: gstack dir has local changes. Skipping auto-update to avoid overwriting work."
  elif [ "$current_branch" != "main" ]; then
    log "WARN: gstack dir is on branch ${current_branch:-unknown}. Skipping auto-update."
  else
    git -C "$GSTACK_DIR" fetch origin main
    if ! git -C "$GSTACK_DIR" merge --ff-only origin/main; then
      log "WARN: gstack could not fast-forward. Keeping existing checkout."
    fi
  fi
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

if have npx; then
  log "Installing caveman skill for Codex"
  npx --yes skills add "$CAVEMAN_REPO" --agent codex --skill caveman --global --yes
else
  log "WARN: npx not found. Install caveman manually: npx --yes skills add $CAVEMAN_REPO --agent codex --skill caveman --global --yes"
fi

log "Installing Edward skills into Codex"
for skill_dir in "$ROOT"/skills/*; do
  [ -f "$skill_dir/SKILL.md" ] || continue
  skill_name="$(basename "$skill_dir")"
  target="$HOME/.codex/skills/$skill_name"
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    backup="$target.bak.$(date +%Y%m%d%H%M%S)"
    log "Backing up existing skill $target to $backup"
    mv "$target" "$backup"
  fi
  ln -snf "$skill_dir" "$target"
  log "  linked $skill_name"
done

mkdir -p "$ROOT/dist"
cat > "$ROOT/dist/user-scope-AGENTS-snippet.md" <<'SNIPPET'
## Edward Agent Stack

At the start of coding tasks, load Edward Agent Stack rules:
- /caveman ultra for terse token-saving communication
- $edward-rules from ~/edward-agent-stack/skills/edward-rules/SKILL.md
- the current project's PROJECT.md when present
- recent relevant decision notes under decisions/
- AGENTS.local.md when present

Use normal wording for security warnings, destructive operations, or anything where caveman brevity could cause confusion.

If the host cannot discover skills, use ~/edward-agent-stack/agents/AGENTS.md as the fallback skill index.

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
