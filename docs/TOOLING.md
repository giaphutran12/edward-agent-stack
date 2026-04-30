# Tooling

This is the default intern tool stack.

Most tools should be installed or verified by Codex through `scripts/install.sh` and `scripts/verify.sh`. Interns should not manually paste random install commands unless Codex asks them to and explains why.

Install is best-effort. If auth, API keys, Docker Desktop, or a vendor login blocks setup, Codex should stop and report exactly what is missing instead of forcing it.

## Core CLIs

| Tool | Why it matters | Secret needed? |
| --- | --- | --- |
| Codex | primary coding agent | account login |
| Edward's `codex-gstack` | Edward's Codex-compatible gstack fork | no |
| MemPalace | durable agent memory | no, local setup |
| Repowise | repo/code intelligence | provider API key for generation |
| Nia CLI | search personal/local indexed context when available | account/login may be needed |
| Supabase CLI | database migrations and local/remote Supabase workflows | project login/token may be needed |
| Vercel CLI | deploy and inspect Vercel projects | account login/token may be needed |
| Claude Code | secondary agent option | account login |
| GitHub CLI | repo/PR/issues | account login |
| ripgrep (`rg`) | fast code search | no |
| tmux | long-running terminal sessions | no |
| Docker | local services and test environments | no |
| Python, pip, uv | Python tooling and package runners | no |
| ffmpeg | media conversion/debugging | no |
| Bun, Node, npm | JS/TS package/runtime stack | no |
| jq | JSON inspection in shell | no |

## Core MCP / App Tools

Keep these:

- Exa: web/research search.
- Linear: issues and project tracking.
- MemPalace: durable agent diary/memory.
- Playwright / Browser Use: browser QA and local app testing.
- Computer Use: desktop/app control when needed.
- Repowise: repo intelligence via MCP.
- OpenAI Developer Docs: current OpenAI docs.

Use `scripts/setup-mcp.sh` to prepare the Codex MCP template. It does not write secrets.

Do not include by default:

- Notion
- TinyFish
- OMX
- Kiro
- `mlx_whisper`

## Nia

Use Nia CLI by default.

On Edward's machine, Nia CLI exists as `nia`. Nia MCP may exist in other app configs, but it is not part of the default Codex MCP stack unless Edward explicitly adds it.

## API Keys / Logins

Agents may install tools, but should not invent credentials.

If a tool needs a login or API key:

1. stop
2. say which tool needs auth
3. say why it is needed
4. ask the user to log in or load the key
5. never print or summarize secret values

## Install Philosophy

Codex should install and verify tools for the intern.

The intern should paste the repo install prompt into Codex and let Codex run the commands, fix missing dependencies, and report what passed or failed.
