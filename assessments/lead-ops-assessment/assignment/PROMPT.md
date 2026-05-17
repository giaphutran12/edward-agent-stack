# Lead Ops Take-Home Assignment

Status: candidate-facing
Expected timebox: 3 to 4 hours

## Problem

You are joining an inherited lead operations tool. The app receives fake lead-source webhooks, normalizes and merges leads, queues CRM sync work, retries or dead-letters failed jobs, and gives operators a small UI for lead and job visibility.

The goal is to show how you understand a system, improve it safely, test regressions, review intern work, and decide what should happen next.

## Standard

Work in your private candidate repo. Keep the change focused. Do not try to rewrite the whole app or fix every possible issue.

AI tools are allowed, but you must disclose how you used them in `AI_USAGE.md`. You own the final answer, code, tests, and review judgment.

## Deliverables

1. Write a system explanation in `ASSESSMENT.md`.
   Explain the current flow from webhook intake through CRM sync and operator visibility. Name the invariants you think matter most.

2. Implement one or two targeted fixes.
   Choose fixes with clear product or operational value. Keep each fix small enough that a reviewer can understand it quickly.

3. Add regression tests.
   Add at least one regression test for each behavior you change. Public tests should still pass.

4. Review the intern PRs.
   Review the open `Intern A` and `Intern B` pull requests in your private repo. If your repo does not have those PRs, use the matching fallback materials in `review/`. Complete `review/FINAL_REVIEW.md` with a real approve, request-changes, or block decision and the reasoning behind it.

5. Write a follow-up delegation plan.
   In `ASSESSMENT.md`, list what you would delegate next, what you would keep yourself, and the acceptance checks for that work.

6. Complete the AI disclosure.
   Fill out `AI_USAGE.md`, even if you did not use AI tools.

## Procedure

Start from `assessments/lead-ops-assessment/` and use the commands in `assignment/SUBMISSION_CHECKLIST.md`.

Use `.env.example` only as documentation. Do not create real env files, connect real vendor accounts, paste customer data, or add live network dependencies.

## Submission

Submit:

- code changes for your one or two targeted fixes
- regression tests for those fixes
- completed `ASSESSMENT.md`
- completed `AI_USAGE.md`
- completed `review/FINAL_REVIEW.md`

Do not include reviewer-only hidden tests, answer keys, model solutions, or any material from another candidate.
