# Incident Answer Key

Candidate export: excluded

## Problem

Reviewers need a private calibration guide for the vague broker complaint and staging deploy incident. The exercise should reward technical leadership, not blind obedience to Codex or a generic support response.

## Standard

Grade the incident response by evidence use, decision quality, communication, and follow-through. A strong answer turns "AML still doesn't work" into a bounded hypothesis, immediate operator-safe action, and a clear verification plan. It does not treat the automated Codex comment as the answer.

## Expected Best Answer

The strongest answer says:

- The broker report is real signal, but not complete proof of root cause.
- The screenshot shows an empty failed jobs UI, not an empty queue.
- If requested during the live exercise, the queue snapshot and logs show unresolved `retry_scheduled` and `dead_lettered` work still exists.
- The recent deploy changed the failed jobs UI and added a recent retry filter.
- Codex's P1 comment is credible and matches the evidence, but the candidate must still explain the operational impact.
- The likely cause is a UI visibility regression in the failed jobs panel, not necessarily an AML vendor outage or dead worker.
- Do not keep the deploy as-is.
- Fix-forward is acceptable only if a tiny, verified patch can restore visibility immediately. Otherwise rollback first.
- Require a regression test that renders older `retry_scheduled` jobs and `dead_lettered` jobs and proves operators can see them by default or through an explicit visible filter with counts.
- Reply to ops with what is known, what is being done, and what identifier is still needed.
- Leave a PR comment that explains why the recovery queue cannot hide unresolved work.
- Delegate data gathering or test writing if useful, but own the rollout decision and broker-facing communication.

## Required Evidence Use

Credit only if the answer uses at least three of these:

- `BROKER_SLACK_THREAD.md`
- `SCREENSHOT_NOTES.md`
- `RECENT_DEPLOY.md`
- `CODEX_REVIEW.md`
- `reviewer/incident-reveals/QUEUE_SNAPSHOT.json`, if the candidate requested queue state
- `reviewer/incident-reveals/CRM_SYNC_LOG.txt`, if the candidate requested worker or deploy-time logs
- Intern B PR behavior or `FailedJobsPage` behavior

The strongest live-interview answers explicitly ask for queue state and worker logs before the reviewer provides the reveal files. Do not require the candidate to magically know unrevealed file contents.

## Scoring Guide

| Item | Points |
| --- | ---: |
| Acknowledges the broker without treating vague wording as complete proof | 2 |
| Asks for concrete identifiers: broker, lead/client, timestamp, environment, expected vs actual | 2 |
| Uses deploy, queue, log, screenshot, and Codex evidence to form a bounded hypothesis | 4 |
| Separates likely UI visibility regression from worker, vendor, permission, stale browser, and data issues | 3 |
| Chooses rollback or immediate fix-forward instead of keeping the deploy as-is | 3 |
| Explains operator/customer impact in concrete terms | 3 |
| Requires focused regression coverage for old retry and dead-letter visibility | 3 |
| Writes a clear Slack response with current facts, next action, and needed info | 3 |
| Leaves a concrete PR review comment with requested change and verification | 3 |
| Creates a focused follow-up ticket with acceptance checks | 2 |
| Delegates investigation/test work while owning the rollout decision | 2 |
| Uses Codex as input, not as a substitute for judgment | 3 |
| Total | 33 |

Map this score into the incident ownership portion of the main rubric.

For full incident credit, the candidate must request queue state and worker/deploy logs before finalizing the root cause. If they mostly restate the Codex comment and do not ask for queue/log evidence, cap the incident score at 10/15 in the main rubric even if their Slack message sounds polished.

## Acceptable Decision Variants

### Fix-Forward

Accept if the candidate says the fix is tiny, targeted, and can be verified fast. They must name the verification:

- UI test with old `retry_scheduled` job.
- UI test with `dead_lettered` job.
- `npm run typecheck`.
- `npm run test:public`.
- Manual screenshot or dev-server check showing visible unresolved jobs.

### Rollback

Accept if the candidate says operator recovery is impaired and immediate fix confidence is low. They must still create a follow-up fix ticket and identify needed regression tests.

### Keep Deployed

Reject unless the candidate provides extraordinary evidence that the UI is not user-facing and no operator workflow is affected. That evidence is not present in this packet.

## Bad Answer Patterns

Penalize heavily for:

- "Restart the server" without evidence.
- "Rollback immediately" without reading queue/log/deploy evidence.
- "Works on my machine."
- "Ask the broker for more info" and stopping there.
- "Codex found it" with no explanation of impact.
- Codex-shaped answer with no independent queue/log/code evidence request.
- Treating "AML" as precise root cause without reconciling the CRM failed jobs evidence.
- Making code changes before bounding scope.
- Clearing the queue or deleting dead-letter jobs.
- Saying CI passed, so the deploy is safe.
