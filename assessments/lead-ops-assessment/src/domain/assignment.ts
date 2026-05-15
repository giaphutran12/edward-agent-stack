import type { LeadLifecycleStatus } from "./types";

export function assignLeadOwner(company: string | null | undefined): string {
  if (!company) {
    return "general-queue";
  }

  return company.toLowerCase().includes("enterprise") ? "enterprise-ops" : "growth-ops";
}

export function initialLeadStatus(): LeadLifecycleStatus {
  return "new";
}
