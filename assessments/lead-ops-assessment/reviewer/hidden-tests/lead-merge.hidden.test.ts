import { describe, expect, it } from "vitest";
import { signLeadSourcePayload } from "../../src/integrations/leadSourceSignature";
import { webhookFixtures } from "../../src/integrations/webhookFixtures";
import { LeadOpsRepository } from "../../src/repository/repository";
import { handleLeadWebhook } from "../../src/server/routes/webhook";

describe("lead merge hidden tests", () => {
  it("preserves trusted contact fields when a partial provider update sends nulls", () => {
    const repository = new LeadOpsRepository();
    const body = webhookFixtures.partialNullUpdate;
    const rawBody = JSON.stringify(body);
    const sharedSecret = "local-placeholder";

    const result = handleLeadWebhook(repository, {
      body,
      rawBody,
      signature: signLeadSourcePayload(rawBody, sharedSecret),
      sharedSecret,
      receivedAt: "2026-05-16T02:05:00.000Z"
    });

    const lead = repository.findLeadById("lead_demo-001");

    expect(result.status).toBe(202);
    expect(lead?.email).toBe("ada@example.invalid");
    expect(lead?.phone).toBe("+1555010101");
  });
});
