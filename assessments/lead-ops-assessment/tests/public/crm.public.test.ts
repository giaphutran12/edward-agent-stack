import { describe, expect, it } from "vitest";
import { FakeCrmClient, type FakeCrmScenario } from "../../src/integrations/fakeCrmClient";
import { isRetryableCrmFailure, retryDelayMs } from "../../src/jobs/retryPolicy";

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

  it("supports the expected fixture response statuses", () => {
    const scenarios: Array<[FakeCrmScenario, number]> = [
      ["success", 200],
      ["conflict", 409],
      ["validation", 422],
      ["rate-limit", 429],
      ["server-error", 500]
    ];

    for (const [scenario, status] of scenarios) {
      expect(new FakeCrmClient(scenario).upsertLead("lead_demo-001").status).toBe(status);
    }
  });

  it("classifies server and rate-limit failures as retryable", () => {
    expect(isRetryableCrmFailure(429)).toBe(true);
    expect(isRetryableCrmFailure(500)).toBe(true);
  });
});
