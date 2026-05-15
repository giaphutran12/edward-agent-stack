# Scoring Rubric

Candidate export: excluded

## Problem

Reviewers need a 100-point rubric that rewards working fixes, system understanding, product judgment, leadership, verification, and responsible AI use.

## Standard

Score the submitted implementation, write-up, tests, and intern PR review together. Award equivalent credit for valid alternate implementations that preserve the intended product behavior and operational safety.

## Reason

The role needs more than code changes. A strong candidate should trace failures across webhook ingestion, merge semantics, CRM retry/DLQ behavior, operator UI, and review leadership.

## Procedure

Use this scale after running public tests and any reviewer-only checks available to the reviewer. Do not reveal hidden tests, answer key material, or this rubric to candidates.

## Category Weights

| Category | Points |
| --- | ---: |
| Code correctness | 30 |
| System understanding | 20 |
| Product judgment | 15 |
| Leadership and intern review | 15 |
| Verification discipline | 10 |
| AI judgment | 10 |
| Total | 100 |

## Code Correctness: 30 Points

| Item | Points |
| --- | ---: |
| Fixes webhook idempotency so duplicate provider deliveries do not enqueue duplicate CRM jobs | 6 |
| Fixes partial update merge so `null` contact fields do not erase trusted email or phone | 5 |
| Fixes terminal `422` handling so validation failures move to DLQ with evidence | 6 |
| Fixes `Retry-After` unit handling for rate-limit retries | 5 |
| Fixes failed jobs UI so DLQ / `dead_lettered` jobs are operator-visible | 5 |
| Maintains existing public behavior, types, and local architecture without broad rewrites | 3 |

## System Understanding: 20 Points

| Item | Points |
| --- | ---: |
| Explains the full webhook to merge to queue to CRM to DLQ to UI lifecycle | 6 |
| Identifies why idempotency belongs at provider event boundary, not receive timestamp or UI layer | 4 |
| Explains partial update semantics and source trust tradeoffs | 3 |
| Distinguishes retryable provider failures from terminal validation failures | 3 |
| Connects DLQ visibility to operator recovery and customer/account impact | 3 |
| Keeps scope focused on fake fixture-backed local system | 1 |

## Product Judgment: 15 Points

| Item | Points |
| --- | ---: |
| Prioritizes correctness and recovery over cosmetic polish | 4 |
| Describes user/operator impact in concrete terms | 4 |
| Chooses fixes that preserve a simple candidate-local workflow | 3 |
| Avoids unnecessary infrastructure, vendor accounts, or real data | 2 |
| Keeps UI behavior inspectable and trustworthy under failure | 2 |

## Leadership And Intern Review: 15 Points

| Item | Points |
| --- | ---: |
| Blocks `intern-a` for loss of atomic lead write plus CRM enqueue behavior | 5 |
| Blocks `intern-b` for hiding unresolved retry or DLQ work from operators | 5 |
| Gives concrete requested changes and regression-test asks | 3 |
| Separates blocking correctness risks from non-blocking style or polish comments | 2 |

## Verification Discipline: 10 Points

| Item | Points |
| --- | ---: |
| Runs and reports `npm run test:public` or explains any local blocker | 2 |
| Adds or describes targeted regression tests for the fixed behaviors | 3 |
| Uses deterministic fixtures and avoids real env/secret files | 2 |
| Verifies TypeScript/build health where relevant | 1 |
| Provides concise evidence in the submission without leaking reviewer-only material | 2 |

## AI Judgment: 10 Points

| Item | Points |
| --- | ---: |
| Discloses AI usage honestly in `AI_USAGE.md` or submission material | 2 |
| Uses AI to accelerate investigation while independently validating code behavior | 3 |
| Reviews generated code for boundary, retry, and data-loss risks | 2 |
| Avoids pasting secrets, real customer data, or hidden reviewer material into AI tools | 2 |
| Names uncertainty or tradeoffs instead of overstating confidence | 1 |

## Score Bands

| Band | Meaning |
| --- | --- |
| 90-100 | Strong hire signal. Fixes core bugs, explains system tradeoffs, verifies well, and gives high-quality review feedback. |
| 75-89 | Solid signal. Most core behavior is correct, with minor gaps in explanation, tests, or review precision. |
| 60-74 | Mixed signal. Some important fixes or review findings are present, but at least one major boundary is weak. |
| 40-59 | Weak signal. Candidate finds surface issues but misses multiple operational correctness risks. |
| 0-39 | No hire signal for this role. Submission does not show reliable ownership of cross-boundary behavior. |

## Calibration Notes

Do not require candidates to match the model patch line for line. Do require them to preserve the product standard: idempotent ingest, safe partial update behavior, correct `422` and retry handling, DLQ visibility, and clear review leadership.
