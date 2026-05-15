---
title: "Build lead and failed-job operator UI with seeded visibility flaw"
agent: "codex"
done: true
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

No browser run was used, so no screenshots were recorded.

Cockpit fallback context:

- `.codex-autorunner/runs/38002d98-664c-4751-93d6-f42f91605093/DISPATCH.md` was missing.
- `BLI_ACTIVE_TICKET` was not set in the shell.
- `bli-event` was not available, so Cockpit lifecycle emits could not be sent.
- Work proceeded from this ticket file as the control plane per the ticket-first fallback prompt.

Implemented:

- Lead list page with selectable rows plus loading, empty, and error states.
- Lead detail page with selected lead fields plus loading, empty, and error states.
- Failed CRM jobs page with loading, empty, and error states.
- Failed-jobs UI status filtering remains mismatched with terminal DLQ state so hidden reviewer coverage can catch missing operator visibility.
- Public UI tests cover lead list, lead detail, page states, and failed-jobs fixture rendering.

Verification:

```bash
cd assessments/lead-ops-assessment
npm run test:public -- --run ui
# Test Files  7 passed (7)
# Tests  28 passed (28)

npm run build
# vite v7.3.3 building client environment for production...
# 35 modules transformed.
# built in 268ms

npm run typecheck
# tsc --noEmit
# exited 0
```
