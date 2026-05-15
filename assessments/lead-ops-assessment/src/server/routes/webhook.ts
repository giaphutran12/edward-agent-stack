import { mergeLeadChange } from "../../domain/leadMerge";
import { normalizeLeadSourcePayload } from "../../domain/normalization";
import type { InboundEvent, LeadSourcePayload } from "../../domain/types";
import { verifyLeadSourceSignature } from "../../integrations/leadSourceSignature";
import { enqueueCrmSync } from "../../jobs/queue";
import type { LeadOpsRepository } from "../../repository/repository";
import { runInTransaction } from "../../repository/transaction";

export interface WebhookRequest {
  body: LeadSourcePayload;
  rawBody: string;
  signature: string;
  sharedSecret: string;
  receivedAt: string;
}

export interface WebhookResult {
  status: number;
  leadId?: string;
  replay?: boolean;
  error?: string;
}

export function handleLeadWebhook(repository: LeadOpsRepository, request: WebhookRequest): WebhookResult {
  const signatureValid = verifyLeadSourceSignature(
    request.rawBody,
    request.signature,
    request.sharedSecret
  );

  if (!signatureValid) {
    return { status: 401, error: "Invalid signature" };
  }

  try {
    const change = normalizeLeadSourcePayload(request.body, request.receivedAt);
    const replay = repository.hasInboundEvent(change.providerEventId);

    return runInTransaction(repository, () => {
      const existing = repository.findLeadByProviderId(change.providerLeadId);
      const lead = repository.upsertLead(mergeLeadChange(existing, change, request.receivedAt));

      const event: InboundEvent = {
        id: `inbound_${change.providerEventId}`,
        provider: change.provider,
        providerEventId: change.providerEventId,
        receivedAt: request.receivedAt,
        signatureValid,
        rawPayload: request.body,
        normalizedLeadId: lead.id,
        replayMarker: replay
      };
      repository.addInboundEvent(event);

      if (!replay) {
        enqueueCrmSync(repository, lead.id, request.receivedAt);
      }

      return { status: 202, leadId: lead.id, replay };
    });
  } catch (error) {
    return {
      status: 400,
      error: error instanceof Error ? error.message : "Malformed webhook payload"
    };
  }
}
