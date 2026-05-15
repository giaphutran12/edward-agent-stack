# Project Notes: Lead Ops Assessment

Last updated: 2026-05-16
Freshness: current as of local repo state
Owner: Edward Tran

## Goal

Build a repeatable private take-home assignment repo for a high-ownership AI-native full-stack delivery lead who can build systems, understand inherited systems, make product calls, and review intern work.

## Current Priority

Use Codex Autorunner to build the whole package end to end:

- candidate-safe lead-ops app
- fake integrations and async worker
- seeded bugs
- fake intern PR patches
- public tests
- hidden reviewer tests
- answer key and scoring rubric
- candidate export/duplication flow

## Stack

- Frontend: Vite + React + TypeScript app in `assessments/lead-ops-assessment/`
- Backend: pure TypeScript route/domain/job modules and fake fixture-backed integrations
- Database: deterministic local fixture/repository layer, no real external database required
- Jobs: local fake queue and DLQ worker
- Deploy: not required for V1; package must run locally and export clean candidate copies
- Tests: Vitest public test suite under `tests/public/`

## Known User Pain

Edward needs the assessment fast and does not want to manually babysit every implementation detail. The final package must be machine-testable and easy to duplicate into private per-candidate repos.

## Ask Edward Before

- Adding real external vendor accounts or OAuth.
- Adding real customer data.
- Making candidates use one shared repo.
- Expanding into multi-service deployment.
- Changing the assessment away from lead operations and intern PR review.

## Gotchas

- Complexity should come from cross-boundary correctness, not random vendor count.
- Candidate export must never include reviewer answer key, hidden tests, model solution, or other candidate submissions.
- Public tests should pass on the candidate baseline; hidden tests should fail against baseline only in expected ways and pass against the answer key.
- Use `.env.example` only. Do not create real env files.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-decision-capture/SKILL.md`

## Recent Decisions

- `decisions/2026-05-16-lead-ops-assessment-autorunner.md`
- `decisions/2026-05-16-file-boundaries-and-export-policy.md`

## Stale Or Uncertain Info

- TICKET-002 scaffold is complete.
- TICKET-003 deterministic data modeling is complete: seeded leads, inbound events, CRM sync jobs, DLQ jobs, audit entries, fixture-backed reset command, and atomic lead write plus CRM enqueue are in place.
- Future tickets still need to flesh out seeded flaws, candidate prompts, reviewer-only materials, export tooling, and final readiness checks.
