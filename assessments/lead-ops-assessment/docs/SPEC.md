# Lead Ops Assessment Spec

Status: locked for implementation
Audience: reviewer-only implementation control
Candidate export: excluded

## Problem

Edward needs a repeatable take-home package that tests real full-stack system judgment without exposing production data, secrets, vendor accounts, the reviewer answer key, or other candidates' work.

## Standard

Build one synthetic internal tool named `lead-ops-assessment`. The core workflow is:

```text
webhook -> normalize -> merge/assign -> enqueue CRM sync -> retry/DLQ -> ops UI
```

The package must contain a candidate-safe app and candidate-facing review artifacts, plus reviewer-only answer material. Complexity must come from lifecycle boundaries: inbound webhook delivery, lead merge state, outbound CRM sync, async retry, DLQ handling, and operator visibility.

## Reason

The assessment should reveal whether a candidate can understand inherited code, repair cross-boundary failures, write focused regression tests, make product calls, and review intern work. Setup pain, real vendor access, and broad feature work would hide that signal.

## Procedure

Implementation tickets must keep these constraints intact:

- Use fake, fixture-backed integrations only.
- Use no real customer data.
- Use no real env files. `.env.example` is allowed; `.env` and `.env.*` are not allowed except `.env.example`.
- Use no real external API accounts, OAuth apps, vendor sandboxes, or live network dependencies.
- Keep public tests passing on the candidate baseline.
- Keep hidden tests reviewer-only. Hidden tests should fail against the candidate baseline only for intended seeded bugs and pass against the answer-key solution.
- Keep reviewer-only files out of the candidate export.

## Product Scope

The app is a believable inherited lead operations tool with these user surfaces:

- Inbound lead-source webhook handler.
- Lead list and lead detail pages.
- Failed CRM sync jobs page.
- Local demo/reset commands for reviewers and candidates.
- Candidate prompt and submission templates.
- Two fake intern PR patches for candidate code review.
- Reviewer-only answer key, hidden tests, scoring rubric, and model solution.

Out of scope:

- Real OAuth.
- Real vendor accounts.
- Real customer data.
- Payments.
- Slack bot behavior.
- LLM features.
- Multi-service deployment.
- Full CRM product scope.

## Authoritative File Boundaries

The source repo may contain both candidate-safe and reviewer-only files. The candidate export must contain only the candidate-safe surface.

| Surface | Include in candidate export | Purpose |
| --- | --- | --- |
| `README.md` | yes | Candidate setup and app overview without answers. |
| `.env.example` | yes | Placeholder names only. No real secrets. |
| `package.json`, lockfile, `index.html`, TypeScript/test/build config | yes | One-command install and verification. |
| `src/` | yes | Baseline app, fake integrations, seeded implementation flaws. |
| `tests/setup.ts`, `tests/public/` | yes | Test setup and public tests that pass on baseline. |
| `fixtures/` or `src/fixtures/` | yes | Fake webhook, CRM, queue, and UI data. |
| `scripts/reset-demo-state.mjs` | yes | Candidate-safe deterministic local reset command. |
| `assignment/` | yes | Candidate prompt and submission checklist. |
| `AI_USAGE.md` | yes | Candidate AI disclosure template. |
| `ASSESSMENT.md` | yes | Candidate write-up template. |
| `review/` | yes | Candidate-facing intern patches and final review template. |
| `docs/RUNBOOK.md` | yes | Candidate-safe local setup and operations runbook. |
| `docs/SPEC.md` | no | Reveals seeded bug map and file boundary decisions. |
| `docs/ARCHITECTURE.md` | no | Reviewer implementation reference and hidden-test contract. |
| `docs/EXPORT_POLICY.md` | no | Reviewer/admin export rules. |
| `docs/CANDIDATE_REPO_RUNBOOK.md` | no | Reviewer/admin private-repo duplication procedure. |
| `docs/READINESS_REPORT.md` | no | Final reviewer QA evidence. |
| `reviewer/` | no | Answer key, scoring rubric, hidden tests, model solution. |
| `scripts/export-candidate-package.sh` | no | Reviewer/admin export tool. |
| `scripts/verify-candidate-export.sh` | no | Reviewer/admin export verification tool. |
| `.codex-autorunner/` | no | Build-control ticket queue. |
| `projects/` | no | Edward project notes and decisions. |
| `node_modules/`, `dist/`, `coverage/`, temp output | no | Generated artifacts. |
| `.env`, `.env.*`, secret files | no | Real env/secret material is forbidden. |
| candidate submissions or per-candidate repos | no | Candidate isolation. |

## Final Directory Structure

Implementation tickets must converge on this structure under `assessments/lead-ops-assessment/`:

