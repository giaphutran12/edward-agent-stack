---
title: "Create reviewer answer key and scoring rubric"
agent: "codex"
done: false
ticket_id: "tkt_lead_ops_012_answer_key"
---

## Goal

Create the private reviewer package that lets Edward grade quickly and consistently.

## Context

The answer key must make grading fast while staying out of candidate exports.

## Required Work

- Create `reviewer/ANSWER_KEY.md`.
- Create `reviewer/SCORING_RUBRIC.md`.
- Create `reviewer/EXPECTED_FINDINGS.md`.
- Create `reviewer/model-solution.patch` or equivalent answer-key branch instructions.
- Document expected fixes for each seeded bug.
- Document expected blocking/non-blocking comments for intern patches.
- Include score weights for code, system understanding, product judgment, leadership, verification, and AI judgment.

## Acceptance Criteria

- Rubric totals 100 points.
- Answer key maps each hidden test to the intended bug.
- Model solution can be applied or reproduced.
- Reviewer docs are excluded from candidate export.

## Verification

```bash
cd assessments/lead-ops-assessment
test -f reviewer/ANSWER_KEY.md
test -f reviewer/SCORING_RUBRIC.md
test -f reviewer/EXPECTED_FINDINGS.md
rg -n "100|idempotency|partial update|422|DLQ|intern-a|intern-b" reviewer
```

## Completion Evidence

Record reviewer files and scoring categories.
