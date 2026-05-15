# Lead Ops Assessment Readiness Report

Status: ready for Edward duplication
Audience: reviewer/admin
Candidate export: excluded

## Problem

The assessment package must be safe to duplicate for candidates without leaking reviewer-only answers, hidden tests, model solutions, or local control-plane files.

## Standard

The seeded baseline must install, typecheck, pass public tests, and build. Hidden tests must fail on the baseline only in the expected five ways. The answer-key solution must pass hidden verification in an isolated copy. Candidate export must be clean, runnable, and free of reviewer-only files and reviewer-only npm scripts.

## Reason

Edward needs one repeatable package that can be copied into private per-candidate repositories while preserving a private reviewer grading surface in this source tree.

## Runtime Context

- Branch: `codex/tkt_lead_ops_014_final_qa`
- Ticket: `tkt_lead_ops_014_final_qa`
- Cockpit binding: unavailable in this fallback shell. `BLI_ACTIVE_TICKET` was unset, operator JWT was absent, and `bli-event` was not installed, so lifecycle events could not be emitted.
- Dispatch file: `.codex-autorunner/runs/38002d98-664c-4751-93d6-f42f91605093/DISPATCH.md` was not present. The ticket file remained the control plane.
- Final export path: `/Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment/tmp/candidate-exports/lead-ops-assessment-candidate-20260515T193217Z`

## QA Findings

- Added `npm run reviewer:verify-answer-key` so the answer-key solution is applied and verified in a temporary copy without mutating the seeded baseline.
- Added `tmp/**` to Vitest excludes so generated candidate exports under `tmp/candidate-exports/` do not inflate root public test runs.
- Added `scripts/verify-answer-key.mjs` and `docs/READINESS_REPORT.md` to reviewer-only export exclusions.

## Procedure And Output

```text
$ python3 .codex-autorunner/bin/lint_tickets.py
OK: 14 ticket(s) linted.
```

```text
$ npm install

up to date, audited 165 packages in 562ms

27 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

```text
$ npm run typecheck

> lead-ops-assessment@0.1.0 typecheck
> tsc --noEmit
```

```text
$ npm run test:public

> lead-ops-assessment@0.1.0 test:public
> vitest run tests/public


 RUN  v4.1.6 /Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment


 Test Files  7 passed (7)
      Tests  28 passed (28)
   Start at  02:30:36
   Duration  797ms (transform 352ms, setup 396ms, import 395ms, tests 99ms, environment 2.93s)
```

```text
$ npm run build

> lead-ops-assessment@0.1.0 build
> tsc --noEmit && vite build

vite v7.3.3 building client environment for production...
transforming...
✓ 35 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.40 kB │ gzip:  0.28 kB
dist/assets/index-BsWIW5K_.css    1.83 kB │ gzip:  0.84 kB
dist/assets/index-_uFVlQfX.js   203.06 kB │ gzip: 62.86 kB
✓ built in 271ms
```

```text
$ npm run reviewer:verify-baseline

> lead-ops-assessment@0.1.0 reviewer:verify-baseline
> node scripts/verify-hidden-tests.mjs --expect-baseline-failures

Hidden baseline verification passed.
Expected hidden failures: 5
Hidden tests observed: 5
```

```text
$ npm run reviewer:verify-answer-key

> lead-ops-assessment@0.1.0 reviewer:verify-answer-key
> node scripts/verify-answer-key.mjs

Running in answer-key copy: npm ci

added 164 packages, and audited 165 packages in 2s

27 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Running in answer-key copy: git apply --check reviewer/model-solution.patch
Running in answer-key copy: git apply reviewer/model-solution.patch
Running in answer-key copy: npm run typecheck

> lead-ops-assessment@0.1.0 typecheck
> tsc --noEmit

Running in answer-key copy: npm run test:public

> lead-ops-assessment@0.1.0 test:public
> vitest run tests/public


 RUN  v4.1.6 /private/var/folders/7w/ypxksdmx3fd86765mgr8lf4m0000gn/T/lead-ops-answer-key-HE560c/package


 Test Files  7 passed (7)
      Tests  28 passed (28)
   Start at  02:33:48
   Duration  680ms (transform 224ms, setup 297ms, import 271ms, tests 99ms, environment 2.54s)

Running in answer-key copy: npm run reviewer:verify-hidden

> lead-ops-assessment@0.1.0 reviewer:verify-hidden
> node scripts/verify-hidden-tests.mjs

Hidden verification passed: 5/5 tests passed.
Answer-key verification passed.
```

```text
$ bash scripts/export-candidate-package.sh
Candidate export created.
Export path: /Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment/tmp/candidate-exports/lead-ops-assessment-candidate-20260515T193217Z
Latest pointer: /Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment/tmp/candidate-exports/latest.txt
```

```text
$ bash scripts/verify-candidate-export.sh
Running in verification copy: npm ci

added 164 packages, and audited 165 packages in 1s

27 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Running in verification copy: npm run typecheck

> lead-ops-assessment@0.1.0 typecheck
> tsc --noEmit

Running in verification copy: npm run test:public

> lead-ops-assessment@0.1.0 test:public
> vitest run tests/public


 RUN  v4.1.6 /private/var/folders/7w/ypxksdmx3fd86765mgr8lf4m0000gn/T/lead-ops-export-verify.MUtkTr/package


 Test Files  7 passed (7)
      Tests  28 passed (28)
   Start at  02:32:22
   Duration  644ms (transform 242ms, setup 380ms, import 334ms, tests 99ms, environment 2.19s)

Candidate export verified.
Verified export path: /Users/edwardtran/BLI/edward-clone/assessments/lead-ops-assessment/tmp/candidate-exports/lead-ops-assessment-candidate-20260515T193217Z
```

```text
$ test -f docs/READINESS_REPORT.md
READINESS_REPORT.md present.
```

## Result

Acceptance criteria passed. The baseline public suite passes, hidden baseline verification confirms exactly five expected seeded failures, the answer-key solution passes typecheck, public tests, and hidden tests in an isolated copy, and the verified candidate export is clean and runnable.
