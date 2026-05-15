# Expected Findings

Candidate export: excluded

## Problem

Reviewer calibration needs one private source of truth for the blocking and non-blocking findings expected from fake intern PR review work.

## Standard

Use these findings to grade whether a candidate catches correctness and operational safety regressions, not just style concerns.

## Reason

The fake intern patches are candidate-facing, but the answer key must stay reviewer-only so future candidates receive the same review exercise.

## Procedure

When grading an intern PR review, compare the candidate's comments against the expected blocking issue, impact, and requested change. Award credit for equivalent reasoning even if the wording differs.

Use these script names when checking artifacts:

- `npm run reviewer:check-intern-a`
- `npm run reviewer:check-intern-b`

## Quick Scoring Map

| Artifact | Expected verdict | Blocking risk | Non-blocking credit |
| --- | --- | --- | --- |
| `intern-a` performance cleanup | Block | Removes atomic rollback around lead write, inbound event, audit entries, and CRM enqueue. | Notes that performance concerns need measurement and can be solved without weakening all-or-nothing writes. |
| `intern-b` UI polish | Block | Hides unresolved retry or DLQ work from operator recovery. | Notes that human-readable status labels and sorting are acceptable only with a visible "show all" path and counts. |

## Intern A: Performance Cleanup During Lead Ingest

Expected verdict: block.

Expected blocking finding:

The patch removes the rollback guard from `LeadOpsRepository.writeLeadAndEnqueueCrmSync`. If `enqueueCrmSyncJob` throws after the lead and inbound event are written, the earlier mutations remain committed. That creates a partial write where the lead appears accepted but no matching CRM sync job exists.

Expected reviewer comment:

This should keep the lead write, inbound event, audit entries, and CRM enqueue as one all-or-nothing operation. Please keep the transaction helper or replace it with an equivalent atomic boundary, then add or keep a regression test that proves queue-enqueue failure leaves repository state unchanged.

Why it blocks:

A missing sync job is an operational correctness bug. Operators would see an accepted lead without downstream CRM work, and the retry/DLQ flow would have no job to recover.

Expected requested fix:

Keep `writeLeadAndEnqueueCrmSync` atomic. The implementation may keep the existing snapshot/restore guard or replace it with an equivalent transaction abstraction, but it must prove that enqueue failure leaves lead, inbound event, and audit state unchanged.

Expected blocking comment themes:

- Partial write after queue failure.
- Inbound accepted state without downstream CRM sync.
- Missing regression test around queue-enqueue failure.
- Performance claim not measured enough to justify correctness risk.

Acceptable non-blocking comments:

- Ask for a benchmark before optimizing snapshot allocation.
- Suggest narrowing clone scope or documenting the transaction boundary.
- Ask for clearer test names around atomic writes.

Do not give blocking-credit for:

- Style-only feedback.
- Approval because public tests pass.
- A vague "could be racey" comment without naming the missing rollback or lost CRM job.

## Intern B: UI Polish For Failed CRM Jobs

Expected verdict: block.

Expected blocking finding:

The patch narrows `FailedJobsPage` to only retry jobs inside a recent `nextRunAt` window. Older retry_scheduled failures remain unresolved but disappear from `Failed CRM Jobs` with no operator-visible escape hatch.

Expected reviewer comment:

This panel is an operational recovery queue, not just a recent activity feed. Please keep every unresolved failed CRM job visible by default, or add an explicit operator-controlled filter with counts and a "show all" path. Keep status copy human-readable only if the canonical failed state remains inspectable.

Why it blocks:

Hiding older retry jobs makes stale CRM sync failures look resolved. Operators can miss accounts that still need recovery, escalation, or DLQ investigation.

Expected requested fix:

Show all unresolved failed CRM work by default, including `retry_scheduled` and DLQ / `dead_lettered` jobs. If the UI adds labels, sorting, or recency filters, it must expose counts and an obvious path to every unresolved job.

Expected blocking comment themes:

- Recovery queue cannot hide older unresolved jobs.
- DLQ and terminal failures need operator visibility.
- Recency filtering needs an explicit user control and count.
- Public UI fixture coverage is too narrow to prove recovery behavior.

Acceptable non-blocking comments:

- Human-readable status labels can be useful if canonical state remains available.
- Newest-first sorting is fine after preserving complete visibility.
- Empty-state copy could distinguish "none failed" from "filtered out."

Do not give blocking-credit for:

- Color, spacing, or copy comments only.
- Approval because the simplified list looks cleaner.
- Feedback that asks for labels but misses hidden unresolved work.
