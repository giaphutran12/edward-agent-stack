import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CrmSyncJob } from "../../src/domain/types";
import { FailedJobsPage } from "../../src/app/pages/FailedJobsPage";

const deadLetteredJob: CrmSyncJob = {
  id: "job_hidden_dead_001",
  leadId: "lead_demo-003",
  operation: "upsert_lead",
  status: "dead_lettered",
  attemptCount: 3,
  nextRunAt: "2026-05-16T02:20:00.000Z",
  lastResponseCode: 500,
  lastError: "Temporary CRM outage",
  createdAt: "2026-05-16T02:00:00.000Z",
  updatedAt: "2026-05-16T02:20:00.000Z"
};

describe("ops UI hidden tests", () => {
  it("surfaces dead-lettered CRM sync jobs for operator recovery", () => {
    render(<FailedJobsPage jobs={[deadLetteredJob]} />);

    expect(screen.getByText("lead_demo-003")).toBeInTheDocument();
    expect(screen.getByText("dead_lettered")).toBeInTheDocument();
    expect(screen.getByText("Temporary CRM outage")).toBeInTheDocument();
  });
});
