import { mergeLeadChange } from "../../domain/leadMerge";
import { normalizeLeadSourcePayload } from "../../domain/normalization";
import type { InboundEvent, LeadSourcePayload } from "../../domain/types";
import { verifyLeadSourceSignature } from "../../integrations/leadSourceSignature";
import { createCrmSyncJob } from "../../jobs/queue";
import type { LeadOpsRepository } from "../../repository/repository";

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

    const existing = repository.findLeadByProviderId(change.providerLeadId);
    const lead = mergeLeadChange(existing, change, request.receivedAt);

    const event: InboundEvent = {
      id: `inbound_${change.providerEventId}_${String(
        repository.listInboundEvents().filter((item) => item.providerEventId === change.providerEventId)
          .length + 1
      ).padStart(3, "0")}`,
      provider: change.provider,
      providerEventId: change.providerEventId,
      receivedAt: request.receivedAt,
      signatureValid,
      rawPayload: request.body,
      normalizedLeadId: lead.id,
      replayMarker: replay
    };

    const result = repository.writeLeadAndEnqueueCrmSync({
      lead,
      inboundEvent: event,
      crmSyncJob: replay ? null : createCrmSyncJob(lead.id, request.receivedAt),
      auditEntries: [
        {
          id: `audit_${change.providerEventId}_${event.id}`,
          leadId: lead.id,
          actor: "system",
          action: replay ? "webhook.replayed" : "webhook.accepted",
          summary: replay
            ? `Ignored duplicate provider delivery ${change.providerEventId}.`
            : `Accepted provider delivery ${change.providerEventId} and queued CRM sync.`,
          createdAt: request.receivedAt
        }
      ]
    });

    return { status: 202, leadId: result.lead.id, replay };
  } catch (error) {
    return {
      status: 400,
      error: error instanceof Error ? error.message : "Malformed webhook payload"
    };
  }
}
