import { describe, expect, it } from "vitest";
import type { Lead } from "../../src/domain/types";
import { mergeLeadChange } from "../../src/domain/leadMerge";

describe("lead merge", () => {
  it("creates a new lead from a normalized lead change", () => {
    const lead = mergeLeadChange(
      undefined,
      {
        provider: "acme-leads",
        providerLeadId: "lead-123",
        providerEventId: "evt_123",
        email: "lead@example.invalid",
        phone: null,
        name: "Lead Example",
        company: "Example Enterprise",
        receivedAt: "2026-05-16T00:00:00.000Z"
      },
      "2026-05-16T00:00:00.000Z"
    );

    expect(lead.id).toBe("lead_lead-123");
    expect(lead.owner).toBe("enterprise-ops");
    expect(lead.status).toBe("new");
  });

  it("updates an existing lead from a same-source happy path change", () => {
    const existing: Lead = {
      id: "lead_demo-002",
      provider: "acme-leads",
      providerLeadId: "demo-002",
      email: "old@example.invalid",
      phone: "+1555010101",
      name: "Old Name",
      company: "Growth Co",
      owner: "growth-ops",
      status: "new",
      lastInboundEventId: "evt_seed_002",
      crmRemoteId: "crm_demo_002",
      createdAt: "2026-05-15T00:00:00.000Z",
      updatedAt: "2026-05-15T00:00:00.000Z"
    };

    const lead = mergeLeadChange(
      existing,
      {
        provider: "acme-leads",
        providerLeadId: "demo-002",
        providerEventId: "evt_update_002",
        email: "updated@example.invalid",
        name: "Updated Name",
        company: "Example Enterprise",
        receivedAt: "2026-05-16T00:00:00.000Z"
      },
      "2026-05-16T00:00:00.000Z"
    );

    expect(lead.id).toBe(existing.id);
    expect(lead.email).toBe("updated@example.invalid");
    expect(lead.phone).toBe(existing.phone);
    expect(lead.name).toBe("Updated Name");
    expect(lead.company).toBe("Example Enterprise");
    expect(lead.owner).toBe("enterprise-ops");
    expect(lead.status).toBe("working");
    expect(lead.crmRemoteId).toBe(existing.crmRemoteId);
    expect(lead.createdAt).toBe(existing.createdAt);
    expect(lead.updatedAt).toBe("2026-05-16T00:00:00.000Z");
  });
});
