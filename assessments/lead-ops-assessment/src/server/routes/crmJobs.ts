import type { CrmSyncJob } from "../../domain/types";
import type { LeadOpsRepository } from "../../repository/repository";

export function listFailedCrmJobs(repository: LeadOpsRepository): CrmSyncJob[] {
  return repository.listFailedJobs();
}
