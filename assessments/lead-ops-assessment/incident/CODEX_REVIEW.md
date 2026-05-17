# Codex Review Excerpt

Status: candidate-facing

Codex left this automated review comment on the deployed UI PR:

```text
P1: Stop dropping retry jobs outside a 45-minute window

Filtering with isInRecentFailureWindow hides valid retry_scheduled jobs whenever they are more than 45 minutes older than the newest retry, even though they are still unresolved failures. In real queues where retries are created at different times, this can remove actionable jobs from the Failed CRM Jobs panel and even show the empty state while retry jobs still exist.

This view should sort retries but not discard older pending failures.
```

## Candidate Task

Do not just paste this comment. Decide whether you agree, what evidence supports or weakens it, what action you would take, and how you would communicate the impact.
