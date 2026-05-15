---
title: "Lock assessment spec and file boundaries"
agent: "codex"
done: false
ticket_id: "tkt_lead_ops_001_spec"
---

## Goal

Create the authoritative product and implementation spec for the `lead-ops-assessment` take-home package.

## Context

The assessment must produce a candidate-safe repo package plus reviewer-only answer key. Complexity should come from the lead lifecycle crossing webhook, CRM sync, and async retry/DLQ boundaries.

## Required Work

- Create `assessments/lead-ops-assessment/docs/SPEC.md`.
- Create `assessments/lead-ops-assessment/docs/ARCHITECTURE.md`.
- Create `assessments/lead-ops-assessment/docs/RUNBOOK.md`.
- Create `assessments/lead-ops-assessment/docs/EXPORT_POLICY.md`.
- Define candidate-safe vs reviewer-only file boundaries.
- Define the final directory structure before implementation starts.
- Record that integrations are fake and fixture-backed.

## Acceptance Criteria

- Spec names the exact seeded bugs.
- Spec names the exact fake intern patches.
- Spec defines candidate export exclusions.
- Spec states no real customer data, no real env files, no real external API accounts.
- Architecture doc includes the workflow: webhook -> normalize -> merge/assign -> enqueue CRM sync -> retry/DLQ -> ops UI.

## Verification

```bash
test -f assessments/lead-ops-assessment/docs/SPEC.md
test -f assessments/lead-ops-assessment/docs/ARCHITECTURE.md
test -f assessments/lead-ops-assessment/docs/RUNBOOK.md
test -f assessments/lead-ops-assessment/docs/EXPORT_POLICY.md
rg -n "webhook.*CRM.*DLQ|candidate-safe|reviewer-only|seeded bug" assessments/lead-ops-assessment/docs
```

## Completion Evidence

Add paths created and any spec decisions changed from `.codex-autorunner/contextspace/spec.md`.
