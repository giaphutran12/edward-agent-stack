# Fresh Mac Setup

This stack assumes interns start from a clean company-owned Apple Silicon Mac.

## macOS Account Baseline

Problem: personal iCloud on a company Mac can mix personal data with work data and create device ownership or Activation Lock cleanup problems when the internship ends.

Standard: use a local macOS user for day-one setup. Skip Apple Account/iCloud during macOS setup. Do not sign into personal iCloud, iCloud Drive, Find My, Photos, Messages, or personal Keychain on the intern Mac.

Reason: the intern only needs a working local user plus BLI/work accounts for Codex, GitHub, Slack, Teams, Outlook, Supabase, Vercel, and other work tools. Managed Apple Accounts and MDM are the right long-term company path, but they are not required for tonight's setup.

Procedure:

1. Create a local macOS user for the intern.
2. Choose "Set Up Later" or "Skip" for Apple Account/iCloud prompts.
3. Log into work apps with the intern's BLI/work email only.
4. If Apple Account, iCloud, Find My, or Activation Lock becomes required, stop and escalate to Edward before continuing.

## Install Order

1. Update macOS first: System Settings → General → Software Update, install the latest macOS before anything else. Homebrew only supports the last ~3 macOS releases and the Docker Desktop cask refuses to install on older macOS; skipping this surfaces later as confusing tool failures in `verify.sh`.
2. Local macOS user: no personal iCloud or Apple Account.
3. Xcode Command Line Tools: needed for `git`, compilers, and Homebrew bootstrap.
4. Homebrew: required macOS package manager. Apple Silicon prefix is `/opt/homebrew`.
5. Homebrew shell path: add `eval "$(/opt/homebrew/bin/brew shellenv)"` to `~/.zprofile`.
6. Node/npm/npx: install with Homebrew for the simple global baseline.
7. Bun, Python, uv, GitHub CLI, ripgrep, jq, tmux, ffmpeg, Supabase CLI, Vercel CLI.
8. Agent CLIs: Codex, Claude Code, Repowise. Nia is optional after Edward approves seats.
9. Docker Desktop: install if possible, but first run/license/login may require manual GUI.
10. Edward stack: Caveman, Edward skills, Codex gstack fork, MCP template.
11. Auth gates: GitHub/Vercel/Supabase/Claude/Codex need their own login; Exa and Repowise providers need API keys. Nia needs `nia auth login` only if Edward approves a Nia seat.

Use:

```bash
./scripts/bootstrap-macos.sh
./scripts/install.sh
./scripts/verify.sh
./scripts/auth-doctor.sh
```

## Homebrew Gate

Problem: without Homebrew, fresh Macs drift into manual one-off installs and the stack cannot reliably install Node, Bun, GitHub CLI, ripgrep, jq, tmux, ffmpeg, uv, Supabase CLI, Vercel CLI, Docker Desktop, and other basics.

Standard: Homebrew is required for macOS setup. `./scripts/bootstrap-macos.sh` installs or verifies it before core tools. If Xcode Command Line Tools or Homebrew needs a password/dialog/manual step, the installer stops and tells the intern to finish that gate before rerunning.

Reason: the day-one setup should be repeatable. The agent should not hide a missing package manager behind later tool failures.

Procedure:

```bash
./scripts/bootstrap-macos.sh
command -v brew
brew --prefix
./scripts/install.sh
./scripts/verify.sh
```

## Sandbox Test

Problem: a setup repo can pass on Edward's long-lived machine while failing in a clean user home.

Standard: before changing installer behavior, run the fresh-home sandbox.

Reason: the sandbox catches missing skill links, gstack setup assumptions, MCP template issues, and auth-doctor behavior without relying on Edward's existing `~/.codex`, `~/.agents`, or `~/.gstack` state.

Procedure:

```bash
./scripts/fresh-mac-sandbox.sh --keep
```

Default mode uses a temp `HOME` and skips base macOS bootstrap. It refuses to install global tools unless `--allow-global-installs` is passed.

If Playwright Chromium reports `bootstrap_check_in ... Permission denied`, the command runner sandbox blocked browser launch. Rerun the same sandbox command from a normal Terminal or an approved unrestricted Codex command.

Use the full macOS bootstrap only on a throwaway Mac or first-run intern Mac:

```bash
./scripts/fresh-mac-sandbox.sh --with-macos-bootstrap --allow-global-installs --keep
```

## Edward Machine Snapshot

Captured on 2026-04-30 from Edward's Mac:

| Tool | Path | Version |
| --- | --- | --- |
| macOS | arm64 | 26.4.1 |
| Homebrew | `/opt/homebrew/bin/brew` | 5.1.8 |
| Node | `/opt/homebrew/bin/node` | 25.9.0 |
| npm/npx | `/opt/homebrew/bin/npm` | 11.12.1 |
| Bun | `~/.bun/bin/bun` | 1.3.5 |
| Python | `/opt/homebrew/bin/python3` | 3.14.4 |
| uv | `/opt/homebrew/bin/uv` | 0.9.28 |
| git | `/opt/homebrew/bin/git` | 2.51.2 |
| gh | `/opt/homebrew/bin/gh` | 2.85.0 |
| ripgrep | `/opt/homebrew/bin/rg` | 15.1.0 |
| jq | `/usr/bin/jq` | 1.7.1 Apple |
| Docker | `/usr/local/bin/docker` | 29.1.3 |
| Supabase CLI | `/opt/homebrew/bin/supabase` | 2.84.2 |
| Vercel CLI | `/opt/homebrew/bin/vercel` | 50.32.5 |
| Claude Code | `~/.local/bin/claude` | 2.1.114 |
| Nia CLI | `~/.bun/bin/nia` | 0.5.2 |
| Codex CLI | `/opt/homebrew/bin/codex` | 0.124.0 |
| Repowise | `~/.local/bin/repowise` | 0.3.0 |

Do not blindly clone every installed package from Edward's machine. Install the stack surface above, then let project repos install their own dependencies from lockfiles.

## Source Notes

- [Homebrew installation docs](https://docs.brew.sh/Installation) say Apple Silicon default prefix is `/opt/homebrew` and Command Line Tools are required.
- [Homebrew Node formula](https://formulae.brew.sh/formula/node) lists `brew install node` for Node.
- [Supabase CLI docs](https://supabase.com/docs/guides/cli/getting-started) say use Homebrew for global CLI install and do not globally install Supabase CLI through npm.
- [Bun install docs](https://bun.sh/docs/installation) support script or package-manager install and require PATH setup for `~/.bun/bin`.
- [Docker Desktop macOS docs](https://docs.docker.com/desktop/setup/install/mac-install/) support macOS Apple Silicon install, but Desktop first-run/license/setup remains partly GUI/user-gated.
