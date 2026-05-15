import type { CrmSyncJob } from "../../domain/types";

interface FailedJobsPageProps {
  jobs: CrmSyncJob[];
}

export function FailedJobsPage({ jobs }: FailedJobsPageProps) {
  return (
    <section className="panel" aria-labelledby="failed-jobs-title">
      <h2 id="failed-jobs-title">Failed CRM Jobs</h2>
      {jobs.length > 0 ? (
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.leadId}</strong>
              <span>{job.status}</span>
              <small>{job.lastError ?? "Waiting for retry"}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No failed CRM jobs.</p>
      )}
    </section>
  );
}
