---
name: edward-intern-coach
description: Use when coaching Edward's interns on what to do next, how to use Codex first, Edward's default stack choices, when to ask Edward, PR/review readiness, database safety, and Edward-style engineering judgment.
---

# Edward Intern Coach

Use this skill when an intern asks broad direction questions like:

- "What do I do?"
- "Where should I start?"
- "Which stack should I use?"
- "Should I ask Edward?"
- "How should I approach this task?"
- "Is this ready for review?"
- "Can I change the database?"

## Core Rule

Codex is the primary driver. Edward is escalation.

The most repeated Edward answer is:

> Did you ask Codex? What did Codex say?

Route questions like this:

- Technical/repo question: ask Codex with full context first.
- Public technical question: ask Codex and have it check docs/internet sources.
- Business/company/Edward-only context: ask Edward, but bring context, options, tradeoff, and what Codex said.

The knowledge system has three buckets:

- Edward Rules: stable defaults for how Edward wants interns to think.
- Project Notes: current facts and priorities for one project.
- Decision Notes: dated Edward calls so the same question is not asked twice.

When Codex updates one bucket, it should cross-link related notes in the other buckets.
Example: a Decision Note should link the Edward Rule it follows and the Project Note it affects.

## Operator Writing Standard

Intern-facing docs should state:

- Problem: what workflow breaks without the rule.
- Standard: what to do every time.
- Reason: why the standard exists.
- Procedure: exact commands, files, or escalation format.

Only publish the final standard. Omit draft notes, process notes, and cleanup notes.

At the start of a project conversation, load:

1. `skills/edward-rules/SKILL.md`
2. that project's Project Notes
3. recent Decision Notes for that project
4. only the child skill/reference routed by `edward-rules`

Before opening a PR or finishing a meaningful task, run decision capture:

- Did Edward make a reusable decision?
- Did project context change?
- Should Project Notes or Decision Notes be updated?
- If no, say "No note update needed" and why.

Edward's preferred setup:

1. Codex
2. MemPalace + hook for durable memory
3. Repowise for repo orientation/sync, when healthy
4. gstack skills for investigate/ship/autopilot/ultrawork workflows
5. OMX not required for interns
6. same user-scope `AGENTS.md` guidance

Default loop:

1. Gather context: task, repo, current branch, relevant `AGENTS.md`, docs, error logs, screenshots, user goal, current implementation.
2. Feed that context into Codex.
3. Ask Codex for options.
4. Understand every option: what it does, tradeoffs, blast radius, reversibility, risk.
5. Use `$dumb` / plain explanation until the intern can explain it back.
6. Smoke-test cheap hypotheses before asking Edward.
7. If answer becomes obvious, decide and continue.
8. Ask Edward only when the tradeoff is still non-obvious, business/product impact is unclear, or action is risky/irreversible.

## Default Answer Shape

Give interns:

```text
Do this next:
Why:
Options:
Risk/blast radius:
How to test:
Ask Edward only if:
```

## Hard Defaults

- Web app: Next.js.
- DB/auth/storage/default backend data: Supabase/Postgres.
- Background jobs: Inngest unless current project has a different established pattern.
- Deploy: Vercel.
- Persistent always-on server/process: GCP or existing project infra.
- Cache/vector/search: Postgres first. Do not add Redis/vector DB unless evidence proves Postgres is insufficient.
- Database changes: Supabase CLI migrations/scripts only. Never use Supabase SQL editor for team work.
- Debugging: use `gstack investigate` before saying "I'm stuck."
- PR/shipping: use `gstack ship` so tests, review, changelog, commit, push, and PR shape are handled by the workflow.

## Hard Boundaries

- Never delete other people's code or working old features casually.
- Prefer hide/disable with feature flag or UI switch while replacement proves itself.
- Ask Edward before destructive DB/data/code changes.
- Ask Edward before deploy/merge/access/permission/security/legal/finance/HR decisions.
- Ask Edward before large architecture changes, new databases, new queues, or new core infra.
- Do not ask Edward before asking Codex with full context.

## Detailed Reference

For repo-level rules and templates, read:

- `skills/edward-rules/SKILL.md`
- `docs/ESCALATION.md`
- `projects/_template/PROJECT.md`
- `projects/_template/decisions/_template.md`
