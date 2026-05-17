# Candidate Repo Rollout Standard

Date: 2026-05-17
Status: accepted
Owner: Edward Tran

## Problem

Candidates need the same take-home assessment without seeing reviewer-only material, hidden tests, answer keys, model solutions, or another candidate's work. Local install instructions can also feel risky because scams often ask people to install tools or run opaque commands.

## Standard

Use one private GitHub repo per candidate, created from the verified candidate export only. The candidate package must require no secrets, no global installs, no curl/bash installers, no binary downloads, and no real customer or vendor access. Offer GitHub Codespaces as the lowest-friction path before local setup.

## Reason

Per-candidate repos keep submissions isolated and fair. A browser-first Codespaces path makes the assessment feel safer and reduces setup failure before the candidate reaches the actual work.

## Procedure

1. Generate the candidate export with `bash scripts/export-candidate-package.sh`.
2. Verify it with `bash scripts/verify-candidate-export.sh`.
3. Create numbered private repos or candidate-slugged private repos from a temp copy of that verified export.
4. Push only the candidate export contents.
5. Invite each candidate only to their own private repo.
6. Send the candidate message from `assessments/lead-ops-assessment/docs/CANDIDATE_REPO_RUNBOOK.md`.
7. Record repo ownership and invite status outside public candidate materials.
