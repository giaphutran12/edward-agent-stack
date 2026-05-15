---
title: "Add candidate export and duplication tooling"
agent: "codex"
done: false
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

Record export path and verify output.
