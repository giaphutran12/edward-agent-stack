# BLI Cockpit Integration

## Problem

BLI interns need fast coaching while work is still in flight. Edward Rules set the work standard, but managers also need a live read on who is active, blocked, escalating, deciding, reviewing, and shipping.

## Standard

For BLI-managed intern work, Edward Agent Stack is the operator surface and Cockpit is the feedback surface.

- Interns work through Codex, Edward Rules, Project Notes, Decision Notes, and gstack.
- Cockpit receives lifecycle events as the work happens.
- Edward uses Cockpit to coach in flight, review patterns, and improve the next cohort playbook.

Cockpit observes. It is not the primary orchestrator for human-driven Codex sessions.

## Reason

Training without observability turns coaching into guesswork. Observability without Edward Rules turns event streams into noise. Together, the loop is:

```text
train -> observe -> coach -> improve rules -> train the next intern faster
```

## Procedure

### Required Events

Emit these events during BLI intern work when Cockpit tooling is available:

| Moment | Cockpit event | Payload standard |
| --- | --- | --- |
| Start ticket | `ticket_claimed` | ticket id, repo, branch, operator |
| Plan ready | `plan_submitted` | short plan, risks, tests |
| Plan reviewed | `plan_reviewed` | verdict, score, must-fix items |
| Progress worth saving | `note` | full prose note with useful context |
| Edward needed | `human_gate_hit` | structured escalation payload |
| Reusable decision made | `decision_record` | question, options, chosen path, rationale |
| PR opened | `pr_opened` | PR URL, verification, decision capture status |
| Task complete | `worker_returned` | result, links, remaining risk |

### Raw Evidence Lane

Problem: analysis-only telemetry loses facts. If the original session material is missing, future coaching, audits, and better evaluators cannot recover it.

Standard: capture the raw session evidence first, then layer summaries, scores, and coaching analysis on top.

Reason: raw evidence is the source of truth. Summaries are useful views, but they are not allowed to be the only record.

Procedure:

1. Store raw session exports in an access-controlled evidence pack.
2. Emit Cockpit lifecycle events with operator, ticket, repo, branch, timestamps, evidence-pack manifest path, and counts or hashes.
3. Keep normal event payloads readable for managers.
4. Keep raw evidence out of stdout, PR bodies, Slack, and generated docs unless Edward explicitly approves that destination.
5. Run analysis from the evidence pack so new evaluators can be added later without losing past context.

### Active Ticket Binding

Start BLI work from a launcher that binds the session to the active ticket.

Required invariant:

```bash
export BLI_ACTIVE_TICKET="<ticket-id>"
```

The launcher may be `bli-codex`, `bli-claude`, or another project-approved wrapper. The name is less important than these invariants:

- operator JWT is present
- active ticket is present
- repo/worktree matches the ticket
- emits are tagged to the correct ticket and operator

### Decision Capture

For Cockpit-integrated work, `decision_record` is the structured store for cross-project aggregation. The repo Decision Note is the human-readable rendering close to the code.

Until `bli-event decision_record` writes both surfaces automatically, do both with the same content:

1. create or update the Decision Note
2. emit `decision_record`
3. link the event or PR in the note when possible

The note remains important because agents and interns read the repo first.

### Escalation

When Edward is needed, emit `human_gate_hit` with the Edward escalation fields:

```text
Question:
Context:
What Codex said:
Options:
Tradeoff:
Risk/blast radius:
What I tested:
My recommendation:
```

Slack can be used for speed only if the structured Cockpit event is also emitted.

### Caveman Boundary

Use `/caveman ultra` for agent chatter.

Use full operator prose for Cockpit-bound content:

- event payloads
- findings
- PR bodies
- Decision Notes
- escalation messages

These artifacts must still make sense weeks later.

### Local Overrides

`AGENTS.local.md` remains allowed for intern-specific preferences.

For Cockpit-emitting work, record local override usage at session start with a `note` event:

```text
Session override active: AGENTS.local.md present.
Scope: communication or local workflow preference only.
No project rule override unless the PR explains it.
```

Local preferences must never override secrets, attribution, database safety, or architecture approval rules.

### GStack Pin

BLI should use Edward's Codex-compatible gstack fork as the shared shipping layer:

```text
https://github.com/giaphutran12/codex-gstack
```

When Cockpit worker images install gstack, pin this fork by commit SHA. Intern setup and Cockpit worker setup should move together when the fork is bumped.

Use the Codex GStack Overlay plugin when bumping the fork. Do not update worker
images from upstream `garrytan/gstack` directly unless Edward explicitly changes
the standard.

### Day-1 Intern Loop

Day 1 should prove the whole loop with a small ticket:

1. install Edward Agent Stack
2. authenticate required tools
3. receive Cockpit operator access
4. start a scoped ticket with active-ticket binding
5. emit `ticket_claimed`
6. write and emit `plan_submitted`
7. run plan review and emit `plan_reviewed`
8. make the change
9. run tests
10. run decision capture
11. open PR and emit `pr_opened`
12. merge when approved and emit completion

## Edward Verdicts On Veetesh Handoff

### Mandatory Items

| Item | Verdict | Edward adjustment |
| --- | --- | --- |
| M1 lifecycle events | Accept | Event every lifecycle step, not every keystroke. |
| M2 events canonical | Accept for Cockpit aggregation | Repo notes still matter as the code-adjacent reading surface. |
| M3 operator JWT attribution | Accept | No shared intern identity for emits. |
| M4 structured escalations | Accept | Edward escalation template becomes payload shape. |
| M5 full prose for Cockpit writes | Accept | Caveman exemption applies. |
| M6 one gstack binary | Accept | Pin Edward `codex-gstack` fork SHA across BLI. |
| M7 bootstrap installs both stacks | Accept when Cockpit install commands are stable | Bootstrap should verify and report missing Cockpit auth/tooling. |
| M8 active-ticket sessions | Accept | Prefer a Codex-native launcher name for Codex workflows. |

### Negotiable Items

| Item | Edward default |
| --- | --- |
| N1 skill loading | Hybrid: lazy-load for human Codex sessions; upfront briefing for headless workers. |
| N2 `AGENTS.local.md` | Keep it and emit a session-start `note` when present. |
| N3 caveman policy | Caveman for agent chatter; full prose for Cockpit-bound artifacts. |
| N4 decision gate | Tooling-enforced check first; decision-capture subagent before PR when available. |
| N5 escalation venue | Cockpit drawer primary; Linear acceptable if webhook-backed; Slack only for triage. |
| N6 first task | Edward-curated small ticket per project. |
| N7 per-intern dashboard | Build cycle time, blocked-rate, plan-review verdict mix, and PR-review verdict mix first. |
| N8 operator invite | Admin CLI Edward can run. |
| N9 Project Notes | Keep `PROJECT.md` in the project repo; Cockpit links to it. |

## Build First In Cockpit

The highest-leverage first build is the per-intern dashboard with cheap, objective signals:

- active tickets
- cycle time by ticket size
- blocked-rate
- plan-review verdict mix
- PR-review verdict mix
- open `human_gate_hit` queue
- last five `decision_record` events

Defer skill-mastery scoring and coaching prompts until enough clean events exist.
