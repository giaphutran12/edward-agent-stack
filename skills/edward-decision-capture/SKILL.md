---
name: edward-decision-capture
description: Use before opening a PR or ending a meaningful task to update Project Notes and Decision Notes from current task context and diff.
---

# Edward Decision Capture

Use this before PR/final summary, or whenever Edward made a reusable decision.

## Check

Read the current task context and diff. Ask:

- Did Edward make a reusable decision?
- Did project context change?
- Did we learn a gotcha future agents need?
- Did an Edward Rule apply or change?

## If Yes

Update the relevant Project Notes or create a Decision Note.

For BLI Cockpit-managed work, also emit `decision_record` with the same decision content when Cockpit tooling is available.

Decision Note template:

```text
Date:
Status: proposed | active | deprecated
Question:
Decision:
Why:
Applies to:
Tradeoff:
Risk / Blast Radius:
Revisit when:
Related Edward Rules:
Related Project Notes:
Source:
```

## Cross-Link

- Decision Note links the Edward Rule it follows.
- Decision Note links the Project Note it affects.
- Project Note links the Decision Note that changed it.
- Cockpit `decision_record` event links the PR or Decision Note when available.
- Edward Rule changes require Edward review.

## If No

Say:

```text
No note update needed: <short reason>
```
