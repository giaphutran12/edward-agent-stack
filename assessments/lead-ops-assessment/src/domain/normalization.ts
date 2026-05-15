import type { LeadChange, LeadSourcePayload } from "./types";

export function normalizeLeadSourcePayload(
  payload: LeadSourcePayload,
  receivedAt: string
): LeadChange {
  if (payload.provider !== "acme-leads") {
    throw new Error(`Unsupported lead provider: ${payload.provider}`);
  }

  if (!payload.eventId || !payload.lead?.id) {
    throw new Error("Malformed lead source payload");
  }

  return {
    provider: payload.provider,
    providerLeadId: payload.lead.id,
    providerEventId: payload.eventId,
    email: payload.lead.email,
    phone: payload.lead.phone,
    name: payload.lead.name,
    company: payload.lead.company,
    receivedAt
  };
}
