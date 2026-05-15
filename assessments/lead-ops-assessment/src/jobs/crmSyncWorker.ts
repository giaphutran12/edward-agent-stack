import type { CrmSyncJob } from "../domain/types";
import type { FakeCrmClient } from "../integrations/fakeCrmClient";
import type { LeadOpsRepository } from "../repository/repository";
import { nextJobState } from "./retryPolicy";

export function processNextCrmSyncJob(
  repository: LeadOpsRepository,
  crmClient: FakeCrmClient,
  now: string
): CrmSyncJob | null {
  const job = repository
    .listCrmSyncJobs()
    .find((candidate) => candidate.status === "pending" && candidate.nextRunAt <= now);

  if (!job) {
    return null;
  }

  const response = crmClient.upsertLead(job.leadId);
  const nextJob = nextJobState(job, response, now);
  repository.updateCrmSyncJob(nextJob);

  if (nextJob.status === "dead_lettered") {
    repository.addDeadLetterJob({
      id: `dlq_${nextJob.id}`,
      originalJobId: nextJob.id,
      leadId: nextJob.leadId,
      terminalReason: nextJob.lastError ?? "CRM sync failed permanently",
      responseCode: nextJob.lastResponseCode,
      payloadSnapshot: { operation: nextJob.operation, leadId: nextJob.leadId },
      createdAt: now
    });
  }

  return nextJob;
}
