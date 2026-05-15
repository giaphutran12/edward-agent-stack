# Candidate Assessment Write-Up

Status: candidate-facing template

Candidate name:

Submission date:

## 1. System Explanation

Explain the current system in your own words.

- Webhook intake:
- Lead normalization, merge, and assignment:
- CRM sync queue and worker:
- Retry, dead-letter, and operator visibility:
- UI surfaces:

Key invariants this system should protect:

-

## 2. Targeted Fixes

### Fix 1

Problem:

Change made:

Why this fix matters:

Files changed:

### Fix 2

Problem:

Change made:

Why this fix matters:

Files changed:

If you only made one fix, write `Not used` here.

## 3. Regression Tests

List each regression test you added and the behavior it protects.

- Test:
- Behavior protected:
- Why this would have caught the bug:

## 4. Verification

Record command results from `assignment/SUBMISSION_CHECKLIST.md`.

```text
npm install:
npm run reset:
npm run typecheck:
npm run test:public:
npm run build:
worker command, if relevant:
npm run dev, if used:
```

## 5. Product And Operational Tradeoffs

What tradeoffs did you make to keep the work inside the timebox?

-

What risk remains after your changes?

-

## 6. Follow-Up Delegation Plan

Use this delegation plan to show how you would lead the next round of work.

Work I would delegate:

- Task:
- Owner profile:
- Acceptance checks:
- Review risk:

Work I would keep myself:

-

What I would ask an intern to test or document next:

-

## 7. Notes For Reviewer

Anything else the reviewer should know:

-
