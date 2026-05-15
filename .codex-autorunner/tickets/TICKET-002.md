---
title: "Scaffold lead-ops assessment app"
agent: "codex"
done: false
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

Record Node/npm versions and command results.
