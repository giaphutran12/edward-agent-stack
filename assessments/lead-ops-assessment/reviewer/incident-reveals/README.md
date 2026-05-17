# Incident Reveals

Candidate export: excluded

Use these during a live incident exercise only after the candidate asks for relevant evidence.

Suggested reveal order:

1. If the candidate asks for queue state or affected records, provide `QUEUE_SNAPSHOT.json`.
2. If the candidate asks whether the worker is running or what happened around deploy time, provide `CRM_SYNC_LOG.txt`.
3. If the candidate never asks for queue or worker evidence, grade that as a gap. The initial screenshot alone is not enough to prove root cause.
