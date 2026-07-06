#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${ROOT}/dist/codex-mcp.example.toml"

log() { printf '%s\n' "$*"; }

mkdir -p "$ROOT/dist"

cat > "$OUT" <<EOF
# Edward Agent Stack Codex MCP template.
# Copy relevant blocks into ~/.codex/config.toml.
# Do not paste real API keys into this repo.

# Exa needs EXA_API_KEY. Replace <EXA_API_KEY> locally, never commit it.
[mcp_servers.exa]
url = "https://mcp.exa.ai/mcp?exaApiKey=<EXA_API_KEY>"

[mcp_servers.linear]
url = "https://mcp.linear.app/mcp"

# Supermemory is the durable memory MCP server. No key goes here; auth happens on first use.
[mcp_servers.supermemory]
url = "https://mcp.supermemory.ai/mcp"

# Mem0 is a Codex plugin, not an MCP server. In Codex, add the marketplace
# https://github.com/mem0ai/mem0.git and enable the mem0 plugin; it ships its own hooks.

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
log "Mem0 is a Codex plugin: add marketplace https://github.com/mem0ai/mem0.git in Codex and enable the mem0 plugin."
log "Auth/key gates remain manual: Exa key, Linear OAuth, Supermemory first-use auth, Nia login, GitHub login, Vercel/Supabase project auth."
