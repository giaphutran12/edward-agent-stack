# Edward Rules

Stable defaults for how Edward wants interns to think.

These rules should change rarely. If a PR changes this file, Edward should review it.

## Core Rule

Codex is the primary driver. Edward is escalation.

Most repeated answer:

```text
Did you ask Codex? What did Codex say?
```

## Route Questions

- Technical/repo question: ask Codex with full context first.
- Public technical question: ask Codex and make it check official docs or internet sources.
- Business/company/Edward-only context: ask Edward, but bring context, options, tradeoff, risk, and what Codex said.

## Default Stack

- Web app: Next.js.
- DB/auth/storage/default backend data: Supabase/Postgres.
- Background jobs: Inngest unless current project already has another pattern.
- Deploy: Vercel.
- Persistent always-on server/process: GCP or existing project infra.
- Cache/vector/search: Postgres first. Do not add Redis/vector DB unless evidence proves Postgres is insufficient.

## Database Rule

Never use Supabase SQL editor for team database changes.

Use Supabase CLI migrations/scripts so changes are reviewable, repeatable, and visible to agents.

## Debugging Rule

Use `gstack investigate` before saying "I'm stuck."

Bring:

- error/log/screenshot
- what changed
- reproduction steps
- what Codex found
- root cause candidate
- what was tested

## Shipping Rule

Use `gstack ship` for PR/review/shipping flow.

PRs should include:

- what changed
- why it matters
- how it was tested
- risk/blast radius
- screenshots/logs when useful
- whether Project Notes or Decision Notes changed

## Architecture Rule

Small and reversible: move.

Architecture/data/security/big product behavior: slow down and ask Edward if tradeoff is not obvious.

Ask Edward before:

- new database
- new queue
- new vector/search system
- major auth/security/access change
- destructive data/code change
- replacing stable architecture

## Deletion Rule

Do not delete working code or other people's work casually.

Prefer:

1. hide/disable old feature
2. build replacement
3. prove replacement works
4. delete old path later

## Evidence Rule

Do not trust agent hand-waving.

Ask:

- What is the source?
- What file/log/doc proves this?
- What did you test?
- What is the blast radius?
- Is it reversible?

## Learning Rule

New interns should watch Codex closely.

Read what Codex is doing. Stop it when it is wrong. Ask dumb questions until you can explain the work back clearly.
