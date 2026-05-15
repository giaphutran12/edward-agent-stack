import type { AppState } from "../domain/types";

export const FIXED_NOW = "2026-05-16T00:00:00.000Z";

export function createInitialState(): AppState {
  return {
    leads: [
      {
        id: "lead_demo-001",
        provider: "acme-leads",
        providerLeadId: "demo-001",
        email: "ada@example.invalid",
        phone: "+1555010101",
        name: "Ada Lovelace",
        company: "Example Enterprise",
        owner: "enterprise-ops",
        status: "working",
        lastInboundEventId: "evt_seed_001",
        crmRemoteId: "crm_demo_001",
        createdAt: FIXED_NOW,
        updatedAt: FIXED_NOW
      },
      {
        id: "lead_demo-002",
        provider: "acme-leads",
        providerLeadId: "demo-002",
        email: "grace@example.invalid",
        phone: null,
        name: "Grace Hopper",
        company: "Compiler Labs",
        owner: "growth-ops",
        status: "new",
        lastInboundEventId: "evt_seed_002",
        crmRemoteId: null,
        createdAt: FIXED_NOW,
        updatedAt: FIXED_NOW
      }
    ],
    inboundEvents: [],
    crmSyncJobs: [],
    deadLetterJobs: [],
    auditEntries: []
  };
}
