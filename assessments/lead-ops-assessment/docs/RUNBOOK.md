# Lead Ops Assessment Runbook

Status: candidate-safe
Candidate export: included

## Problem

Candidates and reviewers need the package to run locally without private services, real credentials, or tribal setup knowledge.

## Standard

Run the assessment from `assessments/lead-ops-assessment/` with Node/npm commands only. All integrations are fake and fixture-backed. The app must not require real customer data, real env files, real external API accounts, OAuth setup, or live network access.

## Reason

The assessment should measure engineering judgment, not setup endurance or access to vendor accounts.

## Procedure

From this directory:

```bash
npm install
npm run typecheck
npm run test:public
npm run build
npm run dev
```

Use `.env.example` as documentation for placeholder config names. Do not create or commit real env files.

## Local Data

The repository uses deterministic fake data:

- Webhook fixture payloads for lead creation, malformed payloads, duplicate provider delivery, and partial updates.
- CRM fixture responses for success, conflict, validation failure, rate limit, and server error.
- Local queue and DLQ state for worker tests and demos.

Reset local test/demo state with the reset command provided by the app implementation.

## Operating The App

Expected local surfaces:

- Lead list page.
- Lead detail page.
- Failed jobs page.
- Webhook route or local webhook simulation helper.
- CRM sync worker command.

Candidate workflow:

1. Install dependencies.
2. Run public verification commands.
3. Inspect the webhook, merge, queue, CRM retry, DLQ, and ops UI flow.
4. Choose targeted fixes and add regression tests.
5. Review the fake intern patches in `review/`.
6. Complete `AI_USAGE.md`, `ASSESSMENT.md`, and `review/FINAL_REVIEW.md`.

## Fake Integrations

Webhook signatures use local placeholder values documented in `.env.example`. They are not real secrets.

CRM behavior is fixture-backed. The fake CRM adapter must never call a real CRM or require a real account.

## Safety Rules

- Do not add `.env` or `.env.*` files except `.env.example`.
- Do not paste real customer data into fixtures, tests, docs, screenshots, or submissions.
- Do not connect the app to real external API accounts.
- Do not store reviewer-only files in candidate submissions.

## Troubleshooting

If install fails, record the Node and npm versions and the exact command output.

If public tests fail before candidate changes, reset local data and rerun:

```bash
npm run test:public
```

If the worker appears idle, check for queued CRM sync jobs and run the worker command documented by the implementation.
