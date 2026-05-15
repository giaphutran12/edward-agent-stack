# Submission Checklist

Status: candidate-facing

## Problem

Reviewers need one consistent package from every candidate: focused code, regression tests, written system reasoning, AI disclosure, and intern PR review judgment.

## Standard

Run every required command from `assessments/lead-ops-assessment/`. If a command fails, fix the issue or record the exact failure and why you are submitting anyway.

## Required Commands

Run these before submitting:

```bash
npm install
npm run reset
npm run typecheck
npm run test:public
npm run build
```

Run this worker command if your fix touches CRM sync, retry, dead-letter, or job visibility behavior:

```bash
npm run worker:crm-sync -- --scenario=success --now=2026-05-16T01:00:00.000Z --max-jobs=1
```

Run this command if you need to inspect the UI:

```bash
npm run dev
```

## File Checklist

- `ASSESSMENT.md` explains the system, targeted fixes, regression test coverage, tradeoffs, and delegation plan.
- `AI_USAGE.md` discloses AI use. AI tools are allowed, but disclosure is required.
- `review/FINAL_REVIEW.md` contains your intern PR review decision.
- Code changes are limited to one or two targeted fixes.
- Regression tests are included for changed behavior.
- No real `.env` files, customer data, external service credentials, answer keys, hidden tests, or reviewer-only material are included.

## Final Check

Paste the command results or a concise pass/fail summary into `ASSESSMENT.md` before submitting.
