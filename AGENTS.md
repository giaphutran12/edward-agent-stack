# Edward Agent Stack Instructions

## Secrets

- Never inspect real env/secret files. Only `.env.example` may be read.
- Real env files may be loaded execution-only for build/test/run/auth checks.
- Never print, echo, diff, log, or summarize secret values.
- If a needed secret is unavailable, stop and ask the user to provide or load it.

## Start Of Task

At the start of any coding task using this stack, load:

1. `edward-rules/README.md`
2. the current project's `PROJECT.md`, if one exists
3. recent relevant Decision Notes under the current project's `decisions/`
4. `AGENTS.local.md`, if it exists

If project notes are missing, create them from `projects/_template/PROJECT.md` before major work.

## Local Preferences

Intern-specific preferences belong in `AGENTS.local.md`.

Root `AGENTS.md` should say to read `AGENTS.local.md`, but `AGENTS.local.md` must stay untracked.

## Decision Capture

Before opening a PR or ending a meaningful task:

- read the conversation and diff
- decide whether Edward made a reusable decision
- decide whether project context changed
- update Project Notes or Decision Notes if needed
- cross-link related Edward Rules, Project Notes, and Decision Notes
- if no update is needed, say `No note update needed` and why

Codex should write these notes from the conversation. Edward should not have to manually summarize every decision.

## Buckets

- Edward Rules: stable defaults for how Edward wants interns to think.
- Project Notes: current facts and priorities for one project.
- Decision Notes: dated decisions so the same question is not asked twice.

Do not call everything "brain."

## GStack

Use Edward's Codex-compatible fork:

```bash
git clone --single-branch --depth 1 https://github.com/giaphutran12/codex-gstack.git ~/.gstack/repos/gstack
cd ~/.gstack/repos/gstack
./setup --host codex
```

Use `gstack investigate` before saying stuck.

Use `gstack ship` for PR/review/shipping flow.

## Repo Hygiene

- Branch + PR for shared changes.
- Do not work directly on `main`.
- Do not delete merged branches unless asked.
- Do not delete or revert user work you did not make.
- Run relevant verification before PR.
