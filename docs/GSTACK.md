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

## Freeze Policy

Problem: every upstream gstack release forced a Codex re-translation across
dozens of generated skill files. That upkeep cost more than the freshness was
worth for the small set of Codex workflows in actual use.

Standard: `codex-gstack` is frozen at tag `frozen-v1` (2026-07-06). The fork
no longer tracks upstream `garrytan/gstack`. There are no upstream syncs and
no overlay patch waves.

Reason: the frozen fork already covers the Codex workflows in use (`browse`,
`review`, `gstack-upgrade` router). A fork that never merges upstream never
needs re-translation.

Procedure:

1. Never run `/gstack-upgrade` inside Codex. Never add an upstream remote or
   use GitHub fork sync on `codex-gstack`.
2. `./scripts/update.sh` only fast-forwards `codex-gstack` from Edward's fork
   `origin/main`.
3. Upgrade only when a skill in active use breaks. Treat that as a deliberate
   one-off project with Edward's sign-off.
4. Build new Codex-native behaviors as owned skills in
   `edward-agent-stack/skills/`, never as patches on generated gstack output.

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

This fast-forwards the stack repo and `codex-gstack` from their own origins.
It never merges upstream `garrytan/gstack`. See Freeze Policy above.
