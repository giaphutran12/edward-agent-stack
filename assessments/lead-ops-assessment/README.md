# Lead Ops Assessment

Candidate-safe scaffold for the lead operations take-home app. The app models a local lead intake workflow with fake webhook and CRM integrations. It does not require real credentials, real customer data, vendor accounts, OAuth, or live network services.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Commands

Run from this directory:

```bash
npm install
npm run typecheck
npm test
npm run test:public
npm run build
npm run dev
```

Use `.env.example` only as documentation for placeholder config names. Do not create or commit `.env` or other real env files.

## Structure

- `src/domain/` contains pure TypeScript lead normalization, merge, and assignment helpers.
- `src/repository/` contains deterministic in-memory fixture state.
- `src/integrations/` contains fake fixture-backed webhook and CRM helpers.
- `src/jobs/` contains local queue and CRM worker primitives.
- `src/server/routes/` contains route-level handlers that compose the domain modules.
- `src/app/` contains the Vite/React ops UI.
- `tests/public/` contains candidate-safe tests that should pass on the baseline.

## Local Workflow

1. Install dependencies with `npm install`.
2. Run public verification with `npm run typecheck`, `npm run test:public`, and `npm run build`.
3. Start the UI with `npm run dev`.
4. Use the fake fixtures and route helpers to inspect lead intake, CRM sync, and operator visibility behavior.
