import { describe, expect, it } from "vitest";
import { signLeadSourcePayload } from "../../src/integrations/leadSourceSignature";
import { webhookFixtures } from "../../src/integrations/webhookFixtures";
import { LeadOpsRepository } from "../../src/repository/repository";
import { handleLeadWebhook } from "../../src/server/routes/webhook";

describe("lead webhook route", () => {
  it("accepts a signed lead create payload and queues CRM sync", () => {
    const repository = new LeadOpsRepository();
    const body = webhookFixtures.signedCreate;
    const rawBody = JSON.stringify(body);
    const sharedSecret = "local-placeholder";

    const result = handleLeadWebhook(repository, {
      body,
      rawBody,
      signature: signLeadSourcePayload(rawBody, sharedSecret),
      sharedSecret,
      receivedAt: "2026-05-16T00:00:00.000Z"
    });

    expect(result.status).toBe(202);
    expect(result.leadId).toBe("lead_new-001");
    expect(repository.listCrmSyncJobs()).toHaveLength(1);
  });

  it("rejects malformed lead payloads", () => {
    const repository = new LeadOpsRepository();
    const body = webhookFixtures.malformed;
    const rawBody = JSON.stringify(body);
    const sharedSecret = "local-placeholder";

    const result = handleLeadWebhook(repository, {
      body: body as never,
      rawBody,
      signature: signLeadSourcePayload(rawBody, sharedSecret),
      sharedSecret,
      receivedAt: "2026-05-16T00:00:00.000Z"
    });

    expect(result.status).toBe(400);
  });
});
