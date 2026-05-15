# Decision: Lock Lead Ops Assessment File Boundaries

Date: 2026-05-16
Status: active
Source: `tkt_lead_ops_001_spec`

## Question

How should the lead-ops assessment separate candidate-safe files from reviewer-only answer material before implementation starts?

## Problem

The lead-ops assessment source tree will contain both candidate-safe files and reviewer-only answer material. If the boundary is informal, future tickets can leak hidden tests, seeded bug answers, scoring rubrics, or model solutions into candidate exports.

## Standard

Keep the runnable baseline app, public tests, fixtures, assignment prompt, AI disclosure template, assessment template, candidate-safe runbook, and fake intern patches in candidate-safe paths.

Keep seeded bug maps, architecture answer notes, export policy, hidden tests, answer key, scoring rubric, expected findings, model solution, export tooling, readiness report, and private-repo duplication procedure in reviewer-only paths.

Candidate export must exclude reviewer-only paths, real env files, real customer data, real external API account material, generated artifacts, and any other candidates' submissions.

## Decision

Use `assessments/lead-ops-assessment/docs/SPEC.md` and `assessments/lead-ops-assessment/docs/EXPORT_POLICY.md` as the controlling file-boundary documents. Treat `docs/RUNBOOK.md` as candidate-safe. Treat `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/EXPORT_POLICY.md`, reviewer docs, hidden tests, model solution, export tooling, readiness report, `.codex-autorunner/`, and `projects/` as reviewer-only or build-control material excluded from candidate export.

## Reason

The assessment is reusable only if every candidate receives the same safe baseline without answer leakage. Reviewer-only materials still need to live near the package so Edward can grade quickly and run hidden verification.

## Why

This keeps candidate setup simple while preserving an in-repo reviewer operating surface for grading, hidden verification, and package duplication.

## Procedure

Use these files as the controlling docs before implementation:

- `assessments/lead-ops-assessment/docs/SPEC.md`
- `assessments/lead-ops-assessment/docs/ARCHITECTURE.md`
- `assessments/lead-ops-assessment/docs/RUNBOOK.md`
- `assessments/lead-ops-assessment/docs/EXPORT_POLICY.md`

When implementation adds, moves, or renames files, update `docs/SPEC.md` and `docs/EXPORT_POLICY.md` in the same change if the candidate-safe or reviewer-only boundary changes.

Candidate-safe integrations must remain fake and fixture-backed. Do not add real customer data, real env files, or real external API accounts.

## Applies To

- `assessments/lead-ops-assessment/`
- `assessments/lead-ops-assessment/docs/SPEC.md`
- `assessments/lead-ops-assessment/docs/EXPORT_POLICY.md`
- future candidate export scripts and reviewer verification scripts
- future private per-candidate repo copies

## Tradeoff

Some useful implementation docs are excluded from candidate exports because they name seeded bugs and expected hidden-test behavior. Candidate-facing docs must duplicate only safe setup and workflow context.

## Risk / Blast Radius

The main risk is accidental answer leakage during export. The blast radius is every future candidate repo created from a bad export.

## Revisit When

- Implementation changes the final app structure.
- Candidate export tooling chooses a different include/exclude mechanism.
- Reviewer-only material moves to a different package or repo.
- Edward changes the assessment away from seeded bug discovery and intern PR review.

## Related Edward Rules

- `skills/edward-rules/SKILL.md`
- `skills/edward-decision-capture/SKILL.md`

## Related Project Notes

- `projects/lead-ops-assessment/PROJECT.md`

## Related Assessment Docs

- `assessments/lead-ops-assessment/docs/SPEC.md`
- `assessments/lead-ops-assessment/docs/EXPORT_POLICY.md`
