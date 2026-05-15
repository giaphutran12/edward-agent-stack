import { describe, expect, it } from "vitest";
import { FakeCrmClient } from "../../src/integrations/fakeCrmClient";
import {
  parseCrmSyncWorkerArgs,
  processDueCrmSyncJobs,
  processNextCrmSyncJob
} from "../../src/jobs/crmSyncWorker";
import { enqueueCrmSync } from "../../src/jobs/queue";
import { LeadOpsRepository } from "../../src/repository/repository";

describe("CRM sync worker", () => {
  it("completes a pending CRM sync job on success", () => {
    const repository = new LeadOpsRepository();
    const now = "2026-05-16T00:00:00.000Z";
    const queuedJob = enqueueCrmSync(repository, "lead_demo-001", now);

    const job = processNextCrmSyncJob(repository, new FakeCrmClient("success"), now);

    expect(job?.id).toBe(queuedJob.id);
    expect(job?.status).toBe("completed");
    expect(repository.listCrmSyncJobs().find((item) => item.id === queuedJob.id)?.status).toBe(
      "completed"
    );
  });

  it("schedules a retry after a rate-limit response", () => {
    const repository = new LeadOpsRepository();
    const now = "2026-05-16T00:00:00.000Z";
    const queuedJob = enqueueCrmSync(repository, "lead_demo-001", now);

    const job = processNextCrmSyncJob(repository, new FakeCrmClient("rate-limit"), now);

    expect(job?.id).toBe(queuedJob.id);
    expect(job?.status).toBe("retry_scheduled");
    expect(job?.attemptCount).toBe(1);
    expect(job?.lastResponseCode).toBe(429);
    expect(Date.parse(job?.nextRunAt ?? "")).toBeGreaterThan(Date.parse(now));
  });

  it("schedules a retry after a server error response", () => {
    const repository = new LeadOpsRepository();
    const now = "2026-05-16T00:00:00.000Z";
    const queuedJob = enqueueCrmSync(repository, "lead_demo-001", now);

    const job = processNextCrmSyncJob(repository, new FakeCrmClient("server-error"), now);

    expect(job?.id).toBe(queuedJob.id);
    expect(job?.status).toBe("retry_scheduled");
    expect(job?.attemptCount).toBe(1);
    expect(job?.lastResponseCode).toBe(500);
    expect(repository.listDeadLetterJobs()).toHaveLength(1);
  });

  it("moves exhausted server errors into the DLQ", () => {
    const repository = new LeadOpsRepository();
    const now = "2026-05-16T00:00:00.000Z";
    const queuedJob = enqueueCrmSync(repository, "lead_demo-001", now);
    repository.updateCrmSyncJob({ ...queuedJob, attemptCount: 2 });

    const job = processNextCrmSyncJob(repository, new FakeCrmClient("server-error"), now);

    expect(job?.status).toBe("dead_lettered");
    expect(job?.attemptCount).toBe(3);
    expect(job?.lastResponseCode).toBe(500);
    expect(repository.listDeadLetterJobs()).toContainEqual(
      expect.objectContaining({
        originalJobId: queuedJob.id,
        responseCode: 500
      })
    );
  });

  it("processes due retry-scheduled jobs from the crm_sync worker loop", () => {
    const repository = new LeadOpsRepository();
    const now = "2026-05-16T00:00:00.000Z";
    const queuedJob = enqueueCrmSync(repository, "lead_demo-001", now);
    repository.updateCrmSyncJob({ ...queuedJob, status: "retry_scheduled", attemptCount: 1 });

    const jobs = processDueCrmSyncJobs(repository, new FakeCrmClient("success"), {
      now,
      maxJobs: 1
    });

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      id: queuedJob.id,
      status: "completed",
      attemptCount: 2,
      lastResponseCode: 200
    });
  });

  it("parses the local crm_sync worker entrypoint arguments", () => {
    expect(
      parseCrmSyncWorkerArgs([
        "--scenario=server-error",
        "--now=2026-05-16T00:00:00.000Z",
        "--max-jobs=2"
      ])
    ).toEqual({
      scenario: "server-error",
      now: "2026-05-16T00:00:00.000Z",
      maxJobs: 2
    });
  });
});
