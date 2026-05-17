# Project Notes: Edward Agent Stack

Last updated: 2026-05-17
Freshness: current as of local repo state
Owner: Edward Tran

## Goal

Give interns an agent-native setup that Codex can install and verify on fresh MacBooks.

The finished material should read like an operator playbook: problem, standard, reason, procedure.

## Current Priority

Keep the intern and candidate setup realistic:

- Start company Macs with a local macOS user and no personal iCloud.
- Treat Homebrew as a required macOS baseline, not an optional convenience.
- Codex installs the boring tooling.
- Humans complete account/API-key gates.
- Agent reports what is missing instead of forcing broken auth.
- Candidate take-home repos should be private, one repo per candidate, and safe to run without secrets or global installers.
- When possible, offer Codespaces before local setup so candidates can start from a browser.

## Stack

- Agent: Codex
- Agent style: Caveman ultra
- Workflow: Edward Rules, project notes, decision notes
- Repo tools: Codex-compatible gstack fork, Codex GStack Overlay plugin, Repowise, MemPalace, Nia when authenticated
- App/MCP tools: Exa, Linear, Browser Use/Playwright, Computer Use, OpenAI Developer Docs

## Ask Edward Before

- Adding shared-secret tooling to the default intern install.
- Adding a new required database, vector store, queue, or hosting platform.
- Changing the default gstack fork or setup flow.
- Adding customer data, project data, session logs, or real env files.

## Gotchas

- Shared-secret vaults are project-specific. See `decisions/2026-04-30-secret-access-policy.md`.
- `codex-gstack` is a fork. Sync it through the overlay plugin, not reset/discard/force-push flows. See `decisions/2026-05-03-codex-gstack-overlay-sync.md`.
- Do not inspect real env files. Execution-only loading is allowed when needed.
- Do not publish generated benchmark artifacts unless Edward asks for them.
- If Homebrew/Xcode CLT setup needs a GUI prompt or password, stop and rerun after the human finishes that gate.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-rules/references/tooling.md`

## Recent Decisions

- `decisions/2026-04-30-secret-access-policy.md`
- `decisions/2026-05-03-codex-gstack-overlay-sync.md`
- `decisions/2026-05-04-raw-capture-first.md`
- `decisions/2026-05-04-local-macos-account-setup.md`
- `decisions/2026-05-04-homebrew-required-baseline.md`
- `decisions/2026-05-17-candidate-repo-rollout.md`

## Stale Or Uncertain Info

- Tool versions in `docs/FRESH_MAC.md` are a snapshot, not a promise that every intern Mac will match Edward's machine.
