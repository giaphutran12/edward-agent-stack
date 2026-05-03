#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_NAME="codex-gstack-overlay"
SRC="$ROOT/plugins/$PLUGIN_NAME"
DEST_ROOT="${CODEX_PLUGIN_ROOT:-$HOME/.agents/plugins}"
DEST="$DEST_ROOT/plugins/$PLUGIN_NAME"
MARKETPLACE="$DEST_ROOT/marketplace.json"

log() { printf '%s\n' "$*"; }

if [ ! -f "$SRC/.codex-plugin/plugin.json" ]; then
  log "ERROR: plugin source missing: $SRC"
  exit 1
fi

mkdir -p "$DEST_ROOT/plugins"
rm -rf "$DEST"
cp -R "$SRC" "$DEST"
chmod +x "$DEST"/skills/gstack-sync/scripts/*.sh

if command -v node >/dev/null 2>&1; then
  MARKETPLACE="$MARKETPLACE" node <<'NODE'
const fs = require('fs');
const path = require('path');
const file = process.env.MARKETPLACE;
let data;
if (fs.existsSync(file)) {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} else {
  data = {
    name: 'edward-personal-plugins',
    interface: { displayName: 'Edward Personal Plugins' },
    plugins: []
  };
}
data.name = data.name || 'edward-personal-plugins';
data.interface = data.interface || {};
data.interface.displayName = data.interface.displayName || 'Edward Personal Plugins';
data.plugins = Array.isArray(data.plugins) ? data.plugins : [];
const entry = {
  name: 'codex-gstack-overlay',
  source: { source: 'local', path: './plugins/codex-gstack-overlay' },
  policy: { installation: 'INSTALLED_BY_DEFAULT', authentication: 'ON_INSTALL' },
  category: 'Productivity'
};
const index = data.plugins.findIndex((plugin) => plugin && plugin.name === entry.name);
if (index >= 0) data.plugins[index] = entry;
else data.plugins.push(entry);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
NODE
else
  if [ ! -f "$MARKETPLACE" ]; then
    cat > "$MARKETPLACE" <<'JSON'
{
  "name": "edward-personal-plugins",
  "interface": {
    "displayName": "Edward Personal Plugins"
  },
  "plugins": [
    {
      "name": "codex-gstack-overlay",
      "source": {
        "source": "local",
        "path": "./plugins/codex-gstack-overlay"
      },
      "policy": {
        "installation": "INSTALLED_BY_DEFAULT",
        "authentication": "ON_INSTALL"
      },
      "category": "Productivity"
    }
  ]
}
JSON
  else
    log "WARN: node not found. Plugin copied, but existing marketplace was not edited."
  fi
fi

log "Installed $PLUGIN_NAME plugin at $DEST"
log "Marketplace: $MARKETPLACE"
