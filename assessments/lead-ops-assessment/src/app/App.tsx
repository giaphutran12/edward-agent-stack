import "./styles.css";
import { LeadOpsRepository } from "../repository/repository";
import { FailedJobsPage } from "./pages/FailedJobsPage";
import { LeadDetailPage } from "./pages/LeadDetailPage";
import { LeadListPage } from "./pages/LeadListPage";

const repository = new LeadOpsRepository();
const leads = repository.listLeads();
const failedJobs = repository.listFailedJobs();

export function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Lead Ops</p>
          <h1>Assessment Console</h1>
        </div>
      </header>

      <section className="layout-grid" aria-label="Lead operations workspace">
        <LeadListPage leads={leads} />
        <LeadDetailPage lead={leads[0]} />
        <FailedJobsPage jobs={failedJobs} />
      </section>
    </main>
  );
}
