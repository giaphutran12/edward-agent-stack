#!/usr/bin/env bash
set -euo pipefail

ok() { printf 'OK   %s\n' "$*"; }
warn() { printf 'WARN %s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

check_cmd() {
  label="$1"
  shift
  timeout_seconds="${AUTH_CHECK_TIMEOUT_SECONDS:-20}"
  "$@" >/tmp/edward-agent-stack-auth.out 2>/tmp/edward-agent-stack-auth.err &
  pid="$!"
  elapsed=0

  while kill -0 "$pid" 2>/dev/null; do
    if [ "$elapsed" -ge "$timeout_seconds" ]; then
      kill "$pid" 2>/dev/null || true
      sleep 1
      kill -9 "$pid" 2>/dev/null || true
      wait "$pid" 2>/dev/null || true
      warn "$label timed out after ${timeout_seconds}s"
      return
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done

  if wait "$pid"; then
    ok "$label"
  else
    warn "$label"
  fi
}

printf 'Edward Agent Stack auth doctor\n'

if have codex; then
  check_cmd "Codex authenticated" codex login status
else
  warn "Codex CLI missing. Run ./scripts/install.sh"
fi

if have claude; then
  check_cmd "Claude authenticated" claude auth status
else
  warn "Claude Code missing. Run ./scripts/install.sh"
fi

if have gh; then
  check_cmd "GitHub authenticated" gh auth status
else
  warn "GitHub CLI missing. Run ./scripts/install.sh"
fi

if have vercel; then
  check_cmd "Vercel authenticated" vercel whoami
else
  warn "Vercel CLI missing. Run ./scripts/install.sh"
fi

if have supabase; then
  check_cmd "Supabase authenticated" supabase orgs list
else
  warn "Supabase CLI missing. Run ./scripts/install.sh"
fi

if have nia; then
  check_cmd "Nia authenticated" nia auth status
else
  warn "Nia CLI missing; optional unless Edward approves a Nia seat"
fi

if have docker; then
  if docker info >/tmp/edward-agent-stack-auth.out 2>/tmp/edward-agent-stack-auth.err; then
    ok "Docker Desktop running"
  else
    warn "Docker Desktop not running. Open Docker Desktop if project uses local services."
  fi
else
  warn "Docker missing. Open/install Docker Desktop if project uses local services."
fi

printf '\nManual MCP/API gates that cannot be auto-verified safely:\n'
printf -- '- Exa MCP: create key at https://dashboard.exa.ai/api-keys and put it only in local ~/.codex/config.toml\n'
printf -- '- Linear MCP: complete OAuth in Codex/browser when prompted and confirm workspace access\n'
printf -- '- Repowise Gemini: create key at https://aistudio.google.com/apikey, then store per project in .repowise/.env\n'
printf '\nSee docs/AUTH_GATES.md for exact prompts and safe commands.\n'
