---
title: "Create fake intern PR patch A for atomicity regression"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_009_intern_a"
---

## Goal

Create the first fake intern PR artifact: a plausible performance cleanup that breaks atomicity.

## Context

This tests whether candidates review for correctness and operational safety, not just style.

## Required Work

- Create `review/intern-a-performance-cleanup.patch`.
- Create candidate-facing PR description for intern A.
- Patch should remove or bypass the atomic helper around lead write plus queue enqueue.
- Patch should look plausible and not cartoonishly bad.
- Add reviewer-only expected findings for intern A.

## Acceptance Criteria

- Patch applies cleanly to the candidate baseline.
- Patch introduces a real regression around partial write or missing sync job.
- Candidate-facing PR description does not reveal the answer.
- Reviewer notes identify expected blocking comments.

## Verification

```bash
cd assessments/lead-ops-assessment
git apply --check review/intern-a-performance-cleanup.patch
npm run reviewer:check-intern-a
```

## Completion Evidence

Patch path: `assessments/lead-ops-assessment/review/intern-a-performance-cleanup.patch`

Candidate-facing PR description: `assessments/lead-ops-assessment/review/intern-a-performance-cleanup.md`

Reviewer-only expected finding: `assessments/lead-ops-assessment/reviewer/EXPECTED_FINDINGS.md` records a blocking Intern A finding for removing the rollback guard from `LeadOpsRepository.writeLeadAndEnqueueCrmSync`, which can leave an accepted lead and inbound event without a matching CRM sync job when enqueue fails.

Verification:

```bash
cd assessments/lead-ops-assessment
git apply --check review/intern-a-performance-cleanup.patch
npm run reviewer:check-intern-a
npm run test:public
```
