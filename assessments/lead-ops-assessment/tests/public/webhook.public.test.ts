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
    expect(repository.listCrmSyncJobs()).toContainEqual(
      expect.objectContaining({
        leadId: "lead_new-001",
        status: "pending"
      })
    );
    expect(repository.listInboundEvents()).toContainEqual(
      expect.objectContaining({
        providerEventId: "evt_create_001",
        rawPayload: body,
        normalizedLeadId: "lead_new-001"
      })
    );
  });

  it("rejects payloads with an invalid signature", () => {
    const repository = new LeadOpsRepository();
    const body = webhookFixtures.signedCreate;
    const rawBody = JSON.stringify(body);

    const result = handleLeadWebhook(repository, {
      body,
      rawBody,
      signature: "local-sha256=bad-signature",
      sharedSecret: "local-placeholder",
      receivedAt: "2026-05-16T00:00:00.000Z"
    });

    expect(result.status).toBe(401);
    expect(repository.findLeadById("lead_new-001")).toBeUndefined();
    expect(repository.listCrmSyncJobs()).toHaveLength(4);
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
