---
title: "Add candidate export and duplication tooling"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_013_export"
---

## Goal

Create scripts and docs that let Edward generate a clean candidate repo copy without reviewer-only material.

## Context

Edward wants one same question for everyone and isolated private repos so candidates cannot see each other's PRs.

## Required Work

- Add `scripts/export-candidate-package.sh` under `assessments/lead-ops-assessment/`.
- Add `scripts/verify-candidate-export.sh`.
- Add `docs/CANDIDATE_REPO_RUNBOOK.md`.
- Export must exclude `reviewer/`, hidden tests, model solution, and answer key.
- Export must include intern patch files and candidate-facing review templates.
- Document GitHub flow for one private repo per candidate.

## Acceptance Criteria

- Export creates a fresh candidate package under a generated output directory or archive.
- Verification script proves excluded reviewer files are absent.
- Verification script proves candidate package can install and run public tests.
- Runbook gives concrete private-repo duplication steps.

## Verification

```bash
cd assessments/lead-ops-assessment
bash scripts/export-candidate-package.sh
bash scripts/verify-candidate-export.sh
```

## Completion Evidence

- Export path: `/Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment/tmp/candidate-exports/lead-ops-assessment-candidate-20260515T192552Z`
- Verify command: `bash scripts/verify-candidate-export.sh`
- Verify output: `npm ci` completed with 0 vulnerabilities, `npm run typecheck` passed, and `npm run test:public` passed with 7 test files and 28 tests.
- Exclusion checks passed: reviewer paths, hidden tests, answer key, scoring rubric, expected findings, model solution, reviewer npm scripts, real env filenames, `node_modules`, `dist`, `coverage`, and `tmp` were absent from the exported package before install verification.
