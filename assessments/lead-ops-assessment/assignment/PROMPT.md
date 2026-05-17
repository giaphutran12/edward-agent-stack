# Lead Ops Take-Home Assignment

Status: candidate-facing
Expected timebox: 3 to 4 hours

## Problem

You are joining an inherited lead operations tool. The app receives fake lead-source webhooks, normalizes and merges leads, queues CRM sync work, retries or dead-letters failed jobs, and gives operators a small UI for lead and job visibility.

The goal is to show how you understand a system, improve it safely, test regressions, review intern work, and decide what should happen next.

## Standard

Work in your private candidate repo. Keep code changes focused, but do not stop at the first bug you find. The reviewer is looking for your defect triage, prioritization, and ownership judgment as much as your patch.

AI tools are allowed, but you must disclose how you used them in `AI_USAGE.md`. You own the final answer, code, tests, and review judgment.

## Deliverables

1. Write a system explanation in `ASSESSMENT.md`.
   Explain the current flow from webhook intake through CRM sync and operator visibility. Name the invariants you think matter most.

2. Implement one or two targeted fixes.
   Choose fixes with clear product or operational value. At least one fix should touch backend correctness or data/queue behavior, and at least one fix should touch operator visibility or recovery. Keep each fix small enough that a reviewer can understand it quickly.

3. Complete `BUG_TRIAGE.md`.
   List at least five suspected defects or operational risks. Severity-rank them, cite evidence, and state whether each one was fixed, delegated, deferred, or rejected after investigation. This is required even if you only implement one or two fixes.

4. Add regression tests.
   Add at least one regression test for each behavior you change. Public tests should still pass.

5. Review the intern PRs.
   Review the open `Intern A` and `Intern B` pull requests in your private repo. If your repo does not have those PRs, use the matching fallback materials in `review/`. Complete `review/FINAL_REVIEW.md` with a real approve, request-changes, or block decision and the reasoning behind it.

   If an automated reviewer has already commented on a PR, treat it as one signal only. You still need to inspect the diff, explain the operational impact, and state the regression test or verification you would require.

6. Prepare for the onsite incident exercise.
   Read `incident/README.md` before the live follow-up. Complete `incident/INCIDENT_RESPONSE.md` only if the reviewer asks you to do the incident exercise. Treat Codex review as one input, not the final answer.

7. Write a follow-up delegation plan.
   In `ASSESSMENT.md`, list what you would delegate next, what you would keep yourself, and the acceptance checks for that work.

8. Complete the AI disclosure.
   Fill out `AI_USAGE.md`, even if you did not use AI tools.

## Procedure

Start from `assessments/lead-ops-assessment/` and use the commands in `assignment/SUBMISSION_CHECKLIST.md`.

Use `.env.example` only as documentation. Do not create real env files, connect real vendor accounts, paste customer data, or add live network dependencies.

## Submission

Submit:

- code changes for your one or two targeted fixes
- regression tests for those fixes
- completed `BUG_TRIAGE.md`
- completed `ASSESSMENT.md`
- completed `AI_USAGE.md`
- completed `review/FINAL_REVIEW.md`
- completed `incident/INCIDENT_RESPONSE.md`, if the reviewer assigned the incident exercise

Do not include reviewer-only hidden tests, answer keys, model solutions, or any material from another candidate.
