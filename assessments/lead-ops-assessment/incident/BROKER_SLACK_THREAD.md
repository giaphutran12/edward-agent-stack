# Broker Slack Thread

Status: candidate-facing

Channel: `#ops-help`
Date: 2026-05-17

```text
09:11 Maya R. (Broker)
AML still doesn't work for the Samson file. This is the same thing as yesterday.

09:12 Maya R. (Broker)
It says nothing is failed now but we definitely still can't move it forward.

09:13 Maya R. (Broker)
I refreshed. Same. I am in staging because Sam asked us to test there first.

09:18 Priya K. (Ops)
Maya, can you send the lead/client ID and timestamp? Also which page?

09:24 Maya R. (Broker)
I only have "Samson" and the page is the failed CRM jobs thing. Screenshot attached.

09:31 Sam L. (Ops)
We had a UI deploy this morning. CI was green. I don't know if this is related.

09:34 Maya R. (Broker)
Need to know if I should keep retrying or tell the broker to wait.
```

## Notes

- The broker says "AML", but the app evidence in this assessment uses fake CRM sync, failed jobs, retry, and dead-letter flows.
- Treat "AML still doesn't work" as a noisy report. It may be an AML/vendor issue, a queue issue, a UI visibility issue, stale browser state, permissions, or something else.
