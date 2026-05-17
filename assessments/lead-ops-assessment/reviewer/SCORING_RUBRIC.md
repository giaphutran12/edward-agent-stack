# Scoring Rubric

Candidate export: excluded

## Problem

Reviewers need a 100-point rubric that rewards working fixes, system understanding, product judgment, leadership, incident ownership, verification, and responsible AI use.

## Standard

Score the submitted implementation, write-up, tests, intern PR review, and incident response together. Award equivalent credit for valid alternate implementations that preserve the intended product behavior and operational safety.

## Reason

The role needs more than code changes. A strong candidate should trace failures across webhook ingestion, merge semantics, CRM retry/DLQ behavior, operator UI, vague broker complaints, rollout decisions, and review leadership.

## Procedure

Use this scale after running public tests and any reviewer-only checks available to the reviewer. Do not reveal hidden tests, answer key material, or this rubric to candidates.

## Category Weights

| Category | Points |
| --- | ---: |
| Code correctness | 25 |
| System understanding | 15 |
| Product judgment | 15 |
| Leadership and intern review | 15 |
| Incident ownership | 15 |
| Verification discipline | 10 |
| AI judgment | 5 |
| Total | 100 |

## Code Correctness: 25 Points

| Item | Points |
| --- | ---: |
| Fixes webhook idempotency so duplicate provider deliveries do not enqueue duplicate CRM jobs | 5 |
| Fixes partial update merge so `null` contact fields do not erase trusted email or phone | 4 |
| Fixes terminal `422` handling so validation failures move to DLQ with evidence | 5 |
| Fixes `Retry-After` unit handling for rate-limit retries | 4 |
| Fixes failed jobs UI so DLQ / `dead_lettered` jobs are operator-visible | 4 |
| Maintains existing public behavior, types, and local architecture without broad rewrites | 3 |

## System Understanding: 15 Points

| Item | Points |
| --- | ---: |
| Explains the full webhook to merge to queue to CRM to DLQ to UI lifecycle | 5 |
| Identifies why idempotency belongs at provider event boundary, not receive timestamp or UI layer | 3 |
| Explains partial update semantics and source trust tradeoffs | 2 |
| Distinguishes retryable provider failures from terminal validation failures | 2 |
| Connects DLQ visibility to operator recovery and customer/account impact | 2 |
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

## Incident Ownership: 15 Points

| Item | Points |
| --- | ---: |
| Treats the broker complaint as real signal without treating vague wording as complete proof | 2 |
| Asks for concrete identifiers: broker, lead/client, timestamp, environment, expected vs actual | 2 |
| Uses deploy, queue, log, screenshot, and Codex evidence to form a bounded hypothesis | 3 |
| Separates likely UI visibility regression from worker, vendor, permission, stale browser, and data issues | 2 |
| Chooses rollback or immediate fix-forward instead of keeping a broken deploy live | 2 |
| Writes clear ops communication with current facts, action, and needed info | 2 |
| Creates a focused follow-up ticket and delegation split with acceptance checks | 2 |

## Verification Discipline: 10 Points

| Item | Points |
| --- | ---: |
| Runs and reports `npm run test:public` or explains any local blocker | 2 |
| Adds or describes targeted regression tests for the fixed behaviors | 3 |
| Uses deterministic fixtures and avoids real env/secret files | 2 |
| Verifies TypeScript/build health where relevant | 1 |
| Provides concise evidence in the submission without leaking reviewer-only material | 2 |

## AI Judgment: 5 Points

| Item | Points |
| --- | ---: |
| Discloses AI usage honestly in `AI_USAGE.md` or submission material | 1 |
| Uses AI to accelerate investigation while independently validating code behavior | 1 |
| Reviews generated code for boundary, retry, data-loss, and rollout risks | 1 |
| Avoids pasting secrets, real customer data, or hidden reviewer material into AI tools | 1 |
| Names uncertainty or tradeoffs instead of overstating confidence | 1 |

## Score Bands

| Band | Meaning |
| --- | --- |
| 90-100 | Strong hire signal. Fixes core bugs, explains system tradeoffs, verifies well, gives high-quality review feedback, and owns the incident decision. |
| 75-89 | Solid signal. Most core behavior is correct, with minor gaps in explanation, tests, or review precision. |
| 60-74 | Mixed signal. Some important fixes or review findings are present, but at least one major boundary is weak. |
| 40-59 | Weak signal. Candidate finds surface issues but misses multiple operational correctness risks. |
| 0-39 | No hire signal for this role. Submission does not show reliable ownership of cross-boundary behavior. |

## Calibration Notes

Do not require candidates to match the model patch line for line. Do require them to preserve the product standard: idempotent ingest, safe partial update behavior, correct `422` and retry handling, DLQ visibility, and clear review leadership.
