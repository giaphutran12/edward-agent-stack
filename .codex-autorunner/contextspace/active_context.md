# Active Context

This repo now contains a Codex Autorunner queue for building the `lead-ops-assessment` take-home package.

Final state for TICKET-014:

- Branch: `codex/tkt_lead_ops_014_final_qa`
- Autorunner initialized under `.codex-autorunner/`
- Hub manifest registers this repo as `edward-clone`
- Runtime destination is local
- Ticket lint passes: `python3 .codex-autorunner/bin/lint_tickets.py`
- Repowise is installed but this checkout has zero indexed pages
- The candidate-safe assessment app is built under `assessments/lead-ops-assessment/`
- Baseline verification passes: `npm install`, `npm run typecheck`, `npm run test:public`, and `npm run build`
- Reviewer baseline verification passes with exactly five expected hidden failures: `npm run reviewer:verify-baseline`
- Answer-key verification passes in a temporary copy: `npm run reviewer:verify-answer-key`
- Candidate export verification passes: `bash scripts/export-candidate-package.sh` then `bash scripts/verify-candidate-export.sh`
- Final export path: `/Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment/tmp/candidate-exports/lead-ops-assessment-candidate-20260515T193217Z`
- Readiness report: `assessments/lead-ops-assessment/docs/READINESS_REPORT.md`
- Cockpit binding was unavailable in this fallback shell because `BLI_ACTIVE_TICKET` was unset, operator JWT was absent, and `bli-event` was not installed. The TICKET-014 file was used as the control plane.

Important constraints:

- Never read or create real env/secret files.
- Use `.env.example` only.
- Keep reviewer answer key separate from candidate export.
- Keep all integrations fake and fixture-backed.
- Keep every ticket machine-testable.
- Use private per-candidate repo copies, not one shared PR target.

Final commands executed for TICKET-014:

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
