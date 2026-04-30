#!/usr/bin/env bash
set -euo pipefail

log() { printf '%s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

run_best_effort() {
  label="$1"
  shift
  log "Installing/checking $label"
  if "$@"; then
    log "OK   $label"
  else
    log "WARN $label install failed. Continue; run manually if needed."
  fi
}

brew_install_missing() {
  if ! have brew; then
    log "WARN Homebrew missing. Skipping brew packages."
    return 0
  fi

  for pkg in "$@"; do
    cmd="${pkg%%:*}"
    formula="${pkg#*:}"
    if have "$cmd"; then
      log "OK   $cmd already installed"
      continue
    fi
    run_best_effort "$cmd via brew" brew install "$formula"
  done
}

npm_install_missing() {
  if ! have npm; then
    log "WARN npm missing. Skipping npm global packages."
    return 0
  fi

  cmd="$1"
  pkg="$2"
  if have "$cmd"; then
    log "OK   $cmd already installed"
    return 0
  fi
  run_best_effort "$cmd via npm" npm install -g "$pkg"
}

python_tool_missing() {
  cmd="$1"
  pkg="$2"
  if have "$cmd"; then
    log "OK   $cmd already installed"
    return 0
  fi

  if have uv; then
    run_best_effort "$cmd via uv tool" uv tool install "$pkg"
    have "$cmd" && return 0
  fi

  if have python3; then
    run_best_effort "$cmd via pip --user" python3 -m pip install --user -U "$pkg"
  else
    log "WARN python3 missing. Cannot install $cmd."
  fi
}

log "Best-effort core CLI install"

brew_install_missing \
  "gh:gh" \
  "rg:ripgrep" \
  "jq:jq" \
  "tmux:tmux" \
  "ffmpeg:ffmpeg" \
  "uv:uv" \
  "node:node" \
  "python3:python" \
  "supabase:supabase/tap/supabase"

npm_install_missing codex "@openai/codex"
npm_install_missing nia "@nozomioai/nia"
npm_install_missing vercel "vercel"
npm_install_missing claude "@anthropic-ai/claude-code"

python_tool_missing repowise "repowise"

if ! have bun; then
  if have brew; then
    run_best_effort "bun via brew" brew install oven-sh/bun/bun
  else
    log "WARN bun missing and Homebrew unavailable."
  fi
else
  log "OK   bun already installed"
fi

if ! have docker; then
  log "WARN docker missing. Install Docker Desktop manually when project needs local services."
else
  log "OK   docker installed"
fi

log "Best-effort CLI install complete."
