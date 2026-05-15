import { describe, expect, it } from "vitest";
import type { AuditEntry, CrmSyncJob, InboundEvent, Lead } from "../../src/domain/types";
import { FakeCrmClient } from "../../src/integrations/fakeCrmClient";
import { webhookFixtures } from "../../src/integrations/webhookFixtures";
import { createCrmSyncJob } from "../../src/jobs/queue";
import { createInitialState, FIXED_NOW } from "../../src/repository/fixtures";
import { LeadOpsRepository } from "../../src/repository/repository";
import { resetDemoState } from "../../src/repository/reset";

describe("seed state", () => {
  it("creates deterministic local lead, inbox, CRM, DLQ, and audit fixtures", () => {
    const state = createInitialState();
    const stateAgain = createInitialState();

    expect(stateAgain).toEqual(state);
    expect(stateAgain).not.toBe(state);

    expect(state.leads).toHaveLength(3);
    expect(state.leads[0]?.id).toBe("lead_demo-001");
    expect(state.inboundEvents).toHaveLength(4);
    expect(state.crmSyncJobs.map((job) => job.status)).toEqual([
      "completed",
      "pending",
      "retry_scheduled",
      "dead_lettered"
    ]);
    expect(state.deadLetterJobs).toHaveLength(1);
    expect(state.auditEntries).toHaveLength(3);
  });

  it("resets repository state", () => {
    const repository = new LeadOpsRepository();
    const before = repository.snapshot();

    repository.upsertLead({
      ...before.leads[0] as Lead,
      id: "lead_temp",
      providerLeadId: "temp",
      name: "Temporary Lead"
    });

    repository.reset();

    expect(repository.snapshot()).toEqual(before);
  });

  it("resets the default demo repository", () => {
    const state = resetDemoState();

    expect(state).toEqual(createInitialState());
  });

  it("exposes required webhook and CRM fixture scenarios", () => {
    expect(webhookFixtures.duplicateDelivery.eventId).toBe(webhookFixtures.signedCreate.eventId);
    expect(webhookFixtures.partialNullUpdate.lead.email).toBeNull();

    expect(new FakeCrmClient("validation").upsertLead("lead_demo-001").status).toBe(422);
    expect(new FakeCrmClient("rate-limit").upsertLead("lead_demo-001").status).toBe(429);
    expect(new FakeCrmClient("server-error").upsertLead("lead_demo-001").status).toBe(500);
  });

  it("writes lead changes and CRM enqueue work atomically", () => {
    const repository = new LeadOpsRepository();
    const lead: Lead = {
      id: "lead_atomic-001",
      provider: "acme-leads",
      providerLeadId: "atomic-001",
      email: "atomic@example.invalid",
      phone: "+1555010404",
      name: "Atomic Lead",
      company: "Atomic Co",
      owner: "growth-ops",
      status: "new",
      lastInboundEventId: "evt_atomic_001",
      crmRemoteId: null,
      createdAt: FIXED_NOW,
      updatedAt: FIXED_NOW
    };
    const inboundEvent: InboundEvent = {
      id: "inbound_evt_atomic_001_001",
      provider: "acme-leads",
      providerEventId: "evt_atomic_001",
      receivedAt: FIXED_NOW,
      signatureValid: true,
      rawPayload: { provider: "acme-leads", eventId: "evt_atomic_001" },
      normalizedLeadId: lead.id,
      replayMarker: false
    };
    const auditEntry: AuditEntry = {
      id: "audit_evt_atomic_001",
      leadId: lead.id,
      actor: "system",
      action: "webhook.accepted",
      summary: "Accepted atomic test lead.",
      createdAt: FIXED_NOW
    };
    const crmSyncJob = createCrmSyncJob(lead.id, FIXED_NOW);

    const result = repository.writeLeadAndEnqueueCrmSync({
      lead,
      inboundEvent,
      crmSyncJob,
      auditEntries: [auditEntry]
    });

    expect(result.lead.id).toBe(lead.id);
    expect(repository.findLeadById(lead.id)).toEqual(lead);
    expect(repository.listInboundEvents()).toContainEqual(inboundEvent);
    expect(repository.listCrmSyncJobs()).toContainEqual(crmSyncJob);
    expect(repository.listAuditEntries()).toContainEqual(auditEntry);
  });

  it("rolls back the lead write when CRM enqueue fails", () => {
    const repository = new LeadOpsRepository();
    const before = repository.snapshot();
    const lead = {
      ...before.leads[0] as Lead,
      name: "Should Roll Back",
      updatedAt: FIXED_NOW
    };
    const inboundEvent: InboundEvent = {
      ...before.inboundEvents[0] as InboundEvent,
      id: "inbound_evt_rollback_001",
      normalizedLeadId: lead.id
    };
    const duplicateJob = before.crmSyncJobs[0] as CrmSyncJob;

    expect(() =>
      repository.writeLeadAndEnqueueCrmSync({
        lead,
        inboundEvent,
        crmSyncJob: duplicateJob
      })
    ).toThrow(/already exists/);

    expect(repository.snapshot()).toEqual(before);
  });
});
