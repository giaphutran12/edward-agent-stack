---
title: "Write candidate prompt and submission templates"
agent: "codex"
done: false
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

Record candidate-facing files created.
