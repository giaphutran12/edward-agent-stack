# Project Notes: Edward Agent Stack

Last updated: 2026-04-30
Freshness: current as of local repo state
Owner: Edward Tran

## Goal

Give interns an agent-native setup that Codex can install and verify on fresh MacBooks.

This repo is public-safe operating practice, not Edward's private memory dump.

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

- Adding shared-secret tooling to the default intern stack.
- Adding a new required database, vector store, queue, or hosting platform.
- Changing the default gstack fork or setup flow.
- Exposing private project data, private Codex sessions, or real env files.

## Gotchas

- Bitwarden is not in the default intern stack. See `decisions/2026-04-30-no-bitwarden-default.md`.
- Do not inspect real env files. Execution-only loading is allowed when needed.
- Keep generated benchmark artifacts out of stack decisions unless Edward asks to publish them.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-rules/references/tooling.md`

## Recent Decisions

- `decisions/2026-04-30-no-bitwarden-default.md`

## Stale Or Uncertain Info

- Tool versions in `docs/FRESH_MAC.md` are a snapshot, not a promise that every intern Mac will match Edward's machine.
