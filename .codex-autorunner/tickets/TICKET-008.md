---
title: "Add public tests and hidden-test harness"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_008_tests"
---

## Goal

Create the testing contract that makes the assessment machine-checkable for both candidate baseline and answer key.

## Context

Public tests should pass on the candidate baseline. Hidden tests should prove the seeded bugs exist and later prove the answer key fixes them.

## Required Work

- Add `npm run test:public`.
- Add reviewer-only hidden tests under `reviewer/hidden-tests/`.
- Add a verifier script that can run hidden tests against the current tree.
- Add a mode that expects hidden failures against the baseline.
- Document how hidden tests should be used by reviewers only.

## Acceptance Criteria

- Public tests pass on baseline.
- Hidden tests fail on baseline for the intended seeded bugs.
- Hidden verifier has an expected-failure mode for baseline validation.
- Hidden tests are excluded from candidate export.

## Verification

```bash
cd assessments/lead-ops-assessment
npm run test:public
npm run reviewer:verify-baseline
```

## Completion Evidence

Record count of public tests passed and count of expected hidden failures.

- `npm run test:public`: 28 public tests passed across 7 files.
- `npm run reviewer:verify-baseline`: 5 expected hidden failures observed across 5 hidden tests.
- Hidden tests live under `assessments/lead-ops-assessment/reviewer/hidden-tests/`; reviewer docs and export policy mark them reviewer-only and excluded from candidate export.
