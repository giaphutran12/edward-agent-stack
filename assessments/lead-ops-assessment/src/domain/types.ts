export type LeadProvider = "acme-leads";

export type LeadLifecycleStatus = "new" | "working" | "qualified" | "disqualified";

export type CrmJobStatus =
  | "pending"
  | "in_progress"
  | "retry_scheduled"
  | "completed"
  | "dead_lettered";

export interface Lead {
  id: string;
  provider: LeadProvider;
  providerLeadId: string;
  email: string | null;
  phone: string | null;
  name: string;
  company: string | null;
  owner: string;
  status: LeadLifecycleStatus;
  lastInboundEventId: string;
  crmRemoteId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InboundEvent {
  id: string;
  provider: LeadProvider;
  providerEventId: string;
  receivedAt: string;
  signatureValid: boolean;
  rawPayload: unknown;
  normalizedLeadId: string | null;
  replayMarker: boolean;
}

export interface LeadChange {
  provider: LeadProvider;
  providerLeadId: string;
  providerEventId: string;
  email?: string | null;
  phone?: string | null;
  name?: string;
  company?: string | null;
  receivedAt: string;
}

export interface CrmSyncJob {
  id: string;
  leadId: string;
  operation: "upsert_lead";
  status: CrmJobStatus;
  attemptCount: number;
  nextRunAt: string;
  lastResponseCode: number | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeadLetterJob {
  id: string;
  originalJobId: string;
  leadId: string;
  terminalReason: string;
  responseCode: number | null;
  payloadSnapshot: unknown;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  leadId: string;
  actor: "system" | "operator";
  action: string;
  summary: string;
  createdAt: string;
}

export interface AppState {
  leads: Lead[];
  inboundEvents: InboundEvent[];
  crmSyncJobs: CrmSyncJob[];
  deadLetterJobs: DeadLetterJob[];
  auditEntries: AuditEntry[];
}

export interface LeadSourcePayload {
  provider: LeadProvider;
  eventId: string;
  lead: {
    id: string;
    email?: string | null;
    phone?: string | null;
    name?: string;
    company?: string | null;
  };
}

export interface CrmFixtureResponse {
  status: number;
  body: Record<string, unknown>;
  headers?: Record<string, string>;
}
