import type { CrmSyncJob } from "../domain/types";
import type { LeadOpsRepository } from "../repository/repository";

export function createCrmSyncJob(leadId: string, now: string): CrmSyncJob {
  return {
    id: `job_${leadId}_${Date.parse(now)}`,
    leadId,
    operation: "upsert_lead",
    status: "pending",
    attemptCount: 0,
    nextRunAt: now,
    lastResponseCode: null,
    lastError: null,
    createdAt: now,
    updatedAt: now
  };
}

export function enqueueCrmSync(repository: LeadOpsRepository, leadId: string, now: string): CrmSyncJob {
  return repository.enqueueCrmSyncJob(createCrmSyncJob(leadId, now));
}