```text
assessments/lead-ops-assessment/
  README.md
  package.json
  package-lock.json
  index.html
  tsconfig.json
  vitest.config.ts
  vite.config.ts
  .env.example
  AI_USAGE.md
  ASSESSMENT.md
  assignment/
    PROMPT.md
    SUBMISSION_CHECKLIST.md
  docs/
    SPEC.md
    ARCHITECTURE.md
    RUNBOOK.md
    EXPORT_POLICY.md
    CANDIDATE_REPO_RUNBOOK.md
    READINESS_REPORT.md
  fixtures/
    crm/
      conflict-409.json
      rate-limit-429.json
      success-200.json
      validation-422.json
      server-error-500.json
    webhooks/
      duplicate-delivery.json
      malformed.json
      partial-null-update.json
      signed-create.json
    repository/
      seed-state.json
  public/
  review/
    FINAL_REVIEW.md
    intern-a-performance-cleanup.md
    intern-a-performance-cleanup.patch
    intern-b-ui-polish.md
    intern-b-ui-polish.patch
  reviewer/
    ANSWER_KEY.md
    EXPECTED_FINDINGS.md
    SCORING_RUBRIC.md
    hidden-tests/
      crm-worker.hidden.test.ts
      lead-merge.hidden.test.ts
      ops-ui.hidden.test.ts
      webhook-idempotency.hidden.test.ts
    model-solution.patch
  scripts/
    reset-demo-state.mjs
    export-candidate-package.sh
    verify-candidate-export.sh
    verify-hidden-tests.mjs
    check-intern-a.mjs
    check-intern-b.mjs
  src/
    app/
      App.tsx
      main.tsx
      pages/
        FailedJobsPage.tsx
        LeadDetailPage.tsx
        LeadListPage.tsx
      styles.css
    domain/
      assignment.ts
      leadMerge.ts
      normalization.ts
      types.ts
    integrations/
      fakeCrmClient.ts
      leadSourceSignature.ts
      webhookFixtures.ts
    jobs/
      crmSyncWorker.ts
      queue.ts
      retryPolicy.ts
    repository/
      fixtures.ts
      repository.ts
      reset.ts
      transaction.ts
    server/
      routes/
        crmJobs.ts
        leads.ts
        webhook.ts
  tests/
    setup.ts
    public/
      crm.public.test.ts
      merge.public.test.ts
      seed.public.test.ts
      ui.public.test.tsx
      webhook.public.test.ts
      worker.public.test.ts
```

If implementation discovers a necessary file move, update this spec and `docs/EXPORT_POLICY.md` in the same change. Do not silently move reviewer-only material into candidate-safe paths.

## Exact Seeded Bugs

The candidate baseline must include these seeded bug items. Candidate-facing docs must not name these exact answers.

1. Seeded bug: webhook idempotency uses a local receive timestamp or inbox record id instead of the provider event id plus source. Duplicate provider delivery can create duplicate CRM sync jobs.
2. Seeded bug: partial inbound updates with `null` phone or email overwrite newer non-null local values. Missing fields should preserve current trusted data.
3. Seeded bug: CRM worker retries all 4xx responses, including terminal `422` validation failures. `422` should move to DLQ with evidence for operators.
4. Seeded bug: failed-jobs UI filters for status `failed` while the worker writes terminal jobs as `dead_lettered`. Operators cannot see poisoned jobs.
5. Seeded bug: `Retry-After` handling interprets CRM seconds as milliseconds. `429` retries happen too quickly and can hammer the fake CRM.

## Exact Fake Intern Patches

The candidate baseline must include two candidate-facing fake intern patches:

1. `review/intern-a-performance-cleanup.patch`
   - Candidate-facing title: "Performance cleanup: reduce transaction overhead during lead ingest."
   - Exact regression: removes or bypasses the atomic helper that wraps lead write plus CRM sync enqueue.
   - Expected candidate review: block the PR because a partial write can leave a lead updated without a sync job, or enqueue a job for a write that later fails.

2. `review/intern-b-ui-polish.patch`
   - Candidate-facing title: "UI polish: simplify failed job list."
   - Exact regression: hides older failed or DLQ jobs by default without an operator-visible escape hatch.
   - Expected candidate review: block or request changes because operator visibility is part of the recovery workflow, not cosmetic clutter.

Reviewer-only expected findings belong in `reviewer/EXPECTED_FINDINGS.md`; candidate-facing patch descriptions must sound plausible and must not reveal the answer.

## Test Contract

Public tests must pass on the candidate baseline:

- Happy-path webhook signature, malformed payload handling, and normal lead creation.
- Deterministic seed/reset behavior.
- Merge and assignment happy paths.
- CRM success, `429`, and `500` retry behavior.
- Worker completion behavior.
- Lead list, lead detail, and basic failed-job page rendering.

Hidden tests must fail against the candidate baseline for intended seeded bug coverage:

- Duplicate webhook replay creates duplicate CRM sync work.
- Partial `null` update destroys existing phone or email.
- CRM `422` retries instead of DLQ.
- DLQ jobs are hidden because UI status filter does not match worker status.
- `Retry-After` seconds are treated as milliseconds.

Hidden tests must pass against the model solution.

Reviewer-only hidden-test commands:

- `npm run reviewer:verify-baseline` validates the seeded baseline by expecting the intended hidden-test failures.
- `npm run reviewer:verify-hidden` runs hidden tests as a normal pass/fail verifier for an answer-key or candidate solution tree.
- `npm run reviewer:check-intern-a` validates the first fake intern patch and expected reviewer finding.
- `npm run reviewer:check-intern-b` validates the second fake intern patch and expected reviewer finding.

`reviewer/hidden-tests/`, `scripts/verify-hidden-tests.mjs`, `scripts/check-intern-a.mjs`, and `scripts/check-intern-b.mjs` are reviewer-only and must be excluded from candidate exports.
Candidate export tooling must also remove reviewer-only package scripts such as `test:hidden` and `reviewer:*` from the exported `package.json`.

## Grading Signal

The package should test:

- Code correctness and regression testing.
- System understanding across webhook, data, queue, CRM, retry, DLQ, and UI boundaries.
- Product judgment around lead data quality and operator visibility.
- Leadership judgment in intern PR review.
- AI-era engineering judgment, including clear AI usage disclosure and review of generated changes.
