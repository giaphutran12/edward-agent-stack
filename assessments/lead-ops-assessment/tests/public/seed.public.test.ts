import { describe, expect, it } from "vitest";
import { createInitialState } from "../../src/repository/fixtures";
import { LeadOpsRepository } from "../../src/repository/repository";

describe("seed state", () => {
  it("creates deterministic local lead fixtures", () => {
    const state = createInitialState();

    expect(state.leads).toHaveLength(2);
    expect(state.leads[0]?.id).toBe("lead_demo-001");
    expect(state.crmSyncJobs).toEqual([]);
  });

  it("resets repository state", () => {
    const repository = new LeadOpsRepository();
    repository.reset();

    expect(repository.listLeads()).toHaveLength(2);
  });
});
