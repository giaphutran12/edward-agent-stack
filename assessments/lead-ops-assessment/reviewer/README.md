# Reviewer Test Harness

Candidate export: excluded

## Problem

Reviewers need hidden tests that prove the seeded baseline bugs exist and later prove the answer-key solution fixes them. Candidates must receive only the public test contract.

## Standard

Keep hidden tests under `reviewer/hidden-tests/`. Run them only from the source reviewer tree, never from a candidate export. Use public tests for candidate-facing baseline verification and hidden verifier scripts for reviewer grading.

## Reason

The assessment remains fair only when candidates can run the same public tests while reviewers keep answer-checking tests private.

## Procedure

From `assessments/lead-ops-assessment/`:

```bash
npm run test:public
npm run reviewer:verify-baseline
npm run reviewer:verify-hidden
```

Use `npm run reviewer:verify-baseline` on the seeded candidate baseline. It expects the hidden tests to fail for the intended seeded bugs and exits successfully only when those expected failures are present.

Use `npm run reviewer:verify-hidden` on an answer-key or candidate solution tree. It expects all hidden tests to pass.

Do not copy `reviewer/`, `reviewer/hidden-tests/`, `scripts/verify-hidden-tests.mjs`, answer-key material, or model-solution material into candidate exports.
