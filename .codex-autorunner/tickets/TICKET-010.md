---
title: "Create fake intern PR patch B for ops visibility regression"
agent: "codex"
done: false
ticket_id: "tkt_lead_ops_010_intern_b"
---

## Goal

Create the second fake intern PR artifact: a UI/status cleanup that hides failed jobs or weakens operator visibility.

## Context

This tests product and leadership judgment. Strong candidates should catch that the PR makes failures harder to see.

## Required Work

- Create `review/intern-b-ui-polish.patch`.
- Create candidate-facing PR description for intern B.
- Patch should hide older failed jobs or rename terminal statuses inconsistently.
- Patch should include some harmless-looking UI cleanup so the risk is subtle.
- Add reviewer-only expected findings for intern B.

## Acceptance Criteria

- Patch applies cleanly to the candidate baseline.
- Patch introduces a real ops visibility regression.
- Candidate-facing PR description sounds like an intern's good-faith work.
- Reviewer notes identify expected coaching and request-changes language.

## Verification

```bash
cd assessments/lead-ops-assessment
git apply --check review/intern-b-ui-polish.patch
npm run reviewer:check-intern-b
```

## Completion Evidence

Record patch path and expected reviewer finding.
