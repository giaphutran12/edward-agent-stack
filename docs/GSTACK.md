# GStack Notes

Use Edward's fork:

```bash
https://github.com/giaphutran12/codex-gstack
```

Do not install upstream `garrytan/gstack` for interns unless Edward says so.

## Why The Fork

The fork carries Codex compatibility patches on top of upstream gstack:

- `host-overlays/codex.md`: maps Claude wording to Codex runtime behavior
- `hosts/codex.ts`: skips `/codex` and `/claude` nested-host paths for Codex
- Codex subagent wording and tool rewrites
- full-skill loading for subagents that execute/review gstack skills
- default model overlay for `gpt-5.5`
- skill freshness checks for generated Codex docs

## Overlay Plugin

Problem: GitHub's fork sync button can offer to discard fork commits when the
fork is ahead and behind upstream. That would erase Edward's Codex-specific
patches.

Standard: update `codex-gstack` through the local Codex GStack Overlay plugin.
The overlay plugin merges upstream `garrytan/gstack`, reapplies Edward's Codex
patches, regenerates generated skills, verifies host behavior, and only pushes
when the operator explicitly asks.

Reason: the fork needs upstream freshness and Edward's Codex behavior at the
same time. Resetting to upstream solves freshness by destroying the overlay.

Procedure:

```bash
~/edward-agent-stack/scripts/install-codex-gstack-overlay.sh
~/.agents/plugins/plugins/codex-gstack-overlay/skills/gstack-sync/scripts/sync-upstream.sh --repo ~/.gstack/repos/gstack --no-push
```

Use `--push` only when Edward explicitly asks to update `origin/main`.

## Install

```bash
git clone --single-branch --depth 1 https://github.com/giaphutran12/codex-gstack.git ~/.gstack/repos/gstack
cd ~/.gstack/repos/gstack
./setup --host codex
~/edward-agent-stack/scripts/install-codex-gstack-overlay.sh
```

## Update

```bash
~/edward-agent-stack/scripts/update.sh
```

Do not use `git reset --hard upstream/main`, GitHub "discard commits", or force
pushes for fork sync. Use `scripts/update.sh` or the overlay plugin directly so
the fork keeps both upstream changes and Codex-specific patches.
