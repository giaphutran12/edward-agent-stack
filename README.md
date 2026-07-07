# Edward Agent Stack

Operator playbook and install stack for interns working with Edward.

This repo gives interns the standard way to work:

- start from a company Mac local user, not personal iCloud
- install the same core agent tools
- load Edward's default engineering rules
- keep project facts in Project Notes
- keep durable decisions in Decision Notes
- escalate only with context, options, evidence, and a recommendation
- emit BLI Cockpit events for BLI-managed intern work, when Cockpit tooling is available

## Tool Stack

Core CLIs:

- Codex
- Caveman skill (`JuliusBrussee/caveman`)
- Edward's `codex-gstack`
- Supermemory
- Mem0 (Codex plugin)
- Repowise
- Nia CLI, optional after Edward approves seats
- Supabase CLI
- Vercel CLI
- Claude Code
- GitHub CLI
- ripgrep (`rg`)
- tmux
- Docker
- Python, pip, uv
- ffmpeg
- Bun, Node, npm
- jq

Core MCP / app tools:

- Exa
- Linear
- Supermemory
- Mem0 (Codex plugin)
- Playwright / Browser Use
- Computer Use
- Repowise
- OpenAI Developer Docs

Not in the default intern stack: Notion, TinyFish, OMX, Kiro, `mlx_whisper`.

BLI-specific add-on: Cockpit emitter tooling (`bli-event`, `worker-emit.sh`, and a ticket-bound session launcher) should be installed when the intern is working inside BLI Cockpit-managed projects. See [docs/COCKPIT.md](docs/COCKPIT.md).

## One Block To Paste Into Codex

Paste this into Codex on a fresh machine:

```text
Install Edward's agent stack on this fresh company Mac. Before anything else, make sure macOS itself is fully updated (System Settings > General > Software Update) — Homebrew and Docker Desktop require a current macOS; if an update is pending, tell me to install it first and stop. During macOS setup, use a local macOS user and skip Apple Account/iCloud; do not use a personal iCloud account. Clone https://github.com/giaphutran12/edward-agent-stack to ~/edward-agent-stack, read AGENTS.md, then run ./scripts/bootstrap-macos.sh, ./scripts/install.sh, ./scripts/verify.sh, and ./scripts/auth-doctor.sh. Use /caveman ultra for terse token-saving communication. Install prerequisites automatically when safe: Xcode Command Line Tools prompt, Homebrew, Node/npm/npx, Bun, Python/pip/uv, GitHub CLI, ripgrep, jq, tmux, ffmpeg, Supabase CLI, Vercel CLI, Claude Code, Repowise, Caveman, Edward skills, and giaphutran12/codex-gstack for Codex using ./setup --host codex. Treat Nia as optional; do not create or require a Nia account unless Edward approves a seat. Do not inspect or print local real env/secret files. If a tool is already installed, leave it exactly as is and move on; do not reinstall, upgrade, or reconfigure it. If a tool needs login, API key, license acceptance, or a GUI first-run step, stop and tell me exactly what is missing instead of forcing it. Use docs/AUTH_GATES.md for exact official links and safe commands. After install, tell me exactly what passed, what failed, and what I need to do next.
```

Installer maintainers should run the clean-home test before changing setup behavior:

```bash
./scripts/fresh-mac-sandbox.sh --keep
```

## Manual Install

Prerequisite: update macOS to the latest version first (System Settings → General → Software Update). Homebrew supports only the last ~3 macOS releases and the Docker Desktop cask requires a current macOS.

```bash
git clone https://github.com/giaphutran12/edward-agent-stack ~/edward-agent-stack
cd ~/edward-agent-stack
./scripts/bootstrap-macos.sh
./scripts/install.sh
./scripts/verify.sh
./scripts/auth-doctor.sh
```

Installer behavior:

- bootstraps fresh macOS prerequisites: Xcode Command Line Tools prompt, Homebrew, Homebrew shell path, and Rosetta on Apple Silicon
- treats Homebrew as a required fresh-Mac baseline on macOS; if Xcode CLT or Homebrew needs a manual prompt, setup stops and tells the intern what to finish before rerunning
- installs easy CLI tools best-effort
- installs Caveman and Edward skills
- installs Edward's `codex-gstack`
- prepares a Codex MCP config template at `dist/codex-mcp.example.toml`
- stops at auth/key gates instead of forcing broken logins

Manual auth still needed for tools like Exa, Linear, GitHub, Vercel, and Supabase. Nia is optional; use `nia auth login` only if Edward approves a Nia seat for this intern.
Run `./scripts/auth-doctor.sh` after install for a safe missing-auth report. Detailed fixes live in [docs/AUTH_GATES.md](docs/AUTH_GATES.md).

