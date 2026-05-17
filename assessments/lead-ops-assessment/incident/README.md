# Incident Exercise: Broker Says AML Still Does Not Work

Status: candidate-facing

## Scenario

A broker posts a vague Slack complaint: "AML still doesn't work." There is a screenshot, but it only shows the failed jobs panel looking empty. A UI polish PR was deployed to staging this morning. Codex already left a P1 review comment on that PR.

You are acting tech lead. Your job is not to blindly accept the complaint, dismiss it, or copy Codex. Your job is to turn a vague production-style report into a bounded engineering response.

## Initial Packet

Read these files:

- `BROKER_SLACK_THREAD.md`
- `SCREENSHOT_NOTES.md`
- `assets/failed-crm-jobs-empty-state.png`
- `RECENT_DEPLOY.md`
- `CODEX_REVIEW.md`

During a live interview, the reviewer may provide additional queue or log evidence if you ask for it. In a written response, state exactly what evidence you would request and what you would do with it.

## Task

Complete `INCIDENT_RESPONSE.md`.

Your response should show:

- what is known from the evidence
- what is still unknown
- what you would ask the broker or ops team
- what queue, log, deploy, or code evidence you would request next
- whether you would rollback, fix-forward, or keep the deploy
- what you would say in Slack
- what PR comment you would leave
- what regression test you would require
- what you would delegate and what you would own yourself

## Constraints

- Do not use real customer data, real vendor accounts, or real secrets.
- Do not assume the broker's wording is technically precise.
- Do not stop at "ask for more info." State what you can verify now and what action you would take next.
