# Decision: Secret Access Policy

Date: 2026-04-30
Status: active
Source: Edward directive

## Question

How should Edward Agent Stack handle intern secret access by default?

## Decision

Do not install or require a shared-secret vault by default.

Use project-specific secret access:

- per-user vendor accounts when possible
- staging-only or low-quota keys for interns
- local ignored env files for project-specific keys
- short-lived tokens when vendors support them
- logging, revocation, and scheduled rotation

## Why

Once a credential is readable, the meaningful controls are scope, logging, revocation, and rotation. A shared vault may help distribution hygiene, but it is not the default access-control model for this stack.

## Applies To

- `README.md`
- `docs/AUTH_GATES.md`
- `docs/FRESH_MAC.md`
- `docs/TOOLING.md`
- `scripts/install-tools.sh`
- `scripts/verify.sh`
- `scripts/auth-doctor.sh`

## Tradeoff

Gain: simpler install, clearer trust model, fewer default auth gates for interns.

Give up: no default shared-secret vault workflow.

## Risk / Blast Radius

Projects that need shared secrets must define that policy separately. Do not add a shared-secret vault as a global default.

## Revisit When

Edward decides on a company-wide secret policy, a secrets proxy, or per-project access-control standard.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-rules/references/tooling.md`

## Related Project Notes

- `projects/edward-agent-stack/PROJECT.md`
