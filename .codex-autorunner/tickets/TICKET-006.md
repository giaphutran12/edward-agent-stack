---
title: "Implement CRM sync adapter and retry worker with seeded retry flaw"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_006_crm_worker"
---

## Goal

Implement outbound CRM sync plus worker retry/DLQ behavior with one deliberate retry-classification flaw.

## Context

The best candidates should distinguish retryable remote failures from terminal validation failures.

## Required Work

- Build fixture-backed CRM adapter.
- Support fake responses for 200, 409, 422, 429, and 500.
- Build `crm_sync` worker entrypoint.
- Build retry policy and DLQ behavior.
- Seed the intentional bug: worker retries all 4xx failures, including terminal 422 validation errors.
- Include a secondary bug around `Retry-After` seconds vs milliseconds if time allows.

## Acceptance Criteria

- Public tests prove 500 and 429 retry behavior.
- Public tests prove successful sync marks job complete.
- Hidden tests can fail because 422 should go to DLQ but baseline retries it.
- Worker can be run locally without real network.

## Verification

```bash
cd assessments/lead-ops-assessment
npm run test:public -- --run crm
npm run test:public -- --run worker
npm run typecheck
```

## Completion Evidence

Completed in branch `codex/tkt_lead_ops_006_crm_worker`.

Worker entrypoint:

```bash
cd assessments/lead-ops-assessment
npm run worker:crm-sync -- --scenario=success --now=2026-05-16T01:00:00.000Z --max-jobs=1
```

Implementation entrypoint file: `assessments/lead-ops-assessment/src/jobs/crmSyncWorker.ts`

Verification run:

```bash
cd assessments/lead-ops-assessment
npm run test:public -- --run crm
npm run test:public -- --run worker
npm run typecheck
npm run worker:crm-sync -- --scenario=success --now=2026-05-16T01:00:00.000Z --max-jobs=1
git diff --check
```

Notes:

- CRM adapter is fixture-backed and supports fake 200, 409, 422, 429, and 500 responses.
- Public tests cover successful sync, 429 retry scheduling, 500 retry scheduling, and exhausted 500 DLQ behavior.
- Intentional baseline flaws are seeded: the retry policy retries all 4xx responses including 422, and `Retry-After` seconds are treated as milliseconds.
- Cockpit event tooling was unavailable in this session: `BLI_ACTIVE_TICKET`, `BLI_OPERATOR_JWT`, and `bli-event` were missing.
