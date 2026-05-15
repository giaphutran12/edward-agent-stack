import { describe, expect, it } from "vitest";
import { signLeadSourcePayload } from "../../src/integrations/leadSourceSignature";
import { webhookFixtures } from "../../src/integrations/webhookFixtures";
import { LeadOpsRepository } from "../../src/repository/repository";
import { handleLeadWebhook } from "../../src/server/routes/webhook";

describe("webhook idempotency hidden tests", () => {
  it("deduplicates repeated provider deliveries by provider event id", () => {
    const repository = new LeadOpsRepository();
    const body = webhookFixtures.duplicateDelivery;
    const rawBody = JSON.stringify(body);
    const sharedSecret = "local-placeholder";
    const signature = signLeadSourcePayload(rawBody, sharedSecret);

    const firstResult = handleLeadWebhook(repository, {
      body,
      rawBody,
      signature,
      sharedSecret,
      receivedAt: "2026-05-16T02:00:00.000Z"
    });
    const secondResult = handleLeadWebhook(repository, {
      body,
      rawBody,
      signature,
      sharedSecret,
      receivedAt: "2026-05-16T02:00:01.000Z"
    });

    const jobsForLead = repository
      .listCrmSyncJobs()
      .filter((job) => job.leadId === "lead_new-001");

    expect(firstResult).toMatchObject({ status: 202, replay: false });
    expect(secondResult).toMatchObject({ status: 202, replay: true });
    expect(jobsForLead).toHaveLength(1);
  });
});
