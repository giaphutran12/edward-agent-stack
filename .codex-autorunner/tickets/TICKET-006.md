---
title: "Implement CRM sync adapter and retry worker with seeded retry flaw"
agent: "codex"
done: false
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

Record commands and identify worker entrypoint.
