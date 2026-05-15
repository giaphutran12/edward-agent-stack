import duplicateDelivery from "../../fixtures/webhooks/duplicate-delivery.json";
import malformed from "../../fixtures/webhooks/malformed.json";
import partialNullUpdate from "../../fixtures/webhooks/partial-null-update.json";
import signedCreate from "../../fixtures/webhooks/signed-create.json";
import type { LeadSourcePayload } from "../domain/types";

export const webhookFixtures = {
  duplicateDelivery: duplicateDelivery as LeadSourcePayload,
  malformed,
  partialNullUpdate: partialNullUpdate as LeadSourcePayload,
  signedCreate: signedCreate as LeadSourcePayload
};
