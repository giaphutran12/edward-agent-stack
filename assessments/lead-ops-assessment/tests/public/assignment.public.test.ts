import { describe, expect, it } from "vitest";
import { mergeLeadChangeWithAudit } from "../../src/domain/leadMerge";
import type { Lead } from "../../src/domain/types";

describe("lead assignment", () => {
  it("records an assignment audit entry when a new lead is created", () => {
    const result = mergeLeadChangeWithAudit(
      undefined,
      {
        provider: "acme-leads",
        providerLeadId: "assignment-001",
        providerEventId: "evt_assignment_001",
        email: "assignment@example.invalid",
        phone: "+1555010404",
        name: "Assignment Lead",
        company: "Assignment Co",
        receivedAt: "2026-05-16T00:00:00.000Z"
      },
      "2026-05-16T00:00:00.000Z"
    );

    expect(result.lead.owner).toBe("growth-ops");
    expect(result.lead.status).toBe("new");
    expect(result.auditEntries).toContainEqual(
      expect.objectContaining({
        leadId: "lead_assignment-001",
        action: "lead.assigned",
        summary: "Assigned lead to growth-ops."
      })
    );
  });

  it("records assignment and status audit entries when an existing lead changes queues", () => {
    const existing: Lead = {
      id: "lead_assignment-002",
      provider: "acme-leads",
      providerLeadId: "assignment-002",
      email: "existing@example.invalid",
      phone: "+1555010505",
      name: "Existing Lead",
      company: "Small Co",
      owner: "growth-ops",
      status: "new",
      lastInboundEventId: "evt_assignment_seed",
      crmRemoteId: null,
      createdAt: "2026-05-15T00:00:00.000Z",
      updatedAt: "2026-05-15T00:00:00.000Z"
    };

    const result = mergeLeadChangeWithAudit(
      existing,
      {
        provider: "acme-leads",
        providerLeadId: "assignment-002",
        providerEventId: "evt_assignment_002",
        company: "Enterprise Group",
        receivedAt: "2026-05-16T00:00:00.000Z"
      },
      "2026-05-16T00:00:00.000Z"
    );

    expect(result.lead.owner).toBe("enterprise-ops");
    expect(result.lead.status).toBe("working");
    expect(result.auditEntries.map((entry) => entry.action)).toEqual([
      "lead.assigned",
      "lead.status_changed"
    ]);
  });
});
