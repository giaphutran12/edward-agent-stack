# Lead Ops Assessment

Candidate-safe scaffold for the lead operations take-home app. The app models a local lead intake workflow with fake webhook and CRM integrations. It does not require real credentials, real customer data, vendor accounts, OAuth, or live network services.

## Safety

This repo is private to you. It does not ask for secrets, global installs, curl/bash installers, binary downloads, or access to real customer systems. Use `.env.example` only as documentation for placeholder config names. Do not create or commit `.env` or other real env files.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

If you do not want to install Node.js locally, open this repo in GitHub Codespaces. Codespaces uses the included `.devcontainer/devcontainer.json` and runs `npm ci` inside a browser-based development environment.

## Commands

Run from this directory:

```bash
npm ci
npm run reset
npm run typecheck
npm run worker:crm-sync -- --scenario=success --now=2026-05-16T01:00:00.000Z --max-jobs=1
npm run test:public
npm run build
npm run dev
```

## Structure

- `src/domain/` contains pure TypeScript lead normalization, merge, and assignment helpers.
- `src/repository/` contains deterministic in-memory fixture state.
- `src/integrations/` contains fake fixture-backed webhook and CRM helpers.
- `src/jobs/` contains local queue and CRM worker primitives.
- `src/server/routes/` contains route-level handlers that compose the domain modules.
- `src/app/` contains the Vite/React ops UI.
- `fixtures/repository/` contains the canonical deterministic seed snapshot.
- `incident/` contains the broker complaint and staging incident triage exercise.
- `tests/public/` contains candidate-safe tests that should pass on the baseline.

## Local Workflow

1. Install dependencies with `npm ci`.
2. Reset deterministic demo data with `npm run reset` when you want a fresh local snapshot.
3. Run the local CRM worker with `npm run worker:crm-sync -- --scenario=success --now=2026-05-16T01:00:00.000Z --max-jobs=1`.
4. Run public verification with `npm run typecheck`, `npm run test:public`, and `npm run build`.
5. Start the UI with `npm run dev`.
6. Use the fake fixtures and route helpers to inspect lead intake, CRM sync, and operator visibility behavior.
