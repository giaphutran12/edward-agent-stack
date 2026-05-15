---
title: "Implement inbound webhook integration with seeded idempotency flaw"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_004_webhook"
---

## Goal

Implement the inbound lead-source webhook path with signature verification, normalization, persistence, and a deliberate idempotency flaw.

## Context

The candidate must be able to discover that duplicate provider delivery can create duplicate sync work. The baseline should still pass public happy-path tests.

## Required Work

- Add webhook route or handler for inbound lead events.
- Verify a shared-secret signature using `.env.example` placeholder names.
- Normalize fixture payloads into canonical lead changes.
- Persist raw inbox events.
- Enqueue CRM sync jobs after lead mutation.
- Seed the intentional bug: duplicate detection must use the wrong key so replay can duplicate work.
- Document the flaw only in reviewer-only answer key later, not candidate docs.

## Acceptance Criteria

- Happy-path webhook test passes.
- Invalid signature test passes.
- Malformed payload test passes.
- Hidden replay test can fail against baseline because duplicate delivery is not correctly idempotent.
- No real secrets are required.

## Verification

```bash
cd assessments/lead-ops-assessment
npm run test:public -- --run webhook
npm run typecheck
```

## Completion Evidence

Record public test output and note the seeded flaw exists for hidden tests.

- `npm run test:public -- --run webhook` passed from `assessments/lead-ops-assessment`: 6 test files passed, 14 tests passed.
- `npm run typecheck` passed from `assessments/lead-ops-assessment`.
- Seeded flaw exists for hidden replay coverage: duplicate detection checks the generated inbox event id against stored provider event ids, so replayed provider deliveries can create duplicate CRM sync work.
- Cockpit fallback context: `BLI_ACTIVE_TICKET`, operator JWT, `bli-event`, and `gstack` were not available in this shell, so this ticket file remained the control plane.
