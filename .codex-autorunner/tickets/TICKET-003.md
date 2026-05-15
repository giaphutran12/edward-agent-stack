---
title: "Build deterministic data model and fixtures"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_003_data"
---

## Goal

Create deterministic lead, inbox event, CRM sync job, and DLQ data models plus seed fixtures.

## Context

The app needs enough data complexity to force system reasoning, but no real database service or external account setup.

## Required Work

- Implement domain types for leads, inbound events, CRM sync jobs, dead-letter jobs, and audit entries.
- Implement a small deterministic repository layer with transaction-style helpers.
- Seed representative leads and jobs.
- Add fixtures for webhook payloads and CRM responses.
- Add a reset command for tests and local demos.

## Acceptance Criteria

- Data reset is deterministic.
- Fixtures include duplicate webhook delivery, partial update, CRM 422, CRM 429, and CRM 500.
- Repository layer exposes one atomic helper for lead write plus queue enqueue.
- Public tests prove seed/reset works.

## Verification

```bash
cd assessments/lead-ops-assessment
npm run test:public -- --run seed
npm run typecheck
```

## Completion Evidence

- Implemented deterministic data surface in `assessments/lead-ops-assessment/src/domain/types.ts`, `src/repository/fixtures.ts`, `src/repository/repository.ts`, and `src/repository/reset.ts`.
- Added canonical seed fixture `assessments/lead-ops-assessment/fixtures/repository/seed-state.json` with representative leads, inbound events, CRM sync jobs, DLQ jobs, and audit entries.
- Added local reset command `npm run reset` backed by `assessments/lead-ops-assessment/scripts/reset-demo-state.mjs`.
- Confirmed webhook/CRM fixture coverage for duplicate webhook delivery, partial update, CRM 422, CRM 429, and CRM 500.
- Added public seed tests for deterministic reset, required fixtures, and atomic lead write plus CRM enqueue rollback.
- Verification passed:
  - `npm run test:public -- --run seed`
  - `npm run typecheck`
