# Intern B PR: UI Polish For Failed CRM Jobs

Candidate export: included

## Title

UI polish: simplify failed job list.

## Summary

- Replaces raw queue status tokens with operator-readable copy.
- Sorts retry rows so newest recovery work appears first.
- Keeps existing loading, empty, and error states intact.

## Why

The failed CRM job panel is scanned quickly during handoff. Raw enum values make the panel feel unfinished, and newest retry work should be easiest to find.

## Test Plan

- `npm run test:public`

## Reviewer Request

Please review UI clarity, operator workflow impact, and whether this keeps the recovery queue easy to trust.
