# Auth Gates

The installer can install binaries. It cannot create accounts, approve OAuth, accept product licenses, or invent API keys.

Run:

```bash
./scripts/auth-doctor.sh
```

The doctor prints only pass/warn status. It must not print tokens, API keys, or secret values.

## What The Agent Should Tell Interns

Use this when setup is incomplete:

```text
Your machine has the Edward stack installed, but some auth/API gates are still missing. Do not paste secrets into chat unless Edward explicitly asks. Open the official link, log in, create the needed token/key, then run the command below. After each step, rerun ./scripts/auth-doctor.sh.
```

## Login Checklist

| Tool | Why | Command | Official link |
| --- | --- | --- | --- |
| Codex | primary coding agent | `codex login` | https://developers.openai.com/codex |
| Claude Code | secondary agent | `claude auth login` | https://docs.anthropic.com/en/docs/claude-code |
| GitHub CLI | clone/push/PR/issues | `gh auth login --web` | https://cli.github.com/manual/gh_auth_login |
| Vercel CLI | deploy and inspect projects | `vercel login` | https://vercel.com/docs/cli/login |
| Supabase CLI | migrations/project management | `supabase login` | https://supabase.com/docs/reference/cli/supabase-login |
| Nia CLI | indexed repo/docs/search/vault | `nia auth login` | https://www.trynia.ai |
| Docker Desktop | local Supabase/services | open Docker app once | https://docs.docker.com/desktop/setup/install/mac-install/ |

## Exa MCP

Exa is an API-key gate. The installer writes a template only:

```bash
./scripts/setup-mcp.sh
```

Then the intern or agent must copy the `exa` block from `dist/codex-mcp.example.toml` into local `~/.codex/config.toml` and replace `<EXA_API_KEY>` with a real key.

Get key:

```text
https://dashboard.exa.ai/api-keys
```

Do not commit the key. Do not put the key in this repo.

## Linear MCP

Linear is OAuth/workspace access. Keep the MCP config local. When Codex/browser asks for Linear auth, complete OAuth. If auth fails, confirm the intern has access to the right Linear workspace.

Start from:

```text
https://linear.app
```

## Shared Secrets

Bitwarden is not part of the default intern stack.

Reason: a password manager helps avoid pasting keys into Slack, but it does not stop a trusted intern or local agent from copying a raw key once they can read it. For this stack, prefer boring controls:

- per-user vendor accounts when possible
- staging-only or low-quota keys for interns
- local ignored env files for project-specific keys
- short-lived tokens when the vendor supports them
- logging, revocation, and scheduled rotation

If a project truly needs shared secrets, Edward should decide the tool and access policy per project.

## launchctl

`launchctl setenv KEY value` sets a variable for future macOS GUI apps launched from the user session. It does not update the current shell, and it is not a good secret store.

Use `launchctl` only for non-secret runtime settings when a GUI app needs them.

Do not use `launchctl` for API keys unless Edward explicitly decides the risk is acceptable. Prefer:

- tool-native login/keychain (`gh auth login`, `supabase login`, `vercel login`)
- per-user vendor accounts and low-scope keys
- local ignored files for per-project keys, such as `.repowise/.env`
- `~/.zprofile` / shell exports for non-secret CLI defaults

## Repowise Gemini

Repowise stores provider config in `.repowise/config.yaml`.

For Gemini API key persistence per project:

```bash
cd /path/to/project
mkdir -p .repowise
chmod 700 .repowise
printf 'GEMINI_API_KEY=%s\n' "$GEMINI_API_KEY" > .repowise/.env
chmod 600 .repowise/.env
grep -qxF '.repowise/.env' .gitignore || printf '\n# repowise API keys (local)\n.repowise/.env\n' >> .gitignore
repowise init --provider gemini
repowise update --provider gemini
```

Load the key locally, export it for the current shell, then write `.repowise/.env`. Never print it.

Get Gemini key:

```text
https://aistudio.google.com/apikey
```
