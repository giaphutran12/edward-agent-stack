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
- default model overlay for `gpt-5.4`
- skill freshness checks for generated Codex docs

## Install

```bash
git clone --single-branch --depth 1 https://github.com/giaphutran12/codex-gstack.git ~/.gstack/repos/gstack
cd ~/.gstack/repos/gstack
./setup --host codex
```

## Update

```bash
cd ~/.gstack/repos/gstack
git fetch origin
git reset --hard origin/main
./setup --host codex
```

Use `scripts/update.sh` to do this with backup and verification.
