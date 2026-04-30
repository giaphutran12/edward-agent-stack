# Project Notes: Edward Agent Stack

Last updated: 2026-04-30
Freshness: current as of local repo state
Owner: Edward Tran

## Goal

Give interns an agent-native setup that Codex can install and verify on fresh MacBooks.

The finished material should read like an operator playbook: problem, standard, reason, procedure.

## Current Priority

Keep the install realistic:

- Codex installs the boring tooling.
- Humans complete account/API-key gates.
- Agent reports what is missing instead of forcing broken auth.

## Stack

- Agent: Codex
- Agent style: Caveman ultra
- Workflow: Edward Rules, project notes, decision notes
- Repo tools: Codex-compatible gstack fork, Repowise, MemPalace, Nia when authenticated
- App/MCP tools: Exa, Linear, Browser Use/Playwright, Computer Use, OpenAI Developer Docs

## Ask Edward Before

- Adding shared-secret tooling to the default intern install.
- Adding a new required database, vector store, queue, or hosting platform.
- Changing the default gstack fork or setup flow.
- Adding customer data, project data, session logs, or real env files.

## Gotchas

- Shared-secret vaults are project-specific. See `decisions/2026-04-30-secret-access-policy.md`.
- Do not inspect real env files. Execution-only loading is allowed when needed.
- Do not publish generated benchmark artifacts unless Edward asks for them.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-rules/references/tooling.md`

## Recent Decisions

- `decisions/2026-04-30-secret-access-policy.md`

## Stale Or Uncertain Info

- Tool versions in `docs/FRESH_MAC.md` are a snapshot, not a promise that every intern Mac will match Edward's machine.
