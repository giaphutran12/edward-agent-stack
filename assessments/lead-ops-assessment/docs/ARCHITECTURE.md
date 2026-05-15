# Lead Ops Assessment Architecture

Status: locked for implementation
Audience: reviewer-only implementation reference
Candidate export: excluded

## Problem

The assessment needs enough architecture to expose cross-boundary failures without turning into a distributed-systems setup exercise.

## Standard

Use a single TypeScript app workspace with two local runtime entrypoints:

- Web/API entrypoint for the ops UI and webhook route.
- Worker entrypoint for CRM sync jobs and DLQ movement.

All integrations are fake and fixture-backed. No code path may require real customer data, real env files, real external API accounts, live webhooks, or live CRM network calls.

## Reason

One repo and local fixtures keep the take-home portable. Separate web/API and worker entrypoints still force candidates to reason about async state, retries, failed jobs, and operator visibility.

## Procedure

The required workflow is:

```text
webhook -> normalize -> merge/assign -> enqueue CRM sync -> retry/DLQ -> ops UI
```

Implementation should keep each step testable as a pure module first, then wire it into route or worker entrypoints.

## System Components

| Component | Files | Responsibility |
| --- | --- | --- |
| Webhook route | `src/server/routes/webhook.ts` | Accept inbound lead events, verify fake signature, call normalization, persist inbox event, mutate lead, enqueue CRM sync. |
| Signature helper | `src/integrations/leadSourceSignature.ts` | Verify HMAC-style signatures from `.env.example` placeholder names only. |
| Normalizer | `src/domain/normalization.ts` | Convert fake provider payloads into canonical lead change objects. |
| Lead merge | `src/domain/leadMerge.ts` | Merge inbound data into local lead state and preserve product invariants. |
| Assignment | `src/domain/assignment.ts` | Assign owner/status and record audit entries. |
| Repository | `src/repository/repository.ts` | Store deterministic local state for leads, inbound events, jobs, DLQ, and audit entries. |
| Transaction helper | `src/repository/transaction.ts` | Keep lead write and CRM sync enqueue atomic. |
| Queue | `src/jobs/queue.ts` | Create and read CRM sync jobs. |
| CRM adapter | `src/integrations/fakeCrmClient.ts` | Return fixture-backed fake CRM responses: `200`, `409`, `422`, `429`, and `500`. |
| Retry policy | `src/jobs/retryPolicy.ts` | Classify retryable and terminal failures, schedule retry, or send to DLQ. |
| Worker | `src/jobs/crmSyncWorker.ts` | Process `crm_sync` jobs without real network access. |
| Ops UI | `src/app/pages/*` | Show leads, lead detail, and failed jobs. |
| Public tests | `tests/public/` | Candidate-safe tests that pass on baseline. |
| Hidden tests | `reviewer/hidden-tests/` | Reviewer-only tests for seeded bug coverage. |

## Runtime Flow

1. Lead source sends a fake fixture payload to the webhook route.
2. Route verifies signature using local placeholder config from `.env.example`.
3. Route persists an inbound event record for traceability.
4. Normalizer produces a canonical lead change.
5. Merge logic updates or creates the lead.
6. Assignment logic sets owner/status and writes audit entries.
7. Transaction helper commits lead write and CRM sync enqueue together.
8. Worker reads pending `crm_sync` jobs.
9. Fake CRM adapter returns deterministic fixture response.
10. Retry policy marks the job complete, schedules retry, or moves it to DLQ.
11. Ops UI reads leads and failed jobs from the local repository.

## Data Model

Use deterministic in-process or file-backed fixtures; no external database is required for V1.

Required entities:

- `Lead`: id, source keys, email, phone, name, company, owner, lifecycle status, timestamps, last inbound event id, CRM remote id.
- `InboundEvent`: provider, provider event id, received at, signature result, raw payload, normalized result, replay marker.
- `CrmSyncJob`: id, lead id, operation, status, attempt count, next run at, last response code, last error, created at, updated at.
- `DeadLetterJob`: id, original job id, lead id, terminal reason, response code, payload snapshot, created at.
- `AuditEntry`: id, lead id, actor, action, before/after summary, created at.

Recommended job statuses:

- `pending`
- `in_progress`
- `retry_scheduled`
- `completed`
- `dead_lettered`

The worker must write terminal poison jobs as `dead_lettered`. The reviewer-only hidden UI test must assert the ops UI shows those jobs.

## Boundary Rules

Webhook boundary:

- Verify a fake shared-secret signature.
- Reject malformed payloads.
- Preserve raw inbound payload for debugging.
- Normalize duplicate provider delivery deterministically.
- Do not call real external webhook providers.

CRM boundary:

- Use fixture-backed responses only.
- Support fake `200`, `409`, `422`, `429`, and `500` responses.
- Model local-vs-remote mismatch and field mapping drift through fixtures.
- Do not call a real CRM, create OAuth apps, or store CRM credentials.

Async boundary:

- Queue `crm_sync` jobs after lead mutation.
- Keep lead write plus enqueue atomic.
- Retry transient failures.
- DLQ terminal or poison failures.
- Show DLQ jobs to operators.

## Seeded Failure Map

This section is reviewer-only. Candidate-facing docs must not name these seeded bug answers.

| Seeded bug | Boundary | Expected hidden-test signal |
| --- | --- | --- |
| Webhook idempotency uses wrong key | Webhook | Duplicate provider replay creates duplicate CRM sync work. |
| Partial `null` update overwrites non-null data | Merge | Existing phone/email is lost. |
| Worker retries terminal `422` | CRM retry | Job does not move to DLQ. |
| UI filters wrong terminal status | Ops UI | `dead_lettered` jobs are hidden. |
| `Retry-After` seconds treated as milliseconds | CRM retry | `429` retry is scheduled too soon. |

## Candidate-Safe vs Reviewer-Only Architecture

Candidate-safe files may describe the workflow, local commands, fake integrations, and deliverables. They must not reveal hidden-test names, expected failures, model solution details, or exact seeded bug locations.

Reviewer-only files may contain seeded bug maps, hidden tests, scoring rubrics, expected findings, export verification, and model solution patches. These files must be excluded by `docs/EXPORT_POLICY.md` and by export scripts.

## Verification Commands

Architecture is not complete until these commands exist and pass at the right phase:

```bash
cd assessments/lead-ops-assessment
npm install
npm run typecheck
npm run test:public
npm run build
npm run reviewer:verify-baseline
npm run reviewer:verify-answer-key
bash scripts/export-candidate-package.sh
bash scripts/verify-candidate-export.sh
```

Reviewer commands may fail before their implementation tickets are complete. Final QA must run the full list.
