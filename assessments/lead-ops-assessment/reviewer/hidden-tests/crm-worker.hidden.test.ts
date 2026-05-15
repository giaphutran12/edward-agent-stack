import { describe, expect, it } from "vitest";
import { FakeCrmClient } from "../../src/integrations/fakeCrmClient";
import { processNextCrmSyncJob } from "../../src/jobs/crmSyncWorker";
import { enqueueCrmSync } from "../../src/jobs/queue";
import { LeadOpsRepository } from "../../src/repository/repository";

function repositoryWithoutCrmJobs(): LeadOpsRepository {
  const repository = new LeadOpsRepository();
  repository.restore({
    ...repository.snapshot(),
    crmSyncJobs: [],
    deadLetterJobs: []
  });

  return repository;
}

describe("CRM worker hidden tests", () => {
  it("moves terminal CRM validation failures to the DLQ without retrying", () => {
    const repository = repositoryWithoutCrmJobs();
    const now = "2026-05-16T02:10:00.000Z";
    const queuedJob = enqueueCrmSync(repository, "lead_demo-001", now);

    const job = processNextCrmSyncJob(repository, new FakeCrmClient("validation"), now);

    expect(job).toMatchObject({
      id: queuedJob.id,
      status: "dead_lettered",
      attemptCount: 1,
      lastResponseCode: 422
    });
    expect(repository.listDeadLetterJobs()).toContainEqual(
      expect.objectContaining({
        originalJobId: queuedJob.id,
        responseCode: 422
      })
    );
  });

  it("treats Retry-After header values as seconds when scheduling rate-limit retries", () => {
    const repository = repositoryWithoutCrmJobs();
    const now = "2026-05-16T02:15:00.000Z";
    enqueueCrmSync(repository, "lead_demo-001", now);

    const job = processNextCrmSyncJob(repository, new FakeCrmClient("rate-limit"), now);

    expect(job?.status).toBe("retry_scheduled");
    expect(Date.parse(job?.nextRunAt ?? "") - Date.parse(now)).toBe(30_000);
  });
});
