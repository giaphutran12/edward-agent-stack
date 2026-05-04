# Decision: Local macOS Account Setup

Date: 2026-05-04
Status: active
Source: Edward conversation

## Question

Should intern Macs use personal iCloud, a shared BLI Apple Account, or a local macOS user during day-one setup?

## Decision

Use a local macOS user for day-one intern setup. Skip Apple Account/iCloud during macOS setup. Do not sign into personal iCloud, iCloud Drive, Find My, Photos, Messages, or personal Keychain on intern Macs.

## Why

Personal iCloud mixes personal data with company work and can create device ownership or Activation Lock cleanup problems when the internship ends. A shared Apple Account is also not the right control point. Interns only need local macOS access plus BLI/work accounts for Codex, GitHub, Slack, Teams, Outlook, Supabase, Vercel, and other work tools.

## Applies To

- Fresh Mac setup docs
- Intern onboarding prompts
- Day-one Mac mini/MacBook setup
- Future Apple Business Manager / MDM planning

## Tradeoff

We gain a fast, clean setup that avoids personal account entanglement. We give up iCloud sync and managed Apple-account controls until Apple Business Manager, Managed Apple Accounts, and MDM are set up.

## Risk / Blast Radius

If a tool unexpectedly requires Apple Account or iCloud, setup may pause. The agent or intern should stop and escalate instead of signing into a personal account.

## Revisit When

BLI has Apple Business Manager, Managed Apple Accounts, and MDM ready for intern devices.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`

## Related Project Notes

- `projects/edward-agent-stack/PROJECT.md#current-priority`
