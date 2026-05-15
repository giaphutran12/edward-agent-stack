---
title: "Build lead and failed-job operator UI with seeded visibility flaw"
agent: "codex"
done: false
ticket_id: "tkt_lead_ops_007_ui"
---

## Goal

Build the minimum UI needed for candidates and reviewers to inspect leads, lead detail, and failed jobs.

## Context

The UI is not a design contest. It exists to test operator visibility and end-to-end understanding.

## Required Work

- Add lead list page.
- Add lead detail page.
- Add failed-jobs page.
- Add basic loading, empty, and error states.
- Add links or buttons for local demo flows if useful.
- Seed the intentional bug: failed-jobs UI filters for the wrong terminal status, hiding DLQ jobs from operators.

## Acceptance Criteria

- Public UI or component tests pass for lead list and lead detail.
- Public test confirms failed-jobs page renders with simple fixture data.
- Hidden test can fail because DLQ jobs are hidden by the baseline status mismatch.
- UI text must not reveal the seeded bugs.

## Verification

```bash
cd assessments/lead-ops-assessment
npm run test:public -- --run ui
npm run build
npm run typecheck
```

## Completion Evidence

Record screenshots only if a browser run was used; otherwise record command output.
