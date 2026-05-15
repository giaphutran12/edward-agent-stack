import type {
  AppState,
  AuditEntry,
  CrmSyncJob,
  DeadLetterJob,
  InboundEvent,
  Lead
} from "../domain/types";
import { createInitialState } from "./fixtures";

export interface LeadWriteAndQueueInput {
  lead: Lead;
  inboundEvent: InboundEvent;
  crmSyncJob: CrmSyncJob | null;
  auditEntries?: AuditEntry[];
}

export interface LeadWriteAndQueueResult {
  lead: Lead;
  crmSyncJob: CrmSyncJob | null;
}

export class LeadOpsRepository {
  private state: AppState;

  constructor(initialState: AppState = createInitialState()) {
    this.state = structuredClone(initialState);
  }

  snapshot(): AppState {
    return structuredClone(this.state);
  }

  restore(nextState: AppState): void {
    this.state = structuredClone(nextState);
  }

  reset(): void {
    this.state = createInitialState();
  }

  listLeads(): Lead[] {
    return structuredClone(this.state.leads);
  }

  findLeadById(id: string): Lead | undefined {
    return structuredClone(this.state.leads.find((lead) => lead.id === id));
  }

  findLeadByProviderId(providerLeadId: string): Lead | undefined {
    return structuredClone(this.state.leads.find((lead) => lead.providerLeadId === providerLeadId));
  }

  upsertLead(lead: Lead): Lead {
    const index = this.state.leads.findIndex((item) => item.id === lead.id);
    if (index >= 0) {
      this.state.leads[index] = structuredClone(lead);
      return structuredClone(lead);
    }

    this.state.leads.push(structuredClone(lead));
    return structuredClone(lead);
  }

  addInboundEvent(event: InboundEvent): void {
    this.state.inboundEvents.push(structuredClone(event));
  }

  listInboundEvents(): InboundEvent[] {
    return structuredClone(this.state.inboundEvents);
  }

  hasInboundEvent(providerEventId: string): boolean {
    return this.state.inboundEvents.some((event) => event.providerEventId === providerEventId);
  }

  addAuditEntry(entry: AuditEntry): void {
    this.state.auditEntries.push(structuredClone(entry));
  }

  enqueueCrmSyncJob(job: CrmSyncJob): CrmSyncJob {
    if (this.state.crmSyncJobs.some((item) => item.id === job.id)) {
      throw new Error(`CRM sync job already exists: ${job.id}`);
    }

    this.state.crmSyncJobs.push(structuredClone(job));
    return structuredClone(job);
  }

  listCrmSyncJobs(): CrmSyncJob[] {
    return structuredClone(this.state.crmSyncJobs);
  }

  updateCrmSyncJob(job: CrmSyncJob): CrmSyncJob {
    const index = this.state.crmSyncJobs.findIndex((item) => item.id === job.id);
    if (index < 0) {
      throw new Error(`CRM sync job not found: ${job.id}`);
    }

    this.state.crmSyncJobs[index] = structuredClone(job);
    return structuredClone(job);
  }

  addDeadLetterJob(job: DeadLetterJob): void {
    this.state.deadLetterJobs.push(structuredClone(job));
  }

  listDeadLetterJobs(): DeadLetterJob[] {
    return structuredClone(this.state.deadLetterJobs);
  }

  listAuditEntries(): AuditEntry[] {
    return structuredClone(this.state.auditEntries);
  }

  listFailedJobs(): CrmSyncJob[] {
    return structuredClone(
      this.state.crmSyncJobs.filter((job) =>
        job.status === "retry_scheduled" || job.status === "dead_lettered"
      )
    );
  }

  writeLeadAndEnqueueCrmSync(input: LeadWriteAndQueueInput): LeadWriteAndQueueResult {
    const before = this.snapshot();

    try {
      const lead = this.upsertLead(input.lead);
      this.addInboundEvent(input.inboundEvent);
      const crmSyncJob = input.crmSyncJob
        ? this.enqueueCrmSyncJob(input.crmSyncJob)
        : null;

      for (const entry of input.auditEntries ?? []) {
        this.addAuditEntry(entry);
      }

      return { lead, crmSyncJob };
    } catch (error) {
      this.restore(before);
      throw error;
    }
  }
}

export const defaultRepository = new LeadOpsRepository();
