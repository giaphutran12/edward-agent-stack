---
title: "Run final end-to-end QA and readiness review"
agent: "codex"
done: false
ticket_id: "tkt_lead_ops_014_final_qa"
---

## Goal

Prove the assessment package is ready for Edward to duplicate for candidates.

## Context

This is the final quality gate. Do not mark complete unless the candidate package, hidden tests, answer key, and export flow all work.

## Required Work

- Run ticket lint.
- Run candidate app install, typecheck, public tests, and build.
- Run reviewer baseline verifier.
- Apply or generate answer-key solution and prove hidden tests pass.
- Run candidate export and verify no reviewer files leak.
- Write `assessments/lead-ops-assessment/docs/READINESS_REPORT.md`.
- Update `.codex-autorunner/contextspace/active_context.md` with final status.

## Acceptance Criteria

- Ticket lint passes.
- Candidate baseline public tests pass.
- Hidden tests fail against baseline only in expected ways.
- Hidden tests pass against answer-key solution.
- Candidate export is clean and runnable.
- Readiness report includes exact commands and outputs.

## Verification

```bash
python3 .codex-autorunner/bin/lint_tickets.py
cd assessments/lead-ops-assessment
npm install
npm run typecheck
npm run test:public
npm run build
npm run reviewer:verify-baseline
npm run reviewer:verify-answer-key
bash scripts/export-candidate-package.sh
bash scripts/verify-candidate-export.sh
test -f docs/READINESS_REPORT.md
```

## Completion Evidence

Paste concise command results and final export path.
