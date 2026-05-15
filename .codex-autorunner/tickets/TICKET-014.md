---
title: "Run final end-to-end QA and readiness review"
agent: "codex"
done: true
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

- `python3 .codex-autorunner/bin/lint_tickets.py`: `OK: 14 ticket(s) linted.`
- `npm install`: audited 165 packages, found 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm run test:public`: 7 test files passed, 28 tests passed.
- `npm run build`: passed; Vite built 35 modules.
- `npm run reviewer:verify-baseline`: hidden baseline verification passed with exactly 5 expected hidden failures.
- `npm run reviewer:verify-answer-key`: temporary-copy answer-key verification passed; hidden verification passed 5/5.
- `bash scripts/export-candidate-package.sh`: candidate export created.
- `bash scripts/verify-candidate-export.sh`: candidate export verified after `npm ci`, `npm run typecheck`, and `npm run test:public`.
- `test -f docs/READINESS_REPORT.md`: passed.

Final export path:

```text
/Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment/tmp/candidate-exports/lead-ops-assessment-candidate-20260515T193217Z
```

Runtime note: Cockpit binding was unavailable in this fallback shell because `BLI_ACTIVE_TICKET` was unset, operator JWT was absent, and `bli-event` was missing. The dispatch file from the prompt was also absent, so this ticket file remained the control plane.
