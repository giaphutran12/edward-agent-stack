---
name: edward-project-notes
description: Use when creating or updating project PROJECT.md files and dated decision notes for Edward's intern workflow.
---

# Edward Project Notes

Project Notes are current project truth.

Decision Notes are dated receipts.

Do not combine them into one messy blob unless the project is tiny.

## Project Notes Answer

- what is true right now?
- what should the agent know before work?
- what is stale or risky?
- what should require Edward?

## Decision Notes Answer

- who decided this?
- when?
- why?
- when should we revisit it?

## File Shape

```text
projects/
  project-name/
    PROJECT.md
    decisions/
      YYYY-MM-DD-short-title.md
```

Use:

- `projects/_template/PROJECT.md`
- `projects/_template/decisions/_template.md`

Mark stale info as stale instead of pretending it is current.