Fresh Mac details live in [docs/FRESH_MAC.md](docs/FRESH_MAC.md), including Edward's current tool snapshot and source-backed install order.

## Skills CLI Install

This repo follows the Agent Skills layout, so Vercel's skills CLI can discover `skills/*/SKILL.md`:

```bash
npx skills add giaphutran12/edward-agent-stack --agent codex --skill '*' --global --yes
```

The repo installer is still the recommended path because it also installs Edward's `codex-gstack` fork and writes the user-scope snippet.

Install caveman separately if needed:

```bash
npx --yes skills add JuliusBrussee/caveman --agent codex --skill caveman --global --yes
```

If an agent host cannot discover skills, use [agents/AGENTS.md](agents/AGENTS.md) as the fallback skill index.

## MCP Setup

Run:

```bash
./scripts/setup-mcp.sh
```

Then copy the needed blocks from `dist/codex-mcp.example.toml` into `~/.codex/config.toml`.

Do not commit keys. Exa needs a local `EXA_API_KEY`; Linear uses OAuth. Nia is optional and requires `nia auth login` only after Edward approves a seat.

## Daily Workflow

At the start of a project task, the agent should load:

0. `/caveman ultra`
1. `$edward-rules` from `skills/edward-rules/SKILL.md`
2. only the child skill/reference it routes to, if needed
3. the current project's `PROJECT.md`
4. recent relevant files under that project's `decisions/`
5. `AGENTS.local.md`, if the intern has one

`edward-rules` is the parent skill. It routes to child skills like `edward-decision-capture`, `edward-escalation`, and `edward-project-notes` without loading every detail up front.

For BLI Cockpit-managed work, the agent should also verify active-ticket context before implementation:

- operator identity is authenticated
- `BLI_ACTIVE_TICKET` is set by the approved launcher
- repo/worktree matches the ticket
- Cockpit emits are available, or the missing tooling is reported

Before opening a PR or ending a meaningful task, the agent should run decision capture:

- Did Edward make a reusable decision?
- Did project context change?
- Should Project Notes or Decision Notes be updated?
- If no, say `No note update needed` and why.

For Cockpit-integrated work, decision capture has two outputs:

- repo note: Project Notes or Decision Notes for humans and agents reading the codebase
- Cockpit event: `decision_record` for aggregation, attribution, and cohort retrospection

## Operator Standard

Intern-facing docs should read like a playbook:

- Problem: what workflow breaks without this rule.
- Standard: what to do every time.
- Reason: why the standard exists.
- Procedure: exact commands, files, or escalation format.

Only publish the final standard. Omit draft notes, process notes, and cleanup notes.

Cockpit-bound writes use the same full operator standard even when `/caveman ultra` is active:

- event payloads
- findings
- PR bodies
- Decision Notes
- escalation messages

## Best GStack Path For Interns

Use Edward's Codex-compatible fork:

```bash
git clone --single-branch --depth 1 https://github.com/giaphutran12/codex-gstack.git ~/.gstack/repos/gstack
cd ~/.gstack/repos/gstack
./setup --host codex
```

The fork carries Codex-specific patches on top of upstream gstack:

- Codex host runtime overlay
- Codex subagent mapping
- full-skill loading for review subagents
- skip nested `/codex` and `/claude` self-invocation paths
- default Codex model overlay for `gpt-5.5`

The fork is frozen at tag `frozen-v1` and no longer tracks upstream
`garrytan/gstack`. Do not use GitHub "discard commits", `git reset --hard
upstream/main`, or force pushes on the fork. `./scripts/update.sh`
fast-forwards it from `giaphutran12/codex-gstack` `origin/main` only. See the
Freeze Policy in [docs/GSTACK.md](docs/GSTACK.md).

## Repowise

Repowise is for repo/code orientation. It is not Edward Rules.

Use this repo's wrapper instead of manually exporting provider env every time:

```bash
./scripts/repowise-update.sh /path/to/project --provider gemini
```

Repowise already supports:

- `repowise hook install`
- `repowise update --provider ...`
- `repowise update --workspace`
- `repowise watch --workspace`

The missing piece is Codex-native lifecycle support, so this repo wraps the CLI safely.

## Updating This Stack

```bash
cd ~/edward-agent-stack
./scripts/update.sh
./scripts/verify.sh
```

Update flow detects install state, avoids overwriting local work, fast-forwards
this stack when safe, updates `codex-gstack` through the overlay plugin, runs
setup/verification, and summarizes the result.

## Contribution Rule

Interns may update Project Notes and Decision Notes through PRs.

Edward Rules are higher risk. Changes to Edward Rules should be reviewed by Edward.
