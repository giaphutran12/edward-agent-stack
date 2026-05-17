# Scoring Rubric

Candidate export: excluded

## Problem

Reviewers need a 100-point rubric that rewards defect discovery, working fixes, system understanding, product judgment, leadership, incident ownership, verification, and responsible AI use.

## Standard

Score the submitted triage, implementation, write-up, tests, intern PR review, and incident response together. Award equivalent credit for valid alternate implementations that preserve the intended product behavior and operational safety.

## Reason

The role needs more than code changes. A strong candidate should find and rank failures across webhook ingestion, merge semantics, CRM retry/DLQ behavior, operator UI, vague broker complaints, rollout decisions, and review leadership.

## Procedure

Use this scale after running public tests and any reviewer-only checks available to the reviewer. Do not reveal hidden tests, answer key material, or this rubric to candidates.

## Category Weights

| Category | Points |
| --- | ---: |
| Defect discovery and prioritization | 15 |
| Code correctness | 20 |
| System understanding | 12 |
| Product judgment | 10 |
| Leadership and intern review | 15 |
| Incident ownership | 15 |
| Verification discipline | 8 |
| AI judgment | 5 |
| Total | 100 |

## Hard Gates And Score Caps

Apply these caps after adding category points:

| Gate | Cap |
| --- | ---: |
| Candidate finds fewer than four of the five seeded defects across code changes and `BUG_TRIAGE.md` | 74 |
| Candidate entirely misses the partial-null data-loss risk | 74 |
| Candidate entirely misses terminal CRM `422` classification / DLQ handling | 74 |
| Candidate implements only UI/presentation changes and no backend correctness fix | 74 |
| Candidate review mainly paraphrases automated PR comments without independent diff, code, test, or impact evidence | 79 |
| Candidate keeps a broken deploy live in the incident exercise without extraordinary evidence | 79 |
| Candidate submits no `BUG_TRIAGE.md` or equivalent defect inventory | 70 |
| Candidate leaks reviewer-only material, real secrets, or real customer data | 0-39 depending on severity |

These gates prevent a polished one-bug AI patch from reading like senior ownership.

## Defect Discovery And Prioritization: 15 Points

| Item | Points |
| --- | ---: |
| Identifies webhook duplicate-delivery/idempotency risk with concrete evidence | 2 |
| Identifies partial-null update data-loss risk with concrete evidence | 3 |
| Identifies terminal `422` validation failure / DLQ risk with concrete evidence | 3 |
| Identifies `Retry-After` unit/rate-limit risk with concrete evidence | 2 |
| Identifies failed-job or DLQ operator-visibility risk with concrete evidence | 2 |
| Severity-ranks issues, states fixed/deferred/delegated decisions, and gives acceptance checks | 3 |

## Code Correctness: 20 Points

| Item | Points |
| --- | ---: |
| Fixes at least one backend correctness boundary with a targeted implementation | 4 |
| Fixes at least one operator visibility or recovery boundary with a targeted implementation | 4 |
| Fixes webhook idempotency so duplicate provider deliveries do not enqueue duplicate CRM jobs, if selected | 3 |
| Fixes partial update merge so `null` contact fields do not erase trusted email or phone, if selected | 3 |
| Fixes terminal `422` handling so validation failures move to DLQ with evidence, if selected | 3 |
| Fixes `Retry-After` unit handling for rate-limit retries, if selected | 2 |
| Fixes failed jobs UI so DLQ / `dead_lettered` jobs are operator-visible, if selected | 2 |
| Maintains existing public behavior, types, and local architecture without broad rewrites | 2 |

If a candidate implements more than two fixes, score the best relevant items while still applying the hard gates. If they implement fewer fixes but clearly discover and prioritize the remaining seeded defects, award discovery credit above instead of correctness credit.

## System Understanding: 12 Points

| Item | Points |
| --- | ---: |
| Explains the full webhook to merge to queue to CRM to DLQ to UI lifecycle | 4 |
| Identifies why idempotency belongs at provider event boundary, not receive timestamp or UI layer | 2 |
| Explains partial update semantics and source trust tradeoffs | 2 |
| Distinguishes retryable provider failures from terminal validation failures | 2 |
| Connects DLQ visibility to operator recovery and customer/account impact | 2 |

## Product Judgment: 10 Points

| Item | Points |
| --- | ---: |
| Prioritizes correctness and recovery over cosmetic polish | 3 |
| Describes user/operator impact in concrete terms | 3 |
| Chooses fixes that preserve a simple candidate-local workflow | 2 |
| Avoids unnecessary infrastructure, vendor accounts, or real data | 1 |
| Keeps UI behavior inspectable and trustworthy under failure | 1 |

## Leadership And Intern Review: 15 Points

| Item | Points |
| --- | ---: |
| Blocks `intern-a` for loss of atomic lead write plus CRM enqueue behavior | 5 |
| Blocks `intern-b` for hiding unresolved retry or DLQ work from operators | 5 |
| Gives concrete requested changes and regression-test asks | 3 |
| Separates blocking correctness risks from non-blocking style or polish comments | 2 |

Do not award full credit when the candidate only restates automated review comments. Full review credit requires the candidate to cite the diff or code path, explain operator impact, and name the regression test or verification that would make the PR mergeable.

## Incident Ownership: 15 Points

| Item | Points |
| --- | ---: |
| Treats the broker complaint as real signal without treating vague wording as complete proof | 2 |
| Asks for concrete identifiers: broker, lead/client, timestamp, environment, expected vs actual | 2 |
| Requests or uses deploy, queue, log, screenshot, and Codex evidence to form a bounded hypothesis | 3 |
| Separates likely UI visibility regression from worker, vendor, permission, stale browser, and data issues | 2 |
| Chooses rollback or immediate fix-forward instead of keeping a broken deploy live | 2 |
| Writes clear ops communication with current facts, action, and needed info | 2 |
| Creates a focused follow-up ticket and delegation split with acceptance checks | 2 |

Full incident credit requires the candidate to ask for queue state and worker/deploy logs before finalizing the root cause. A candidate may choose fix-forward or rollback, but must not treat the automated review comment as proof by itself.

## Verification Discipline: 8 Points

| Item | Points |
| --- | ---: |
| Runs and reports `npm run test:public` or explains any local blocker | 1 |
| Adds or describes targeted regression tests for the fixed behaviors | 2 |
| Uses deterministic fixtures and avoids real env/secret files | 2 |
| Verifies TypeScript/build health where relevant | 1 |
| Runs the CRM worker or direct repro command when touching queue, retry, DLQ, or job visibility behavior | 1 |
| Provides concise evidence in the submission without leaking reviewer-only material | 1 |

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
| 90-100 | Strong hire signal. Finds the core bug set, fixes high-value boundaries, explains system tradeoffs, verifies well, gives high-quality review feedback, and owns the incident decision. |
| 75-89 | Solid signal. Finds most core behavior risks, fixes at least one backend boundary and one operator/recovery boundary, with minor gaps in explanation, tests, or review precision. |
| 60-74 | Mixed signal. Some important fixes or review findings are present, but at least one major boundary is weak. |
| 40-59 | Weak signal. Candidate finds surface issues but misses multiple operational correctness risks. |
| 0-39 | No hire signal for this role. Submission does not show reliable ownership of cross-boundary behavior. |

## Calibration Notes

Do not require candidates to match the model patch line for line. Do require them to find and account for the product standard: idempotent ingest, safe partial update behavior, correct `422` and retry handling, DLQ visibility, and clear review leadership.
