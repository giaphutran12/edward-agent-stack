<!-- CAR:TICKET_FLOW_QUICKSTART -->
# Ticket Flow Quickstart

## Start ticket flow via CLI
- Bootstrap the first run (creates TICKET-001 if needed):
  `car ticket-flow bootstrap --repo <path>`
- Start/resume without seeding tickets:
  `car ticket-flow start --repo <path>`
- Check status:
  `car ticket-flow status --repo <path> [--run-id <uuid>]`
- Resume/stop:
  `car ticket-flow start --repo <path>`
  `car ticket-flow stop --repo <path> [--run-id <uuid>]`

## Recovery when resume metadata is stale
- Use `resume` only when the target run metadata is healthy and there is no conflicting active run.
- If resume fails because another run is active, inspect that active run first.
- If the active run is healthy (`status: running`, `worker.status: alive`), resume or stop that run instead of starting a new one.
- Use `start --force-new` only after confirming the conflicting active run is stale (`worker.status: absent` / `worker metadata missing`).
  `car ticket-flow start --repo <path> --force-new`
- Verify the selected run is actually live:
  `car ticket-flow status --json --repo <path> [--run-id <uuid>]`
- Confirm status reports `status: running` and `worker.status: alive` before continuing.

## Runtime destination prerequisite
- Before starting runtime-sensitive work, confirm execution destination:
  `car hub destination show <repo_id> --path <hub_root>`
- If the repo should run in docker, configure image/runtime first:
  `car hub destination set <repo_id> docker --image <image> --path <hub_root>`
- For profile/mount/env options, see `.codex-autorunner/DESTINATION_QUICKSTART.md`.

## Where tickets live
- Tickets are per-repo/worktree under `.codex-autorunner/tickets/`.
- If the user provides ticket files, save them directly into that folder.

## Common gotchas
- Hub vs repo: ticket flows run per-repo; CLI commands need a repo path.
- `--repo` expects a filesystem path, not a hub repo_id.
- Each worktree has its own `.codex-autorunner/` directory.
- If this repo/worktree lives under a hub, it must be registered in the hub manifest to show up in the hub UI. Run: `car hub scan` (or create it via `car hub worktree create`).
