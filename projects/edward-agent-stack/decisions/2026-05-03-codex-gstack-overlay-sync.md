# Decision: Codex GStack Overlay Sync

Date: 2026-05-03
Status: active
Source: Edward conversation and local fork sync

## Question

How should Edward Agent Stack keep `giaphutran12/codex-gstack` current with upstream `garrytan/gstack` without losing Edward's Codex-specific patches?

## Decision

Use a Codex GStack Overlay plugin as the standard fork-maintenance path.

The plugin installs a `$gstack-sync` workflow that:

- requires a clean `codex-gstack` working tree
- creates a backup branch
- merges upstream `garrytan/gstack`
- reapplies Edward's Codex overlay patches
- regenerates generated skill artifacts
- verifies host config, Codex hardening tests, and skill freshness
- pushes only when Edward explicitly asks

Do not use GitHub "discard commits", `git reset --hard upstream/main`, or force pushes to sync the fork.

## Why

`codex-gstack` is intentionally ahead of upstream because it carries Codex behavior: host overlay, subagent mapping, skill-loading behavior, nested host skips, generated skill freshness, and the GPT-5.5 default model overlay.

Upstream freshness matters, but freshness is not allowed to erase those fork-only changes.

## Applies To

- `AGENTS.md`
- `README.md`
- `docs/GSTACK.md`
- `docs/TOOLING.md`
- `plugins/codex-gstack-overlay/`
- `scripts/install-codex-gstack-overlay.sh`
- `scripts/install.sh`
- `scripts/update.sh`
- `scripts/verify.sh`

## Tradeoff

Gain: repeatable upstream sync with tests and without abandoning Codex-specific work.

Give up: fork maintenance is slightly more structured than clicking GitHub's sync button.

## Risk / Blast Radius

If upstream GStack changes conflict with the overlay patch, the sync stops and asks for patch refresh instead of silently producing a broken Codex host.

If the local fork checkout is shallow or unrelated to upstream, the sync stops instead of resetting or discarding commits.

## Revisit When

Upstream GStack supports Codex as a first-class host and no longer needs Edward's fork-only overlay.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-rules/references/tooling.md`
- `skills/edward-intern-coach/SKILL.md`

## Related Project Notes

- `projects/edward-agent-stack/PROJECT.md`
