# Decision: No Bitwarden Default

Date: 2026-04-30
Status: active
Source: Edward conversation

## Question

Should Edward Agent Stack install and check Bitwarden CLI by default for interns?

## Decision

No. Bitwarden is not part of the default intern stack.

## Why

A password manager avoids pasting secrets in Slack, but it does not prevent a trusted intern or local agent from copying a raw key after access is granted. That makes it the wrong default control for this repo.

Default posture:

- use per-user vendor accounts when possible
- issue staging-only or low-quota keys for interns
- store project-specific keys in local ignored env files
- prefer short-lived tokens when vendors support them
- rely on logs, revocation, and scheduled rotation

## Applies To

- `README.md`
- `docs/AUTH_GATES.md`
- `docs/FRESH_MAC.md`
- `docs/TOOLING.md`
- `scripts/install-tools.sh`
- `scripts/verify.sh`
- `scripts/auth-doctor.sh`

## Tradeoff

Gain: simpler install, less fake security theater, fewer auth gates for interns.

Give up: no default shared-secret vault workflow in this repo.

## Risk / Blast Radius

Projects that truly need shared secrets must define that policy separately. Do not silently re-add Bitwarden as a global default.

## Revisit When

Edward decides on a company-wide secret policy, a secrets proxy, or per-project access-control standard.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-rules/references/tooling.md`

## Related Project Notes

- `projects/edward-agent-stack/PROJECT.md`
