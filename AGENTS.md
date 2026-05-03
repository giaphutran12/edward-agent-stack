# Edward Agent Stack Instructions

## Secrets

- Never inspect real env/secret files. Only `.env.example` may be read.
- Real env files may be loaded execution-only for build/test/run/auth checks.
- Never print, echo, diff, log, or summarize secret values.
- If a needed secret is unavailable, stop and ask the user to provide or load it.

## Start Of Task

At the start of any coding task using this stack, load:

0. `/caveman ultra` for terse token-saving communication
1. `$edward-rules` from `skills/edward-rules/SKILL.md`
2. only the child skill/reference it routes to, if needed
3. the current project's `PROJECT.md`, if one exists
4. recent relevant Decision Notes under the current project's `decisions/`
5. `AGENTS.local.md`, if it exists

Do not load all Edward docs up front. Use the parent skill and lazy-load details.

If the host cannot discover skills, use `agents/AGENTS.md` as the fallback skill index.

If project notes are missing, create them from `projects/_template/PROJECT.md` before major work.

Use normal wording for security warnings, destructive operations, or anything where caveman brevity could be misread.

For BLI Cockpit-managed work, also read `docs/COCKPIT.md` and verify active-ticket context before implementation:

- operator identity is authenticated
- `BLI_ACTIVE_TICKET` is set by the approved launcher
- repo/worktree matches the ticket
- Cockpit emits are available, or missing tooling is reported

## Local Preferences

Intern-specific preferences belong in `AGENTS.local.md`.

Root `AGENTS.md` should say to read `AGENTS.local.md`, but `AGENTS.local.md` must stay untracked.

## Decision Capture

Before opening a PR or ending a meaningful task:

- read the conversation and diff
- apply the operator standard: final docs should state problem, standard, reason, and procedure
- decide whether Edward made a reusable decision
- decide whether project context changed
- update Project Notes or Decision Notes if needed
- cross-link related Edward Rules, Project Notes, and Decision Notes
- if no update is needed, say `No note update needed` and why

Codex should write these notes from the current task context. Edward should not have to manually summarize every decision.

For Cockpit-integrated work, decision capture has two outputs:

- repo note: Project Notes or Decision Notes for humans and agents reading the codebase
- Cockpit event: `decision_record` for aggregation, attribution, and cohort retrospection

Until the Cockpit emitter writes both surfaces automatically, update the repo note and emit the matching event with the same decision content.

## Operator Writing Standard

Intern-facing material must read like an operator playbook.

Use:

- Problem: what breaks without this rule.
- Standard: what to do every time.
- Reason: why the standard exists.
- Procedure: exact commands, files, or escalation format.

Only publish the final standard. Omit draft notes, process notes, and cleanup notes.

Cockpit-bound writes are operator-facing. Event payloads, findings, PR bodies, Decision Notes, and escalation messages must use full prose even when `/caveman ultra` is active.

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

For `codex-gstack` fork maintenance, use the Codex GStack Overlay plugin:

```bash
~/edward-agent-stack/scripts/install-codex-gstack-overlay.sh
~/.agents/plugins/plugins/codex-gstack-overlay/skills/gstack-sync/scripts/sync-upstream.sh --repo ~/.gstack/repos/gstack --no-push
```

Do not sync the fork by discarding commits, force-pushing, or resetting to
upstream. The overlay keeps upstream GStack changes and Edward's Codex patches.

## BLI Cockpit

Cockpit observes intern work for BLI manager coaching. It is the feedback surface, not the primary orchestrator for human-driven Codex sessions.

When Cockpit tooling is available, emit lifecycle events during BLI intern work:

- `ticket_claimed`
- `plan_submitted`
- `plan_reviewed`
- `note`
- `human_gate_hit`
- `decision_record`
- `pr_opened`
- `worker_returned`

Use `docs/COCKPIT.md` for the exact event moments, escalation payload, local override policy, and Edward verdicts on the Veetesh handoff.

## Repo Hygiene

- Branch + PR for shared changes.
- Do not work directly on `main`.
- Do not delete merged branches unless asked.
- Do not delete or revert user work you did not make.
- Run relevant verification before PR.
