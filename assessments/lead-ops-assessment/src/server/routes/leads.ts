import type { Lead } from "../../domain/types";
import type { LeadOpsRepository } from "../../repository/repository";

export function listLeads(repository: LeadOpsRepository): Lead[] {
  return repository.listLeads();
}

export function getLead(repository: LeadOpsRepository, id: string): Lead | undefined {
  return repository.findLeadById(id);
}
