import conflict409 from "../../fixtures/crm/conflict-409.json";
import rateLimit429 from "../../fixtures/crm/rate-limit-429.json";
import serverError500 from "../../fixtures/crm/server-error-500.json";
import success200 from "../../fixtures/crm/success-200.json";
import validation422 from "../../fixtures/crm/validation-422.json";
import type { CrmFixtureResponse } from "../domain/types";

export type FakeCrmScenario = "success" | "conflict" | "validation" | "rate-limit" | "server-error";

const fixtures: Record<FakeCrmScenario, CrmFixtureResponse> = {
  success: success200,
  conflict: conflict409,
  validation: validation422,
  "rate-limit": rateLimit429,
  "server-error": serverError500
};

export class FakeCrmClient {
  constructor(private readonly scenario: FakeCrmScenario = "success") {}

  upsertLead(_leadId: string): CrmFixtureResponse {
    return structuredClone(fixtures[this.scenario]);
  }
}
