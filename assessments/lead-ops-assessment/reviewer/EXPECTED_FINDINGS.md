# Expected Findings

Candidate export: excluded

## Problem

Reviewer calibration needs one private source of truth for the blocking findings expected from fake intern PR review work.

## Standard

Use these findings to grade whether a candidate catches correctness and operational safety regressions, not just style concerns.

## Reason

The fake intern patches are candidate-facing, but the answer key must stay reviewer-only so future candidates receive the same review exercise.

## Procedure

When grading an intern PR review, compare the candidate's comments against the expected blocking issue, impact, and requested change. Award credit for equivalent reasoning even if the wording differs.

## Intern A: Performance Cleanup During Lead Ingest

Expected verdict: block.

Expected blocking finding:

The patch removes the rollback guard from `LeadOpsRepository.writeLeadAndEnqueueCrmSync`. If `enqueueCrmSyncJob` throws after the lead and inbound event are written, the earlier mutations remain committed. That creates a partial write where the lead appears accepted but no matching CRM sync job exists.

Expected reviewer comment:

This should keep the lead write, inbound event, audit entries, and CRM enqueue as one all-or-nothing operation. Please keep the transaction helper or replace it with an equivalent atomic boundary, then add or keep a regression test that proves queue-enqueue failure leaves repository state unchanged.

Why it blocks:

A missing sync job is an operational correctness bug. Operators would see an accepted lead without downstream CRM work, and the retry/DLQ flow would have no job to recover.

## Intern B: UI Polish For Failed CRM Jobs

Expected verdict: block.

Expected blocking finding:

The patch narrows `FailedJobsPage` to only retry jobs inside a recent `nextRunAt` window. Older retry_scheduled failures remain unresolved but disappear from `Failed CRM Jobs` with no operator-visible escape hatch.

Expected reviewer comment:

This panel is an operational recovery queue, not just a recent activity feed. Please keep every unresolved failed CRM job visible by default, or add an explicit operator-controlled filter with counts and a "show all" path. Keep status copy human-readable only if the canonical failed state remains inspectable.

Why it blocks:

Hiding older retry jobs makes stale CRM sync failures look resolved. Operators can miss accounts that still need recovery, escalation, or DLQ investigation.
