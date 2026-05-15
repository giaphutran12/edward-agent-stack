---
title: "Lock assessment spec and file boundaries"
agent: "codex"
done: true
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

Created:

- `assessments/lead-ops-assessment/docs/SPEC.md`
- `assessments/lead-ops-assessment/docs/ARCHITECTURE.md`
- `assessments/lead-ops-assessment/docs/RUNBOOK.md`
- `assessments/lead-ops-assessment/docs/EXPORT_POLICY.md`
- `projects/lead-ops-assessment/decisions/2026-05-16-file-boundaries-and-export-policy.md`

Spec decisions changed from `.codex-autorunner/contextspace/spec.md`:

- No product-scope change. The source spec is now locked into concrete file boundaries and an implementation directory structure.
- `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/EXPORT_POLICY.md`, reviewer docs, hidden tests, model solution, export tooling, readiness report, `.codex-autorunner/`, and `projects/` are reviewer-only or build-control surfaces and must be excluded from candidate export.
- `docs/RUNBOOK.md`, app source, fixtures, public tests, candidate prompt/templates, AI disclosure template, assessment template, and fake intern patches are candidate-safe.
- All integrations remain fake and fixture-backed. The docs explicitly prohibit real customer data, real env files, and real external API accounts.
