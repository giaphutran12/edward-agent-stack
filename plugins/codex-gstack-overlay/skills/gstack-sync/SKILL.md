---
name: gstack-sync
description: Safely update Edward's codex-gstack fork from upstream GStack while preserving Codex overlay patches; use for sync gstack, update codex-gstack, gstack overlay, or avoiding GitHub discard commits.
---

# GStack Sync

Use this skill when Edward or an operator wants `giaphutran12/codex-gstack`
updated from `garrytan/gstack` without losing Codex-specific changes.

## Default

Run without push first unless the user explicitly asked to push:

```bash
~/.agents/plugins/plugins/codex-gstack-overlay/skills/gstack-sync/scripts/sync-upstream.sh --no-push
```

If the user explicitly asked to update the fork remote:

```bash
~/.agents/plugins/plugins/codex-gstack-overlay/skills/gstack-sync/scripts/sync-upstream.sh --push
```

## Safety Rules

- Do not use `git reset --hard upstream/main`.
- Do not force-push.
- Do not recommend GitHub "Discard commits".
- Require a clean `codex-gstack` working tree before sync.
- Create a backup branch before merge.
- Run verification before push.

## On Conflict

Stop and report the repo path, backup branch, conflicting files, and exact
continue commands. Do not discard fork commits.
