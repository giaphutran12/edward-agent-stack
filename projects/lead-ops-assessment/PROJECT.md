# Project Notes: Lead Ops Assessment

Last updated: 2026-05-17
Freshness: current as of local repo state
Owner: Edward Tran

## Goal

Build a repeatable private take-home assignment repo for a high-ownership AI-native full-stack delivery lead who can build systems, understand inherited systems, make product calls, and review intern work.

## Current Priority

The V1 assessment package is ready for Edward to duplicate into private per-candidate repos, with one hardening pass after a blind-agent calibration run. Final QA passed for:

- candidate-safe lead-ops app
- fake integrations and async worker
- seeded bugs
- fake intern PR patches
- public tests
- hidden reviewer tests
- answer key and scoring rubric
- answer-key temp-copy verifier
- blind-agent no-pass calibration and tightened scoring gates
- `BUG_TRIAGE.md` candidate defect-discovery template
- candidate export/duplication flow
- readiness report

## Stack

- Frontend: Vite + React + TypeScript app in `assessments/lead-ops-assessment/`
- Backend: pure TypeScript route/domain/job modules and fake fixture-backed integrations
- Database: deterministic local fixture/repository layer, no real external database required
- Jobs: local fake queue and DLQ worker
- Deploy: not required for V1; package must run locally and export clean candidate copies
- Tests: Vitest public test suite under `tests/public/`; reviewer-only hidden suite under `reviewer/hidden-tests/` with `npm run reviewer:verify-baseline` for expected baseline failures and `npm run reviewer:verify-hidden` for solution verification.

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
- A candidate can implement only one or two targeted fixes, but must still discover and rank the broader defect set in `BUG_TRIAGE.md`.
- Do not treat automated Codex PR comments as enough for full review credit; require independent diff, code, evidence, impact, and test reasoning.
- Generated candidate exports under `assessments/lead-ops-assessment/tmp/` must stay excluded from Vitest discovery so root public-test counts remain deterministic.
- Use `npm run reviewer:verify-answer-key` to apply `reviewer/model-solution.patch` in a temporary copy; do not mutate the seeded baseline just to prove the answer key.
- Use `.env.example` only. Do not create real env files.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-decision-capture/SKILL.md`

## Recent Decisions

- `decisions/2026-05-16-lead-ops-assessment-autorunner.md`
- `decisions/2026-05-16-file-boundaries-and-export-policy.md`
- `decisions/2026-05-17-blind-agent-calibration.md`

## Stale Or Uncertain Info

- TICKET-002 scaffold is complete.
- TICKET-003 deterministic data modeling is complete: seeded leads, inbound events, CRM sync jobs, DLQ jobs, audit entries, fixture-backed reset command, and atomic lead write plus CRM enqueue are in place.
- TICKET-004 inbound webhook integration is complete: signed fake webhook payloads normalize into lead changes, raw accepted inbox events persist, lead mutation and CRM enqueue stay atomic, invalid signatures and malformed payloads are covered by public tests, and the intended replay idempotency flaw is seeded.
- TICKET-005 lead merge and assignment behavior is complete: existing lead updates merge through `src/domain/leadMerge.ts`, assignment state and audit entries live in `src/domain/assignment.ts`, webhook writes include assignment audit entries, public merge/assignment tests pass, and the intended partial `null` contact overwrite flaw remains seeded.
- TICKET-006 CRM worker behavior is complete: fixture-backed CRM responses cover 200, 409, 422, 429, and 500; `src/jobs/crmSyncWorker.ts` exposes the local `crm_sync` worker entrypoint through `npm run worker:crm-sync`; public CRM/worker tests cover success, 429/500 retries, and DLQ movement; the intended 422 retry-classification flaw and Retry-After seconds-as-milliseconds flaw are seeded.
- TICKET-007 operator UI is complete: `src/app/pages/` provides lead list, lead detail, and failed CRM job panels with loading, empty, and error states; public UI tests cover lead list, lead detail, and failed-job fixture rendering; the intended failed-job visibility flaw remains seeded by filtering UI-visible jobs with a status mismatch that hides DLQ jobs.
- TICKET-008 public and hidden testing contract is complete: `npm run test:public` passes 28 public tests on the baseline, `reviewer/hidden-tests/` covers all five intended seeded bugs, and `npm run reviewer:verify-baseline` expects exactly five hidden failures on the seeded baseline.
- TICKET-009 fake intern PR artifact A is complete: `review/intern-a-performance-cleanup.patch` presents a plausible performance cleanup that removes the rollback guard around lead write plus CRM enqueue, `review/intern-a-performance-cleanup.md` is candidate-facing, `reviewer/EXPECTED_FINDINGS.md` records the blocking expected finding, and `npm run reviewer:check-intern-a` verifies the artifact.
- TICKET-010 fake intern PR artifact B is complete: `review/intern-b-ui-polish.patch` presents a plausible failed-jobs UI cleanup that hides older unresolved retry jobs, `review/intern-b-ui-polish.md` is candidate-facing, `reviewer/EXPECTED_FINDINGS.md` records the blocking operator visibility finding, and `npm run reviewer:check-intern-b` verifies the artifact.
- TICKET-011 candidate-facing assignment docs are complete: `assignment/PROMPT.md`, `assignment/SUBMISSION_CHECKLIST.md`, `AI_USAGE.md`, `ASSESSMENT.md`, and `review/FINAL_REVIEW.md` define the timeboxed candidate workflow, AI disclosure requirement, exact verification commands, write-up template, and intern PR review output template without exposing reviewer-only answers.
- TICKET-012 reviewer answer-key package is complete: `reviewer/ANSWER_KEY.md`, `reviewer/SCORING_RUBRIC.md`, `reviewer/EXPECTED_FINDINGS.md`, and `reviewer/model-solution.patch` map hidden tests to seeded bugs, define a 100-point rubric, calibrate intern PR review findings, and provide an apply-ready model solution that remains excluded from candidate export. The CRM worker hidden tests now isolate seeded queue state before enqueuing verifier jobs, so model-solution verification targets the intended `422` and `Retry-After` bugs.
- TICKET-013 candidate export and duplication tooling is complete: `scripts/export-candidate-package.sh` creates a fresh candidate-safe package under `tmp/candidate-exports/`, strips reviewer-only npm scripts, generates a candidate `.gitignore`, and excludes reviewer-only files; `scripts/verify-candidate-export.sh` checks file boundaries and runs `npm ci`, `npm run typecheck`, and `npm run test:public` in a temporary verification copy; `docs/CANDIDATE_REPO_RUNBOOK.md` documents one private GitHub repo per candidate.
- TICKET-014 final readiness QA is complete: ticket lint, candidate install/typecheck/public tests/build, baseline hidden verifier, temporary-copy answer-key verifier, candidate export, export verification, and `docs/READINESS_REPORT.md` all pass. Final verified export path: `assessments/lead-ops-assessment/tmp/candidate-exports/lead-ops-assessment-candidate-20260515T193217Z`.
