# Codex GStack Sync Rules

## Problem

Edward's fork carries Codex-specific behavior on top of upstream GStack. A hard
reset to upstream deletes that work.

## Standard

Merge upstream into the fork, apply Codex overlay patches, regenerate skills,
verify, then push with a normal non-force push.

## Reason

The fork must keep upstream improvements while preserving Codex-specific runtime
mapping, model overlay behavior, and generated skill freshness.

## Procedure

```bash
~/.agents/plugins/plugins/codex-gstack-overlay/skills/gstack-sync/scripts/sync-upstream.sh --push
```

The script creates a backup branch before merge and stops on conflicts.
