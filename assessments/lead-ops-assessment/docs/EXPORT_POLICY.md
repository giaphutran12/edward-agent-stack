# Lead Ops Assessment Export Policy

Status: locked for implementation
Audience: reviewer/admin
Candidate export: excluded

## Problem

The source tree contains both candidate-safe materials and reviewer-only answer materials. A careless export could leak hidden tests, expected findings, model solutions, or another candidate's work.

## Standard

Every candidate receives a fresh private candidate-safe export. The export must include the runnable baseline app and candidate-facing artifacts only. It must exclude reviewer-only materials, generated artifacts, real env files, secret material, and any per-candidate submissions.

## Reason

Candidate isolation keeps grading fair. Reviewer-only separation keeps the assessment reusable. Fake fixture-backed integrations keep the package safe to duplicate.

## Procedure

Run export tooling from `assessments/lead-ops-assessment/` after implementation:

```bash
bash scripts/export-candidate-package.sh
bash scripts/verify-candidate-export.sh
```

The verification script must fail if any excluded path or forbidden env/secret pattern appears in the export.

## Candidate-Safe Include List

The export may include:

- `README.md`
- `.env.example`
- generated candidate `.gitignore`
- `package.json`
- `package-lock.json`
- `index.html`
- `tsconfig.json`
- `vitest.config.ts`
- `vite.config.ts`
- `AI_USAGE.md`
- `ASSESSMENT.md`
- `assignment/`
- `docs/RUNBOOK.md`
- `fixtures/`
- `scripts/reset-demo-state.mjs`
- `public/`
- `review/FINAL_REVIEW.md`
- `review/intern-a-performance-cleanup.md`
- `review/intern-a-performance-cleanup.patch`
- `review/intern-b-ui-polish.md`
- `review/intern-b-ui-polish.patch`
- `src/`
- `tests/setup.ts`
- `tests/public/`

Candidate-safe files may mention the high-level workflow and fake integrations. They must not name exact seeded bug answers, hidden-test expectations, scoring answers, or model solution details.

## Reviewer-Only Exclusion List

The export must exclude:

- `docs/SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/EXPORT_POLICY.md`
- `docs/CANDIDATE_REPO_RUNBOOK.md`
- `docs/READINESS_REPORT.md`
- `reviewer/`
- `reviewer/ANSWER_KEY.md`
- `reviewer/EXPECTED_FINDINGS.md`
- `reviewer/SCORING_RUBRIC.md`
- `reviewer/hidden-tests/`
- `reviewer/model-solution.patch`
- `scripts/export-candidate-package.sh`
- `scripts/verify-candidate-export.sh`
- `scripts/verify-hidden-tests.mjs`
- `scripts/verify-answer-key.mjs`
- `scripts/check-intern-a.mjs`
- `scripts/check-intern-b.mjs`
- reviewer-only npm scripts from exported `package.json`: `test:hidden` and `reviewer:*`
- hidden tests anywhere outside `reviewer/`
- model solution patches or answer-key branches
- `.codex-autorunner/`
- `projects/`
- `.git/`
- `node_modules/`
- `dist/`
- `coverage/`
- temp export output
- per-candidate submissions
- other candidates' repos, branches, patches, comments, or results
- real customer data
- real env files
- real external API account material
- secret files

## Env And Secret Policy

Allowed:

- `.env.example` with placeholder names only.

Forbidden:

- `.env`
- `.env.local`
- `.env.production`
- `.env.test`
- any `.env.*` file except `.env.example`
- copied shell profiles
- OAuth client secrets
- real webhook secrets
- real CRM tokens
- customer exports

The export verifier must check for forbidden env filenames and obvious reviewer-only paths. It must not print secret values if it finds a forbidden file.

## Export Verification

Verification must prove:

- Candidate package installs.
- `npm run typecheck` passes.
- `npm run test:public` passes.
- Reviewer-only files are absent.
- Hidden tests are absent.
- Reviewer hidden-test verifier scripts are absent.
- Reviewer-only npm scripts are absent from exported `package.json`.
- Model solution material is absent.
- `.env.example` is present.
- Real env files are absent.
- Fake fixture-backed integrations are present.
- Intern patch files are present.

## Private Repo Duplication

Edward or the reviewer must create one private repo per candidate. Do not invite candidates to one shared repo.

Minimum flow:

1. Generate a fresh export.
2. Verify the export.
3. Create a new private candidate repo.
4. Push only the verified export contents.
5. Invite the candidate.
6. Keep reviewer-only source tree, hidden tests, answer key, and scoring rubric outside the candidate repo.

## Seeded Bug Boundary

Seeded bug details live only in reviewer-only surfaces:

- `docs/SPEC.md`
- `docs/ARCHITECTURE.md`
- `reviewer/ANSWER_KEY.md`
- `reviewer/EXPECTED_FINDINGS.md`
- `reviewer/hidden-tests/`
- `reviewer/model-solution.patch`

Candidate-safe surfaces may say the repo contains inherited behavior to investigate, but must not reveal exact expected failures.
