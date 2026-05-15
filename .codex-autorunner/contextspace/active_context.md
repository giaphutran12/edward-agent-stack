# Active Context

This repo now contains a Codex Autorunner queue for building the `lead-ops-assessment` take-home package.

Current state:

- Branch: `codex/takehome-autorunner-tickets`
- Autorunner initialized under `.codex-autorunner/`
- Hub manifest registers this repo as `edward-clone`
- Runtime destination is local
- `car ticket-flow preflight --repo /Users/edwardtran/BLI/edward-clone --no-json` passes
- Repowise is installed but this checkout has zero indexed pages
- The queue should build a candidate-safe assessment app under `assessments/lead-ops-assessment/`

Important constraints:

- Never read or create real env/secret files.
- Use `.env.example` only.
- Keep reviewer answer key separate from candidate export.
- Keep all integrations fake and fixture-backed.
- Keep every ticket machine-testable.
- Use private per-candidate repo copies, not one shared PR target.

Preferred final commands once ready to execute:

```bash
python3 .codex-autorunner/bin/lint_tickets.py
car ticket-flow preflight --repo /Users/edwardtran/BLI/edward-clone --no-json
car ticket-flow start --repo /Users/edwardtran/BLI/edward-clone
```
