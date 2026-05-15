# Decision: Use Codex Autorunner For Lead Ops Take-Home Assessment

Date: 2026-05-16
Status: active
Source: Edward conversation and `.codex-autorunner/` ticket queue

## Question

How should Edward turn the lead-ops take-home assessment idea into an executable build plan with minimal manual babysitting?

## Decision

Create a Codex Autorunner ticket queue in `.codex-autorunner/tickets/` that builds the assessment end to end from scaffold to final readiness report.

The queue should build a synthetic `lead-ops-assessment` package with:

- fake inbound webhook integration
- fake outbound CRM sync adapter
- local async queue and DLQ worker
- seeded bugs
- fake intern PR patches
- public tests
- hidden reviewer tests
- answer key and scoring rubric
- candidate export and private-repo duplication flow

## Why

Edward needs the take-home quickly and wants the work to be machine-testable. Codex Autorunner tickets let the PM/runner execute a clear ordered queue instead of relying on Edward to manually translate a broad idea into implementation tasks.

## Applies To

- `.codex-autorunner/contextspace/spec.md`
- `.codex-autorunner/contextspace/decisions.md`
- `.codex-autorunner/contextspace/active_context.md`
- `.codex-autorunner/tickets/TICKET-001.md` through `.codex-autorunner/tickets/TICKET-014.md`
- future `assessments/lead-ops-assessment/` files created by the ticket flow

## Tradeoff

This adds CAR scaffold files and a structured local ticket queue to the repo. The gain is a runnable, resumable implementation plan. The cost is more project machinery in the repo.

## Risk / Blast Radius

The ticket flow can generate a substantial new assessment package. Keep the candidate export boundary strict so reviewer materials do not leak. Keep integrations fake and fixture-backed so no secrets or real customer data enter the package.

## Revisit When

- Edward changes the role being assessed.
- The assessment needs to become domain-specific to PearlPortal.
- Candidates struggle more with setup than system reasoning.
- Hidden tests or answer key become brittle.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-decision-capture/SKILL.md`

## Related Project Notes

- `projects/lead-ops-assessment/PROJECT.md`
