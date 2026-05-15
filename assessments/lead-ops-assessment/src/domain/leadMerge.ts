import { createAssignmentAuditEntries, resolveAssignmentState } from "./assignment";
import type { AuditEntry, Lead, LeadChange, LeadProvider } from "./types";

export interface LeadMergeResult {
  lead: Lead;
  auditEntries: AuditEntry[];
}

const SOURCE_PRIORITY: Record<LeadProvider, number> = {
  "acme-leads": 10
};

function sourcePriority(provider: LeadProvider): number {
  return SOURCE_PRIORITY[provider];
}

function inboundSourceWins(existing: Lead, change: LeadChange): boolean {
  return sourcePriority(change.provider) >= sourcePriority(existing.provider);
}

export function createLeadFromChange(change: LeadChange, now: string): Lead {
  const assignment = resolveAssignmentState(undefined, change.company ?? null);

  return {
    id: `lead_${change.providerLeadId}`,
    provider: change.provider,
    providerLeadId: change.providerLeadId,
    email: change.email ?? null,
    phone: change.phone ?? null,
    name: change.name ?? "Unknown lead",
    company: change.company ?? null,
    owner: assignment.owner,
    status: assignment.status,
    lastInboundEventId: change.providerEventId,
    crmRemoteId: null,
    createdAt: now,
    updatedAt: now
  };
}

export function mergeLeadChange(existing: Lead | undefined, change: LeadChange, now: string): Lead {
  return mergeLeadChangeWithAudit(existing, change, now).lead;
}

export function mergeLeadChangeWithAudit(
  existing: Lead | undefined,
  change: LeadChange,
  now: string,
  auditScope: string = change.providerEventId
): LeadMergeResult {
  if (!existing) {
    const lead = createLeadFromChange(change, now);
    return {
      lead,
      auditEntries: createAssignmentAuditEntries(existing, lead, change, now, auditScope)
    };
  }

  const shouldApplyInbound = inboundSourceWins(existing, change);
  const company = shouldApplyInbound && change.company !== undefined ? change.company : existing.company;
  const assignment = resolveAssignmentState(existing, company);

  const lead: Lead = {
    ...existing,
    email: shouldApplyInbound && change.email !== undefined ? change.email : existing.email,
    phone: shouldApplyInbound && change.phone !== undefined ? change.phone : existing.phone,
    name: shouldApplyInbound ? change.name ?? existing.name : existing.name,
    company,
    owner: assignment.owner,
    status: assignment.status,
    lastInboundEventId: change.providerEventId,
    updatedAt: now
  };

  return {
    lead,
    auditEntries: createAssignmentAuditEntries(existing, lead, change, now, auditScope)
  };
}
