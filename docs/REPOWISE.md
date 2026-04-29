# Repowise Notes

Repowise is repo/code intelligence.

Edward Rules are judgment and workflow.

Do not mix them.

## What Repowise Already Supports

Verified locally with `repowise 0.3.0`:

- `repowise init`
- `repowise update --provider TEXT --model TEXT`
- `repowise update --workspace`
- `repowise watch --workspace`
- `repowise hook install`
- `repowise hook install --workspace`
- `repowise decision`

The installed post-commit hook runs `repowise update` in the background when `.repowise/` exists.

## Codex Gap

Public Repowise docs say `repowise init` registers Claude Code settings/hooks and `.mcp.json`.

For Codex, use this repo's wrapper scripts:

- `scripts/repowise-update.sh`
- `scripts/verify.sh`

Future work:

- open upstream issue for Codex lifecycle hook support
- add persistent provider/model config without printing secrets
- add Codex-friendly MCP setup instructions
