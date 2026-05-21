# Codex GStack Overlay

Personal Codex plugin for keeping Edward's `giaphutran12/codex-gstack` fork
synced with `garrytan/gstack` without discarding fork-only Codex changes.

## Standard

Use merge-based sync plus a patch queue.

The overlay currently preserves:
- GPT-5.5 as Edward's Codex default.
- Codex-native plan review stopgates via Codex decision gates.
- Mandatory plan-review outside voice through Codex subagents, with inline fallback.
- Plan-stage expected path/test matrix wording instead of fake branch proof.
- `/office-hours` offers only for product direction or feature behavior ambiguity.

Do not use `git reset --hard upstream/main`.
Do not click GitHub's discard-commits path.
Do not force-push.

## Direct Use

```bash
~/.agents/plugins/plugins/codex-gstack-overlay/skills/gstack-sync/scripts/sync-upstream.sh --no-push
```

Use `--push` only after verification passes and the operator intends to update
the fork remote.
