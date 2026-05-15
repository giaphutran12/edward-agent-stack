# Intern A PR: Performance Cleanup During Lead Ingest

Candidate export: included

## Title

Performance cleanup: reduce transaction overhead during lead ingest.

## Summary

- Removes extra state snapshot allocation from the write-and-queue path.
- Keeps lead, inbound event, audit entry, and CRM job writes in one synchronous repository call.
- Leaves webhook response shape and replay behavior unchanged.

## Why

The webhook handler can run hot during lead-source bursts. Accepted deliveries currently clone repository state before writing, so normal successful ingest pays extra memory cost even when the queue write succeeds.

## Test Plan

- `npm run test:public`

## Reviewer Request

Please review correctness, operational behavior, and test coverage before approving.
