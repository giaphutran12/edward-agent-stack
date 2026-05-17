# Screenshot Notes

Status: candidate-facing

Broker screenshot file:

- `incident/assets/failed-crm-jobs-empty-state.png`
- HTML source used to render the screenshot: `incident/assets/failed-crm-jobs-empty-state.html`

Observed from screenshot:

- Environment: `Staging`
- Page: `Failed CRM Jobs`
- Capture time shown in UI: `2026-05-17 09:24`
- Search/filter text: `samson`
- Main panel says: `No failed CRM jobs`
- The page still shows deploy badge `staging-2026.05.17.3`

Limitations:

- The screenshot does not prove the queue is empty.
- The screenshot does not prove the worker is down.
- The screenshot does not identify the exact lead ID.
- The screenshot does not include queue or worker logs.
- The broker's wording says "AML", but the screenshot is a failed CRM jobs UI.
