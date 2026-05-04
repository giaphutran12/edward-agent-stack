# Decision: Raw Capture First

Date: 2026-05-04
Status: active
Source: Edward directive during Cockpit and intern setup work

## Question

How should Edward Agent Stack handle Codex session material for Cockpit, intern coaching, and future evaluator work?

## Decision

Capture the raw session evidence first. Put analysis, summaries, scores, and coaching reports on top of that raw layer.

The standard has two lanes:

- raw evidence pack: exact session export stored in an access-controlled location
- analysis lane: lifecycle events, summaries, reports, dashboards, and evaluator output derived from the raw evidence pack

Do not make a summary-only system the default record.

## Why

Raw evidence is the source of truth. If it is missing, later analysis cannot recover the original prompts, outputs, tool calls, timing, or handoff context.

Analysis can improve over time. The raw layer lets Edward add better evaluators later without losing past sessions.

## Applies To

- `docs/COCKPIT.md`
- BLI Cockpit session export tooling
- intern coaching dashboards
- future evaluator and weekly-review jobs

## Procedure

1. Capture raw session evidence into a controlled evidence pack.
2. Record a manifest path, event count, and hashes or stable ids in Cockpit events.
3. Generate summaries and coaching reports from the evidence pack.
4. Do not print raw evidence into chat, PR bodies, Slack, or generated docs unless Edward explicitly approves that destination.
5. Preserve secret discipline: real env files remain execution-only, and secret values are never intentionally printed.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `docs/COCKPIT.md`

## Related Project Notes

- `projects/edward-agent-stack/PROJECT.md`
