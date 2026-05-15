---
title: "Implement lead merge and assignment with seeded null overwrite flaw"
agent: "codex"
done: false
ticket_id: "tkt_lead_ops_005_merge"
---

## Goal

Implement lead merge, assignment, and audit behavior with a deliberate partial-update flaw.

## Context

This tests whether candidates understand system state, data quality, and customer-impacting merge semantics.

## Required Work

- Add lead merge logic for existing lead updates.
- Add assignment state and assignment audit entries.
- Add product rules for email, phone, owner, status, and source priority.
- Seed the intentional bug: partial inbound updates with `null` phone/email overwrite existing non-null values.
- Keep public tests focused on happy path and obvious assignment behavior.

## Acceptance Criteria

- Public merge happy-path tests pass.
- Assignment audit tests pass.
- Hidden stale/partial-update tests can fail against baseline.
- Code is readable enough that candidate can trace the bug within the timebox.

## Verification

```bash
cd assessments/lead-ops-assessment
npm run test:public -- --run merge
npm run test:public -- --run assignment
npm run typecheck
```

## Completion Evidence

Record public test output and the files where merge semantics live.
