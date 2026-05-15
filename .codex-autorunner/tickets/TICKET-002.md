---
title: "Scaffold lead-ops assessment app"
agent: "codex"
done: true
ticket_id: "tkt_lead_ops_002_scaffold"
---

## Goal

Scaffold the candidate app under `assessments/lead-ops-assessment/` with one-command install, test, build, and dev commands.

## Context

This should become the repo template Edward duplicates for candidates. Keep the scaffold boring, documented, and portable.

## Required Work

- Create a TypeScript app workspace under `assessments/lead-ops-assessment/`.
- Prefer a single web/API app with pure TypeScript domain modules and fixture-backed adapters.
- Add `package.json`, `tsconfig.json`, test config, lint or typecheck config, and README.
- Add `.env.example` only.
- Add scripts:
  - `npm run typecheck`
  - `npm test`
  - `npm run test:public`
  - `npm run build`
  - `npm run dev`
- Do not create `.env`.

## Acceptance Criteria

- Fresh install works from inside `assessments/lead-ops-assessment/`.
- Typecheck command exists.
- Public test command exists.
- Build command exists.
- No real secrets or real env files are created.

## Verification

```bash
cd assessments/lead-ops-assessment
test -f package.json
test -f .env.example
test ! -f .env
npm install
npm run typecheck
npm run build
npm run test:public
```

## Completion Evidence

Node/npm:

- `node --version`: `v25.9.0`
- `npm --version`: `11.12.1`

Command results from `assessments/lead-ops-assessment/`:

- `test -f package.json`: passed.
- `test -f .env.example`: passed.
- `test ! -f .env`: passed.
- `npm install`: passed; initial fresh install added 160 packages and found 0 vulnerabilities. A final metadata sync after tightening the Node engine audited 162 packages and found 0 vulnerabilities.
- `npm run typecheck`: passed.
- `npm run build`: passed; Vite built `dist/` successfully.
- `npm run test:public`: passed; 6 test files and 9 tests passed.
- `npm test`: passed; 6 test files and 9 tests passed.
- `npm run dev -- --port 5173`: started successfully; `curl -I http://127.0.0.1:5173/` returned `HTTP/1.1 200 OK`.

Control-plane notes:

- `BLI_ACTIVE_TICKET` was not set in the shell, so Cockpit active-ticket binding could not be verified from environment.
- Cockpit CLI was not available, so lifecycle events were not emitted.
- Provided `DISPATCH.md` path was missing locally: `.codex-autorunner/runs/38002d98-664c-4751-93d6-f42f91605093/DISPATCH.md`.
