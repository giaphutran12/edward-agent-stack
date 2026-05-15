import type { CrmJobStatus, CrmSyncJob } from "../../domain/types";

interface FailedJobsPageProps {
  jobs: CrmSyncJob[];
  isLoading?: boolean;
  error?: Error | string | null;
}

const visibleJobStatuses: CrmJobStatus[] = ["retry_scheduled"];

function errorMessage(error: Error | string): string {
  return typeof error === "string" ? error : error.message;
}

export function FailedJobsPage({
  jobs,
  isLoading = false,
  error = null
}: FailedJobsPageProps) {
  const visibleJobs = jobs.filter((job) => visibleJobStatuses.includes(job.status));
  let body;

  if (isLoading) {
    body = (
      <p className="state-copy" role="status">
        Loading CRM jobs...
      </p>
    );
  } else if (error) {
    body = (
      <p className="state-copy state-copy-error" role="alert">
        {errorMessage(error)}
      </p>
    );
  } else if (visibleJobs.length > 0) {
    body = (
      <ul className="job-list">
        {visibleJobs.map((job) => (
          <li key={job.id}>
            <strong>{job.leadId}</strong>
            <span>{job.status}</span>
            <small>{job.lastError ?? "Waiting for retry"}</small>
          </li>
        ))}
      </ul>
    );
  } else {
    body = <p className="state-copy">No failed CRM jobs.</p>;
  }

  return (
    <section className="panel" aria-labelledby="failed-jobs-title">
      <h2 id="failed-jobs-title">Failed CRM Jobs</h2>
      {body}
    </section>
  );
}
