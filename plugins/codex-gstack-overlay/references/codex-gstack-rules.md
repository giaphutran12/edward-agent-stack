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

Current Codex overlay invariants:
- Codex skills default to GPT-5.5.
- AskUserQuestion wording maps to a Codex decision gate, preferring
  `request_user_input` when available.
- `/plan-eng-review` keeps mandatory outside voice through a Codex subagent,
  falling back to an inline adversarial pass if subagents are unavailable.
- Plan-stage test review produces an expected path/test matrix; diff-stage
  review is where exact function and branch proof belongs.
- `/office-hours` is offered for product direction or feature behavior
  ambiguity, not for obvious bugs or mechanical refactors.

## Procedure

```bash
~/.agents/plugins/plugins/codex-gstack-overlay/skills/gstack-sync/scripts/sync-upstream.sh --push
```

The script creates a backup branch before merge and stops on conflicts.
