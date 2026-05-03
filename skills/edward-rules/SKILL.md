---
name: edward-rules
description: Use at the start of Edward/intern coding tasks to load Edward's stable engineering rules, route questions, and decide which Edward child skill or reference to load next.
---

# Edward Rules

This is the parent skill for Edward's intern workflow.

Keep this skill small. Do not paste every rule here. Route to the right child skill or reference only when needed.

## Core Rule

Codex is the primary driver. Edward is escalation.

Default answer:

```text
Did you ask Codex? What did Codex say?
```

## Question Router

- Technical/repo question: ask Codex with full repo/task context first.
- Public technical question: ask Codex and make it check official docs or internet sources.
- Business/company/Edward-only context: ask Edward, but bring context, options, tradeoff, risk, and what Codex said.

## Load Order

At the start of a project task, load only:

1. this skill
2. the current project's `PROJECT.md`, if one exists
3. recent relevant Decision Notes under that project's `decisions/`
4. `AGENTS.local.md`, if it exists

Do not load every reference file up front.

## Child Skills

Use child skills only when their moment comes:

- `edward-decision-capture`: before PR/final summary, or when Edward made a reusable decision.
- `edward-escalation`: when Codex/intern still needs Edward.
- `edward-project-notes`: when creating/updating `PROJECT.md` or decision files.
- `edward-intern-coach`: when an intern asks broad "what do I do?" direction questions.

## Detailed References

Read these only when needed:

- `references/default-stack.md`: stack and architecture defaults.
- `references/tooling.md`: CLI/MCP/app tool stack.
- `references/database.md`: Supabase/Postgres/database rules.
- `../../docs/COCKPIT.md`: BLI Cockpit event contract for intern work.

## Always

- Ask Codex first with full context.
- Understand options before escalating.
- Use `gstack investigate` before saying stuck.
- Use `gstack ship` for PR/review/shipping.
- For BLI Cockpit-managed work, verify active ticket context and emit lifecycle events when tooling is available.
- Prefer Postgres before adding Redis/vector DB/new infra.
- Never use Supabase SQL editor for team database changes.
- Do not delete working code casually.
- Ask Edward before destructive DB/data/code changes or major architecture changes.
