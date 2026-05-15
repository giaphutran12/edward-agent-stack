import { describe, expect, it } from "vitest";
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
});
