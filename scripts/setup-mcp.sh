#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${ROOT}/dist/codex-mcp.example.toml"
MEM_PY="${HOME}/.codex/mcp/mempalace/.venv/bin/python"

log() { printf '%s\n' "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }
run_best_effort() {
  label="$1"
  shift
  log "Installing/checking $label"
  if "$@"; then
    log "OK   $label"
  else
    log "WARN $label failed. Continue; fix manually if needed."
  fi
}

mkdir -p "$ROOT/dist" "$HOME/.codex/mcp/mempalace"

if [ ! -x "$MEM_PY" ]; then
  if have python3; then
    log "Installing MemPalace MCP runtime"
    run_best_effort "MemPalace venv" python3 -m venv "$HOME/.codex/mcp/mempalace/.venv"
    if [ -x "$HOME/.codex/mcp/mempalace/.venv/bin/pip" ]; then
      run_best_effort "MemPalace package" "$HOME/.codex/mcp/mempalace/.venv/bin/pip" install -U mempalace
    else
      log "WARN MemPalace venv pip missing. Template still written."
    fi
  else
    log "WARN python3 missing. Cannot install MemPalace MCP runtime."
  fi
else
  log "OK   MemPalace MCP runtime exists"
fi

cat > "$OUT" <<EOF
# Edward Agent Stack Codex MCP template.
# Copy relevant blocks into ~/.codex/config.toml.
# Do not paste real API keys into this repo.

# Exa needs EXA_API_KEY. Replace <EXA_API_KEY> locally, never commit it.
[mcp_servers.exa]
url = "https://mcp.exa.ai/mcp?exaApiKey=<EXA_API_KEY>"

[mcp_servers.linear]
url = "https://mcp.linear.app/mcp"

[mcp_servers.mempalace]
command = "${MEM_PY}"
args = ["-m", "mempalace.mcp_server"]
startup_timeout_sec = 20.0

[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"

[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]

[mcp_servers.repowise]
command = "repowise"
args = ["mcp"]
startup_timeout_sec = 20.0
EOF

log "Wrote MCP template: $OUT"
log "Auth/key gates remain manual: Exa key, Linear OAuth, Nia login, GitHub login, Vercel/Supabase project auth."
