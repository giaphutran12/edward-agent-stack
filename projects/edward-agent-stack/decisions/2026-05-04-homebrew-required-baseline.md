# Decision: Homebrew Required Baseline

Date: 2026-05-04
Status: active
Source: Edward conversation

## Question

Should Homebrew be optional or required for a fresh intern Mac running Edward Agent Stack?

## Decision

Homebrew is required for macOS setup. The installer should verify or install Homebrew before core tooling. If Xcode Command Line Tools, Homebrew, a password prompt, or another macOS dialog blocks setup, the installer should stop and tell the intern what to finish before rerunning.

## Why

Fresh Mac setup needs a stable package manager before installing the basic developer surface. Without Homebrew, Node, Bun, GitHub CLI, ripgrep, jq, tmux, ffmpeg, uv, Supabase CLI, Vercel CLI, Docker Desktop, and similar tools drift into manual one-off installs.

## Applies To

- `scripts/bootstrap-macos.sh`
- `scripts/install.sh`
- `scripts/install-tools.sh`
- `scripts/verify.sh`
- Fresh Mac onboarding docs

## Tradeoff

We gain a repeatable setup and clearer failure mode. We give up trying to limp forward when the package manager is missing.

## Risk / Blast Radius

Fresh Macs may stop earlier if Xcode Command Line Tools or Homebrew needs user action. That is acceptable because later failures would be noisier and harder for interns to diagnose.

## Revisit When

Edward chooses another standard package manager or MDM-managed developer image replaces one-prompt setup.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`

## Related Project Notes

- `projects/edward-agent-stack/PROJECT.md#current-priority`
