#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SANDBOX_ROOT=""
KEEP=1
ALLOW_GLOBAL_INSTALLS=0
WITH_MACOS_BOOTSTRAP=0

usage() {
  cat <<'USAGE'
Fresh-home Edward Agent Stack sandbox.

Usage:
  ./scripts/fresh-mac-sandbox.sh [--root PATH] [--keep] [--delete-after] [--allow-global-installs] [--with-macos-bootstrap]

Default mode tests a clean user home while protecting the real machine:
- uses a temp HOME, config dirs, npm cache, pip cache, uv dirs, and gstack dir
- unsets common API-key env vars
- skips base macOS bootstrap by default
- refuses to run if core CLIs are missing, unless --allow-global-installs is passed
- writes raw command logs under the sandbox log directory

Use --with-macos-bootstrap only on a throwaway Mac or first-run intern Mac.
USAGE
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --root)
      SANDBOX_ROOT="${2:-}"
      shift 2
      ;;
    --root=*)
      SANDBOX_ROOT="${1#*=}"
      shift
      ;;
    --keep)
      KEEP=1
      shift
      ;;
    --delete-after)
      KEEP=0
      shift
      ;;
    --allow-global-installs)
      ALLOW_GLOBAL_INSTALLS=1
      shift
      ;;
    --with-macos-bootstrap)
      WITH_MACOS_BOOTSTRAP=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf 'ERROR unknown argument: %s\n\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [ -z "$SANDBOX_ROOT" ]; then
  SANDBOX_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/edward-agent-stack-fresh-mac.XXXXXX")"
else
  mkdir -p "$SANDBOX_ROOT"
fi

SANDBOX_ROOT="$(cd "$SANDBOX_ROOT" && pwd)"
SANDBOX_HOME="$SANDBOX_ROOT/home"
LOG_DIR="$SANDBOX_ROOT/logs"
mkdir -p "$SANDBOX_HOME" "$LOG_DIR"

cleanup() {
  if [ "$KEEP" -eq 0 ]; then
    case "$SANDBOX_ROOT" in
      /tmp/edward-agent-stack-fresh-mac.*|/var/folders/*/edward-agent-stack-fresh-mac.*|/private/var/folders/*/edward-agent-stack-fresh-mac.*)
        rm -rf "$SANDBOX_ROOT"
        ;;
      *)
        printf 'Refusing to delete non-temp sandbox root: %s\n' "$SANDBOX_ROOT"
        ;;
    esac
  fi
}
trap cleanup EXIT

have() { command -v "$1" >/dev/null 2>&1; }

host_tools=(
  git
  codex
  gh
  rg
  jq
  tmux
  bun
  node
  npm
  npx
  python3
  pip3
  uv
  docker
  ffmpeg
  supabase
  vercel
  claude
  nia
  repowise
)

if [ "$ALLOW_GLOBAL_INSTALLS" -eq 0 ]; then
  missing=()
  for tool in "${host_tools[@]}"; do
    if ! have "$tool"; then
      missing+=("$tool")
    fi
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    printf 'ERROR host is missing tools needed for no-mutation sandbox: %s\n' "${missing[*]}" >&2
    printf 'Rerun with --allow-global-installs only on a machine where installing global tools is intended.\n' >&2
    exit 1
  fi
fi

export HOME="$SANDBOX_HOME"
export XDG_CONFIG_HOME="$SANDBOX_ROOT/xdg-config"
export XDG_CACHE_HOME="$SANDBOX_ROOT/xdg-cache"
export XDG_DATA_HOME="$SANDBOX_ROOT/xdg-data"
export NPM_CONFIG_PREFIX="$SANDBOX_ROOT/npm-global"
export NPM_CONFIG_CACHE="$SANDBOX_ROOT/npm-cache"
export BUN_INSTALL="$SANDBOX_ROOT/bun"
export PIP_CACHE_DIR="$SANDBOX_ROOT/pip-cache"
export UV_TOOL_DIR="$SANDBOX_ROOT/uv/tools"
export UV_TOOL_BIN_DIR="$SANDBOX_ROOT/uv/bin"
export GSTACK_DIR="$SANDBOX_HOME/.gstack/repos/gstack"
export CODEX_GSTACK_RUNTIME="$SANDBOX_HOME/.codex/skills/gstack"
export CODEX_PLUGIN_ROOT="$SANDBOX_HOME/.agents/plugins"
export CODEX_GSTACK_OVERLAY="$CODEX_PLUGIN_ROOT/plugins/codex-gstack-overlay"
export CODEX_PLUGIN_MARKETPLACE="$CODEX_PLUGIN_ROOT/marketplace.json"

if [ "$WITH_MACOS_BOOTSTRAP" -eq 0 ]; then
  export EDWARD_STACK_SKIP_MACOS_BOOTSTRAP=1
fi

unset OPENAI_API_KEY
unset ANTHROPIC_API_KEY
unset GEMINI_API_KEY
unset GOOGLE_API_KEY
unset EXA_API_KEY
unset SUPABASE_ACCESS_TOKEN
unset VERCEL_TOKEN
unset LINEAR_API_KEY
unset GH_TOKEN
unset GITHUB_TOKEN

run_step() {
  label="$1"
  shift
  slug="$(printf '%s' "$label" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//; s/-$//')"
  log_file="$LOG_DIR/${slug:-step}.log"
  printf 'RUN  %s\n' "$label"
  if "$@" >"$log_file" 2>&1; then
    printf 'OK   %s\n' "$label"
  else
    printf 'FAIL %s\n' "$label"
    printf 'Log: %s\n' "$log_file"
    if grep -Eq 'bootstrap_check_in .*Permission denied|MachPortRendezvous' "$log_file" 2>/dev/null; then
      printf 'Hint: Playwright Chromium launch was blocked by the command runner sandbox. Rerun from a normal Terminal or an approved unrestricted Codex command.\n'
    fi
    return 1
  fi
}

syntax_check() {
  bash_files=(
    "$ROOT/scripts/audit-operator-playbook.sh"
    "$ROOT/scripts/auth-doctor.sh"
    "$ROOT/scripts/bootstrap-macos.sh"
    "$ROOT/scripts/fresh-mac-sandbox.sh"
    "$ROOT/scripts/generate-agents-fallback.sh"
    "$ROOT/scripts/install-codex-gstack-overlay.sh"
    "$ROOT/scripts/install-tools.sh"
    "$ROOT/scripts/install.sh"
    "$ROOT/scripts/repowise-update.sh"
    "$ROOT/scripts/setup-mcp.sh"
    "$ROOT/scripts/update.sh"
    "$ROOT/scripts/verify.sh"
  )
  for file in "${bash_files[@]}"; do
    bash -n "$file"
  done
}

printf 'Edward Agent Stack fresh-home sandbox\n'
printf 'Repo: %s\n' "$ROOT"
printf 'Sandbox: %s\n' "$SANDBOX_ROOT"
printf 'Home: %s\n' "$HOME"
printf 'Logs: %s\n' "$LOG_DIR"

run_step "bash syntax" syntax_check
run_step "install fresh home" "$ROOT/scripts/install.sh"
run_step "verify fresh home" "$ROOT/scripts/verify.sh"
run_step "auth doctor fresh home" "$ROOT/scripts/auth-doctor.sh"

printf '\nSandbox passed.\n'
printf 'Raw logs: %s\n' "$LOG_DIR"
printf 'Fresh HOME: %s\n' "$SANDBOX_HOME"
