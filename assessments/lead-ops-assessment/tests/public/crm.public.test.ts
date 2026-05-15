import { describe, expect, it } from "vitest";
import { FakeCrmClient } from "../../src/integrations/fakeCrmClient";
import { retryDelayMs } from "../../src/jobs/retryPolicy";

describe("fake CRM adapter", () => {
  it("returns fixture-backed success responses", () => {
    const response = new FakeCrmClient("success").upsertLead("lead_demo-001");

    expect(response.status).toBe(200);
    expect(response.body.remoteId).toBe("crm_demo_001");
  });

  it("exposes a retry delay for rate-limit responses", () => {
    const response = new FakeCrmClient("rate-limit").upsertLead("lead_demo-001");

    expect(retryDelayMs(response)).toBeGreaterThan(0);
  });
});
