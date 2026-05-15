import { assignLeadOwner, initialLeadStatus } from "./assignment";
import type { Lead, LeadChange } from "./types";

export function createLeadFromChange(change: LeadChange, now: string): Lead {
  return {
    id: `lead_${change.providerLeadId}`,
    provider: change.provider,
    providerLeadId: change.providerLeadId,
    email: change.email ?? null,
    phone: change.phone ?? null,
    name: change.name ?? "Unknown lead",
    company: change.company ?? null,
    owner: assignLeadOwner(change.company),
    status: initialLeadStatus(),
    lastInboundEventId: change.providerEventId,
    crmRemoteId: null,
    createdAt: now,
    updatedAt: now
  };
}

export function mergeLeadChange(existing: Lead | undefined, change: LeadChange, now: string): Lead {
  if (!existing) {
    return createLeadFromChange(change, now);
  }

  return {
    ...existing,
    email: change.email !== undefined ? change.email : existing.email,
    phone: change.phone !== undefined ? change.phone : existing.phone,
    name: change.name ?? existing.name,
    company: change.company !== undefined ? change.company : existing.company,
    owner: assignLeadOwner(change.company !== undefined ? change.company : existing.company),
    lastInboundEventId: change.providerEventId,
    updatedAt: now
  };
}
