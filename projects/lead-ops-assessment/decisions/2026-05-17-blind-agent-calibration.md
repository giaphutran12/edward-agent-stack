# Decision: Harden Assessment With Blind-Agent Calibration

Date: 2026-05-17
Status: active
Source: Blind candidate-agent run and independent grader review

## Question

How should the lead-ops assessment avoid passing candidates who can use Codex to fix one obvious issue and paraphrase automated PR comments?

## Problem

A blind agent with no prior conversation context produced a polished partial submission. It fixed webhook replay and failed-job visibility, wrote strong intern PR reviews, and gave a readable incident response, but missed partial-null data loss, terminal CRM `422` handling, and `Retry-After` unit handling. The independent grader scored it 71/100 and no-pass.

## Decision

Require candidate defect discovery and prioritization through `BUG_TRIAGE.md`, while keeping implementation scoped to one or two targeted fixes. The rubric now applies score caps when candidates miss critical boundaries, especially partial-null data loss and terminal CRM validation failure handling.

Automated Codex review comments are allowed as real-world inputs, but they cannot be enough for full review or incident credit. Candidates must independently cite the diff, code path, evidence, operational impact, and regression test or verification.

## Why

The role is a full-stack delivery lead role, not a typist role. The assessment must test whether the candidate can find important risks, decide what matters, and own rollout/ops judgment even when AI gives a partial clue.

## Applies To

- `assessments/lead-ops-assessment/BUG_TRIAGE.md`
- `assessments/lead-ops-assessment/assignment/PROMPT.md`
- `assessments/lead-ops-assessment/reviewer/ANSWER_KEY.md`
- `assessments/lead-ops-assessment/reviewer/SCORING_RUBRIC.md`
- `assessments/lead-ops-assessment/reviewer/EXPECTED_FINDINGS.md`
- `assessments/lead-ops-assessment/reviewer/INCIDENT_ANSWER_KEY.md`

## Tradeoff

The candidate prompt now reveals that broader defect discovery is expected. That makes the take-home less surprising, but it improves the signal for senior ownership and reduces the chance that a one-bug AI patch looks like a pass.

## Risk / Blast Radius

The main risk is over-weighting written triage. Reviewers should still require concrete evidence and should run hidden verification where possible. Generic risk lists without file, test, fixture, log, or reproduction evidence should not receive strong credit.

## Revisit When

- Another blind-agent run finds all seeded issues too easily.
- Candidates spend more time gaming `BUG_TRIAGE.md` than understanding the system.
- Live GitHub automated review comments cannot be removed or suppressed in candidate PRs.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-decision-capture/SKILL.md`

## Related Project Notes

- `projects/lead-ops-assessment/PROJECT.md`

## Related Assessment Docs

- `assessments/lead-ops-assessment/docs/SPEC.md`
- `assessments/lead-ops-assessment/reviewer/SCORING_RUBRIC.md`
