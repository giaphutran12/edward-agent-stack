# Reviewer Answer Key

Candidate export: excluded

## Problem

Reviewers need one private map from hidden tests to intended bugs so grading is fast and consistent without leaking answers into candidate exports.

## Standard

Grade equivalent fixes and reasoning, not exact wording. A passing solution should preserve public behavior, pass reviewer hidden verification, and explain the operational impact of each fix.

## Reason

The assessment measures cross-boundary judgment. The same symptoms can be fixed in more than one valid way, but the expected outcome is stable: duplicate webhooks are idempotent, partial updates preserve trusted data, terminal CRM failures go to DLQ, retry timing respects provider units, and operators can see failed work.

## Procedure

From `assessments/lead-ops-assessment/`:

```bash
npm run test:public
npm run reviewer:verify-baseline
git apply --check reviewer/model-solution.patch
git apply reviewer/model-solution.patch
npm run typecheck
npm run test:public
npm run reviewer:verify-hidden
```

Use `npm run reviewer:verify-baseline` only on the seeded baseline. Use `npm run reviewer:verify-hidden` on a candidate solution or model-solution branch.

## Hidden Test Map

| Hidden test | Intended bug | Expected fix |
| --- | --- | --- |
| `reviewer/hidden-tests/webhook-idempotency.hidden.test.ts` / `webhook idempotency hidden tests deduplicates repeated provider deliveries by provider event id` | Webhook idempotency checks the generated inbound event id instead of the provider event id, so duplicate provider deliveries enqueue duplicate CRM sync jobs. | Detect replay by provider event id before enqueueing CRM work. Return `replay: true` for duplicates and preserve a single CRM job for the lead. |
| `reviewer/hidden-tests/lead-merge.hidden.test.ts` / `lead merge hidden tests preserves trusted contact fields when a partial provider update sends nulls` | Partial update payloads with `null` contact fields overwrite existing trusted phone or email. | Treat `undefined` and `null` contact values in provider updates as "no replacement" for existing leads. Preserve existing non-null email and phone. |
| `reviewer/hidden-tests/crm-worker.hidden.test.ts` / `CRM worker hidden tests moves terminal CRM validation failures to the DLQ without retrying` | Retry policy retries all 4xx responses, including terminal `422` validation failures. | Classify `422` as non-retryable, mark the job `dead_lettered`, and add a DLQ record with response evidence. |
| `reviewer/hidden-tests/crm-worker.hidden.test.ts` / `CRM worker hidden tests treats Retry-After header values as seconds when scheduling rate-limit retries` | Retry policy treats numeric `Retry-After` values as milliseconds. | Convert numeric `Retry-After` seconds to milliseconds before computing `nextRunAt`. |
| `reviewer/hidden-tests/ops-ui.hidden.test.tsx` / `ops UI hidden tests surfaces dead-lettered CRM sync jobs for operator recovery` | Failed jobs UI omits `dead_lettered` CRM sync jobs, so terminal failures disappear from operator recovery. | Include `dead_lettered` jobs in the failed jobs panel by default, or provide an explicit operator-visible filter that still surfaces DLQ work. |

## Expected Fix Notes

### Webhook Idempotency

Expected code area: `src/server/routes/webhook.ts` and repository inbound event lookup.

Acceptable fixes:

- Use `providerEventId` plus provider/source as the replay key.
- Avoid enqueueing a second CRM sync job for duplicate provider delivery.
- Keep response status `202` for accepted duplicate delivery and set `replay: true`.

Reject or penalize:

- Deduping by receive timestamp, generated inbound id, raw JSON string only, or lead id only.
- Dropping duplicate events by throwing `409` or `400` without preserving clear ingest semantics.
- Hiding the duplicate job by UI filtering while still enqueueing duplicate work.

### Partial Update Merge

Expected code area: `src/domain/leadMerge.ts`.

Acceptable fixes:

- Preserve existing email and phone when an inbound update omits the field or sends `null`.
- Continue allowing strong non-null inbound contact updates when source priority wins.
- Keep create behavior sane for new leads that genuinely have no contact field.

Reject or penalize:

- Blocking all provider updates after first write.
- Treating empty strings as trusted contact replacements without validation.
- Moving this rule into the UI instead of the domain merge path.

### CRM `422` And DLQ

Expected code area: `src/jobs/retryPolicy.ts` and `src/jobs/crmSyncWorker.ts`.

Acceptable fixes:

- Make terminal validation failures non-retryable.
- Move `422` jobs to `dead_lettered` on first attempt.
- Preserve response code and terminal reason in the DLQ entry.

Reject or penalize:

- Retrying all 4xx responses.
- Marking `422` completed.
- Dead-lettering without response evidence.

### Retry-After Units

Expected code area: `src/jobs/retryPolicy.ts`.

Acceptable fixes:

- Treat numeric `Retry-After` as seconds and multiply by `1000`.
- Keep a default retry delay when the header is missing or invalid.

Reject or penalize:

- Hard-coding exactly 30 seconds without reading the fixture/header.
- Scheduling immediate retry on rate limits.
- Moving rate-limit handling into the fake client instead of the retry policy.

### DLQ Operator Visibility

Expected code area: `src/app/pages/FailedJobsPage.tsx` and repository failed job query if changed.

Acceptable fixes:

- Show `retry_scheduled` and `dead_lettered` jobs by default.
- If labels are humanized, preserve access to the canonical status or an equivalent terminal-state signal.
- Keep empty, loading, and error states intact.

Reject or penalize:

- Hiding terminal jobs behind no default path.
- Showing only recent failures without counts or a "show all" path.
- Treating DLQ as resolved work.

## Intern Review Key

Use `reviewer/EXPECTED_FINDINGS.md` for detailed review calibration.

- `intern-a`: expected verdict is block because removing rollback creates partial lead/event/audit writes without CRM sync work.
- `intern-b`: expected verdict is block because hiding old retry or DLQ work breaks the operator recovery queue.

Non-blocking comments may receive credit only when the candidate also identifies the blocking operational risk.

## Model Solution

`reviewer/model-solution.patch` is an apply-ready model patch from the seeded baseline. Equivalent answer-key branches are acceptable if they reproduce the same behavior and pass hidden verification.

The patch is reviewer-only and must never be copied into candidate exports.
