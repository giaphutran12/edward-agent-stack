import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CrmSyncJob, Lead } from "../../src/domain/types";
import { App } from "../../src/app/App";
import { FailedJobsPage } from "../../src/app/pages/FailedJobsPage";
import { LeadDetailPage } from "../../src/app/pages/LeadDetailPage";
import { LeadListPage } from "../../src/app/pages/LeadListPage";

const leadFixture: Lead = {
  id: "lead_public_001",
  provider: "acme-leads",
  providerLeadId: "public-001",
  email: "public@example.invalid",
  phone: "+1555010101",
  name: "Public Lead",
  company: "Fixture Co",
  owner: "growth-ops",
  status: "working",
  lastInboundEventId: "evt_public_001",
  crmRemoteId: "crm_public_001",
  createdAt: "2026-05-16T00:00:00.000Z",
  updatedAt: "2026-05-16T00:00:00.000Z"
};

const secondLeadFixture: Lead = {
  ...leadFixture,
  id: "lead_public_002",
  providerLeadId: "public-002",
  email: "second@example.invalid",
  name: "Second Lead",
  company: null,
  status: "new",
  crmRemoteId: null
};

const failedJobFixture: CrmSyncJob = {
  id: "job_public_retry_001",
  leadId: "lead_public_001",
  operation: "upsert_lead",
  status: "retry_scheduled",
  attemptCount: 1,
  nextRunAt: "2026-05-16T00:30:00.000Z",
  lastResponseCode: 429,
  lastError: "Rate limit exceeded",
  createdAt: "2026-05-16T00:00:00.000Z",
  updatedAt: "2026-05-16T00:00:00.000Z"
};

describe("ops UI", () => {
  it("renders core operator panels", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Leads" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lead Detail" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Failed CRM Jobs" })).toBeInTheDocument();
  });

  it("renders lead list rows and selects a lead", () => {
    const onSelectLead = vi.fn();

    render(
      <LeadListPage
        leads={[leadFixture, secondLeadFixture]}
        selectedLeadId={leadFixture.id}
        onSelectLead={onSelectLead}
      />
    );

    expect(screen.getByRole("button", { name: /Public Lead/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("Second Lead")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Second Lead/ }));

    expect(onSelectLead).toHaveBeenCalledWith(secondLeadFixture.id);
  });

  it("renders lead detail fields for a selected lead", () => {
    render(<LeadDetailPage lead={leadFixture} />);

    expect(screen.getByText("public@example.invalid")).toBeInTheDocument();
    expect(screen.getByText("+1555010101")).toBeInTheDocument();
    expect(screen.getByText("crm_public_001")).toBeInTheDocument();
  });

  it("renders lead empty, loading, and error states", () => {
    const { rerender } = render(<LeadListPage leads={[]} />);

    expect(screen.getByText("No leads found.")).toBeInTheDocument();

    rerender(<LeadListPage leads={[]} isLoading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading leads...");

    rerender(<LeadDetailPage error="Lead detail unavailable." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Lead detail unavailable.");
  });

  it("renders failed jobs with simple fixture data", () => {
    render(<FailedJobsPage jobs={[failedJobFixture]} />);

    expect(screen.getByText("lead_public_001")).toBeInTheDocument();
    expect(screen.getByText("retry_scheduled")).toBeInTheDocument();
    expect(screen.getByText("Rate limit exceeded")).toBeInTheDocument();
  });
});
