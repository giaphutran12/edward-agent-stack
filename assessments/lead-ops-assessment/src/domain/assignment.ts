import type { AuditEntry, Lead, LeadChange, LeadLifecycleStatus } from "./types";

export interface AssignmentState {
  owner: string;
  status: LeadLifecycleStatus;
}

export function assignLeadOwner(company: string | null | undefined): string {
  if (!company) {
    return "general-queue";
  }

  return company.toLowerCase().includes("enterprise") ? "enterprise-ops" : "growth-ops";
}

export function initialLeadStatus(): LeadLifecycleStatus {
  return "new";
}

export function nextLeadStatus(existing: Lead | undefined): LeadLifecycleStatus {
  if (!existing) {
    return initialLeadStatus();
  }

  if (existing.status === "qualified" || existing.status === "disqualified") {
    return existing.status;
  }

  return "working";
}

export function resolveAssignmentState(
  existing: Lead | undefined,
  company: string | null | undefined
): AssignmentState {
  return {
    owner: assignLeadOwner(company),
    status: nextLeadStatus(existing)
  };
}

export function createAssignmentAuditEntries(
  existing: Lead | undefined,
  nextLead: Lead,
  change: LeadChange,
  now: string,
  auditScope: string = change.providerEventId
): AuditEntry[] {
  const entries: AuditEntry[] = [];

  if (!existing || existing.owner !== nextLead.owner) {
    entries.push({
      id: `audit_assignment_${auditScope}`,
      leadId: nextLead.id,
      actor: "system",
      action: "lead.assigned",
      summary: `Assigned lead to ${nextLead.owner}.`,
      createdAt: now
    });
  }

  if (existing && existing.status !== nextLead.status) {
    entries.push({
      id: `audit_status_${auditScope}`,
      leadId: nextLead.id,
      actor: "system",
      action: "lead.status_changed",
      summary: `Moved lead status from ${existing.status} to ${nextLead.status}.`,
      createdAt: now
    });
  }

  return entries;
}
