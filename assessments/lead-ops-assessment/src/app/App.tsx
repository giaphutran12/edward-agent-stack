import { useMemo, useState } from "react";
import "./styles.css";
import { LeadOpsRepository } from "../repository/repository";
import { FailedJobsPage } from "./pages/FailedJobsPage";
import { LeadDetailPage } from "./pages/LeadDetailPage";
import { LeadListPage } from "./pages/LeadListPage";

const repository = new LeadOpsRepository();
const leads = repository.listLeads();
const crmJobs = repository.listCrmSyncJobs();

export function App() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>(leads[0]?.id);
  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId),
    [selectedLeadId]
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Lead Ops</p>
          <h1>Assessment Console</h1>
        </div>
      </header>

      <section className="layout-grid" aria-label="Lead operations workspace">
        <LeadListPage
          leads={leads}
          selectedLeadId={selectedLeadId}
          onSelectLead={setSelectedLeadId}
        />
        <LeadDetailPage lead={selectedLead} />
        <FailedJobsPage jobs={crmJobs} />
      </section>
    </main>
  );
}
