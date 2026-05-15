<!-- CAR:TICKETS_AGENTS -->
# Tickets — AGENTS

This folder is the authoritative ticket queue for this repo/worktree.

## Ticket files
- Store work items as `TICKET-###*.md` (ordered by number).
- Keep frontmatter `done: true|false` in sync with completion.
- After edits, lint tickets with the canonical entrypoint: `python3 .codex-autorunner/bin/lint_tickets.py`.
- `python3 .codex-autorunner/bin/ticket_tool.py lint` is a compatibility wrapper around the same implementation.

## Ticket CLI (portable)
- List: `python3 .codex-autorunner/bin/ticket_tool.py list`
- Create: `python3 .codex-autorunner/bin/ticket_tool.py create --title "..." --agent codex`
- Insert gap: `python3 .codex-autorunner/bin/ticket_tool.py insert --before N`
- Move block: `python3 .codex-autorunner/bin/ticket_tool.py move --start A --end B --to T`
- Lint compatibility alias: `python3 .codex-autorunner/bin/ticket_tool.py lint`

## Ticket flow (runner)
- See `.codex-autorunner/TICKET_FLOW_QUICKSTART.md` for `car ticket-flow ...` commands.
