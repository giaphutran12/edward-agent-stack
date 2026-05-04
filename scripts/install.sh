#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GSTACK_REPO="${GSTACK_REPO:-https://github.com/giaphutran12/codex-gstack.git}"
GSTACK_DIR="${GSTACK_DIR:-$HOME/.gstack/repos/gstack}"
CAVEMAN_REPO="${CAVEMAN_REPO:-JuliusBrussee/caveman}"

log() { printf '%s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }
load_homebrew_path() {
  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -x /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
}

log "Installing Edward Agent Stack"

if [ "${EDWARD_STACK_SKIP_MACOS_BOOTSTRAP:-0}" = "1" ]; then
  log "Skipping macOS bootstrap because EDWARD_STACK_SKIP_MACOS_BOOTSTRAP=1."
elif [ "$(uname -s)" = "Darwin" ] && [ -x "$ROOT/scripts/bootstrap-macos.sh" ]; then
  "$ROOT/scripts/bootstrap-macos.sh" || log "WARN: macOS bootstrap had warnings."
  load_homebrew_path
fi

mkdir -p "$(dirname "$GSTACK_DIR")" "$HOME/.codex/skills"

"$ROOT/scripts/install-tools.sh" || log "WARN: core CLI bootstrap had warnings."
"$ROOT/scripts/setup-mcp.sh" || log "WARN: MCP setup had warnings."

if ! have git; then
  log "ERROR: git is required after bootstrap. Install Xcode Command Line Tools or Homebrew git, then rerun."
  exit 1
fi

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

if [ -x "$ROOT/scripts/install-codex-gstack-overlay.sh" ]; then
  "$ROOT/scripts/install-codex-gstack-overlay.sh" || log "WARN: Codex GStack overlay plugin install had warnings."
else
  log "WARN: Codex GStack overlay installer missing."
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

Use normal wording for security warnings, destructive operations, or anything where caveman brevity could be misread.

If the host cannot discover skills, use ~/edward-agent-stack/agents/AGENTS.md as the fallback skill index.

Before opening a PR or ending a meaningful task, run decision capture:
read the current task context and diff, update Project Notes or Decision Notes if Edward made a reusable decision or project context changed, and cross-link related notes. If no update is needed, say "No note update needed" and why.

Intern-facing docs must read like an operator playbook: problem, standard, reason, procedure. Only publish the final standard. Omit draft notes, process notes, and cleanup notes.
SNIPPET

log "Wrote suggested user-scope snippet: $ROOT/dist/user-scope-AGENTS-snippet.md"

if have repowise; then
  log "Repowise found: $(repowise --version 2>/dev/null || echo installed)"
else
  log "Repowise not found. Install separately if this machine needs repo intelligence."
fi

log "Install complete. Run ./scripts/verify.sh"
