import { describe, expect, it } from "vitest";
import { FakeCrmClient } from "../../src/integrations/fakeCrmClient";
import { processNextCrmSyncJob } from "../../src/jobs/crmSyncWorker";
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
});
