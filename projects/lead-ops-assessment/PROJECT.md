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
- TICKET-004 inbound webhook integration is complete: signed fake webhook payloads normalize into lead changes, raw accepted inbox events persist, lead mutation and CRM enqueue stay atomic, invalid signatures and malformed payloads are covered by public tests, and the intended replay idempotency flaw is seeded.
- TICKET-005 lead merge and assignment behavior is complete: existing lead updates merge through `src/domain/leadMerge.ts`, assignment state and audit entries live in `src/domain/assignment.ts`, webhook writes include assignment audit entries, public merge/assignment tests pass, and the intended partial `null` contact overwrite flaw remains seeded.
- TICKET-006 CRM worker behavior is complete: fixture-backed CRM responses cover 200, 409, 422, 429, and 500; `src/jobs/crmSyncWorker.ts` exposes the local `crm_sync` worker entrypoint through `npm run worker:crm-sync`; public CRM/worker tests cover success, 429/500 retries, and DLQ movement; the intended 422 retry-classification flaw and Retry-After seconds-as-milliseconds flaw are seeded.
- TICKET-007 operator UI is complete: `src/app/pages/` provides lead list, lead detail, and failed CRM job panels with loading, empty, and error states; public UI tests cover lead list, lead detail, and failed-job fixture rendering; the intended failed-job visibility flaw remains seeded by filtering UI-visible jobs with a status mismatch that hides DLQ jobs.
- Future tickets still need to flesh out remaining seeded flaws, candidate prompts, reviewer-only materials, export tooling, and final readiness checks.
