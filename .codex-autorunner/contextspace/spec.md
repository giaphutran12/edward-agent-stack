# Lead Ops Take-Home Assessment Autorunner Spec

Updated: 2026-05-16
Status: Approved for ticket-flow implementation
Owner: Edward Tran

## North Star

Build a private, repeatable take-home assessment repo for a high-ownership AI-native full-stack delivery lead.

The assessment must test:

- real coding ability
- system-building ability
- system understanding
- product and operations judgment
- AI-era engineering judgment
- ability to review and coach intern work

The final result must let Edward duplicate or fork a candidate-safe repo for each candidate without leaking other candidates' submissions or the reviewer answer key.

## Core Product

Create a synthetic app named `lead-ops-assessment`.

It should be a believable inherited internal lead operations tool, not a toy algorithm. The system should be complex through cross-boundary workflow failure, not through random vendor count or setup pain.

Core workflow:

```text
Inbound lead webhook
  -> normalize inbound event
  -> merge or assign lead
  -> enqueue outbound CRM sync
  -> worker retries or dead-letters failed syncs
  -> operator sees leads and failed jobs
```

## Required Boundaries

Use two external-style boundaries plus one async boundary:

1. Inbound lead-source webhook
   - shared-secret signature verification
   - malformed payload handling
   - duplicate provider event replay
   - partial update payloads

2. Outbound CRM sync adapter
   - fixture-backed fake remote CRM
   - 200, 409, 422, 429, and 500 responses
   - field mapping drift
   - local-vs-remote state mismatch

3. Background job and DLQ worker
   - job queue
   - retry policy
   - poison jobs
   - failed-job visibility for operators

Optional harder boundary:

- read-only enrichment client with fixture-backed rate limits and nullable data. It must never be required for core correctness.

## Out Of Scope

- real OAuth
- real vendor accounts
- real customer data
- payments
- Slack bot behavior
- LLM features
- multi-service deployment sprawl
- microservice orchestration
- full CRM feature set

## Candidate-Safe Surface

Candidate export must include:

- app source
- seed data and fixtures
- public tests
- candidate prompt
- README and runbook
- fake intern PR patches or branches
- `AI_USAGE.md` template
- `ASSESSMENT.md` template
- `review/FINAL_REVIEW.md` template

Candidate export must not include:

- reviewer answer key
- hidden tests
- scoring rubric with expected findings
- model solution patch
- other candidates' submissions
- real env files or secrets

## Reviewer Surface

Reviewer-only material must include:

- answer key
- hidden tests
- scoring rubric
- model solution patch or branch
- per-bug expected evidence
- candidate export verification script
- per-candidate duplication/runbook

## Intended Seeded Bugs

Primary seeded bugs:

1. Webhook idempotency bug: dedupe uses receive timestamp or non-provider key, so duplicate delivery can create duplicate sync work.
2. Merge bug: partial inbound update with `null` phone/email overwrites newer non-null local data.
3. Retry bug: worker retries terminal 4xx CRM validation failures instead of dead-lettering them.

Secondary seeded bugs:

4. Failed-jobs UI reads a different status value than the worker writes, so operators cannot see poisoned jobs.
5. 429 `Retry-After` handling confuses seconds vs milliseconds.

## Fake Intern PR Review Track

Include two fake intern patches:

- `intern-a.patch`: performance cleanup removes transaction or atomicity around lead write plus queue enqueue.
- `intern-b.patch`: UI polish hides older failed jobs or renames status values, suppressing DLQ visibility.

Candidate must review the intern patches, write blocking/non-blocking comments, choose what they would fix directly, and choose what they would give back to the intern.

## Machine-Testable Standard

The final queue is not complete until all of these are true:

- `python3 .codex-autorunner/bin/lint_tickets.py` passes.
- candidate app has a one-command install and verification path.
- public tests pass on the candidate baseline.
- hidden tests fail against the candidate baseline for the expected seeded bugs.
- hidden tests pass against the answer-key solution.
- candidate export excludes reviewer-only files.
- candidate export can be copied into a fresh directory and run.
- docs explain how to create per-candidate private repos.
