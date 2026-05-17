# Recent Deploy

Status: candidate-facing

## Deploy Record

```text
Deploy ID: staging-2026.05.17.3
Environment: staging
Started: 2026-05-17 08:42
Completed: 2026-05-17 08:49
Triggered by: merge of Intern B PR
Commit: intern-b-ui-polish
CI status: passed
Public tests: passed
Build: passed
Manual smoke: not recorded
```

## Change Summary

The deployed PR changed the failed jobs panel:

- human-readable retry labels
- newest retry jobs first
- recent retry window filter

## Release Note

```text
Failed CRM Jobs now shows a cleaner list of recent retry work for faster broker handoff.
```

## Open Question

CI passed, but CI only proves the public test suite. It does not prove staging operator recovery behavior is complete.
