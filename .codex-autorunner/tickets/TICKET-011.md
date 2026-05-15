---
title: "Write candidate prompt and submission templates"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_011_candidate_docs"
---

## Goal

Write the exact candidate-facing assignment package.

## Context

Edward wants one same question for every candidate with low mental tax and no cross-candidate visibility.

## Required Work

- Create `assignment/PROMPT.md`.
- Create `assignment/SUBMISSION_CHECKLIST.md`.
- Create `AI_USAGE.md` template.
- Create `ASSESSMENT.md` template.
- Create `review/FINAL_REVIEW.md` template for candidate PR review output.
- Make the prompt clear that AI tools are allowed but must be disclosed.
- Make deliverables timeboxed and concrete.

## Acceptance Criteria

- Candidate prompt asks for system explanation, one or two targeted fixes, regression tests, intern PR review, and follow-up delegation plan.
- Prompt states expected timebox.
- Prompt does not reveal answer key.
- Submission checklist names exact commands candidate should run.

## Verification

```bash
cd assessments/lead-ops-assessment
test -f assignment/PROMPT.md
test -f assignment/SUBMISSION_CHECKLIST.md
test -f AI_USAGE.md
test -f ASSESSMENT.md
test -f review/FINAL_REVIEW.md
rg -n "AI tools are allowed|timebox|intern PR|regression test|delegation" assignment AI_USAGE.md ASSESSMENT.md review/FINAL_REVIEW.md
```

## Completion Evidence

- Created `assessments/lead-ops-assessment/assignment/PROMPT.md`.
- Created `assessments/lead-ops-assessment/assignment/SUBMISSION_CHECKLIST.md`.
- Created `assessments/lead-ops-assessment/AI_USAGE.md`.
- Created `assessments/lead-ops-assessment/ASSESSMENT.md`.
- Created `assessments/lead-ops-assessment/review/FINAL_REVIEW.md`.
- Verified with:

```bash
cd assessments/lead-ops-assessment
test -f assignment/PROMPT.md
test -f assignment/SUBMISSION_CHECKLIST.md
test -f AI_USAGE.md
test -f ASSESSMENT.md
test -f review/FINAL_REVIEW.md
rg -n "AI tools are allowed|timebox|intern PR|regression test|delegation" assignment AI_USAGE.md ASSESSMENT.md review/FINAL_REVIEW.md
```

Runtime note: Cockpit binding was unavailable in this fallback session because `BLI_ACTIVE_TICKET`, `BLI_OPERATOR_JWT`, and `bli-event` were missing. The dispatch path from the prompt was also absent, and the active git branch was `codex/tkt_lead_ops_010_intern_b` rather than a TICKET-011 branch, so this ticket file was used as the control plane.
