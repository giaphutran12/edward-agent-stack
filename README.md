# Edward Agent Stack

Agent-native setup for interns working with Edward.

This repo is not a private memory dump. It is a public-safe operating system:

- Edward Rules: stable engineering defaults and judgment patterns
- Project Notes: current per-project context
- Decision Notes: dated decisions so the same question is not asked twice
- install/update scripts for Codex, Edward's gstack fork, Repowise, and local agent rules

## Tool Stack

Core CLIs:

- Codex
- Caveman skill (`JuliusBrussee/caveman`)
- Edward's `codex-gstack`
- MemPalace
- Repowise
- Nia CLI
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
- MemPalace
- Playwright / Browser Use
- Computer Use
- Repowise
- OpenAI Developer Docs

Not in the default intern stack: Notion, TinyFish, OMX, Kiro, `mlx_whisper`.

## One Block To Paste Into Codex

Paste this into Codex on a fresh machine:

```text
Install Edward's agent stack. Clone https://github.com/giaphutran12/edward-agent-stack to ~/edward-agent-stack, read AGENTS.md, then run ./scripts/install.sh and ./scripts/verify.sh. Use /caveman ultra for terse token-saving communication. Install Edward's skills into Codex, especially $edward-rules. Install giaphutran12/codex-gstack for Codex using ./setup --host codex. Do not inspect or print real env/secret files. If a secret is needed, stop and ask me to load it. After install, tell me exactly what passed, what failed, and what I need to do next.
```

## Manual Install

```bash
git clone https://github.com/giaphutran12/edward-agent-stack ~/edward-agent-stack
cd ~/edward-agent-stack
./scripts/install.sh
./scripts/verify.sh
```

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

## Daily Use

At the start of a project task, the agent should load:

0. `/caveman ultra`
1. `$edward-rules` from `skills/edward-rules/SKILL.md`
2. only the child skill/reference it routes to, if needed
3. the current project's `PROJECT.md`
4. recent relevant files under that project's `decisions/`
5. `AGENTS.local.md`, if the intern has one

`edward-rules` is the parent skill. It routes to child skills like `edward-decision-capture`, `edward-escalation`, and `edward-project-notes` without loading every detail up front.

Before opening a PR or ending a meaningful task, the agent should run decision capture:

- Did Edward make a reusable decision?
- Did project context change?
- Should Project Notes or Decision Notes be updated?
- If no, say `No note update needed` and why.

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
- default Codex model overlay

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

Update flow mirrors gstack-upgrade: detect install, backup, fetch/reset, run setup, verify, summarize.

## Contribution Rule

Interns may update Project Notes and Decision Notes through PRs.

Edward Rules are higher risk. Changes to Edward Rules should be reviewed by Edward.
