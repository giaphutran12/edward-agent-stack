import type { Lead } from "../../domain/types";

interface LeadDetailPageProps {
  lead?: Lead;
  isLoading?: boolean;
  error?: Error | string | null;
}

function errorMessage(error: Error | string): string {
  return typeof error === "string" ? error : error.message;
}

export function LeadDetailPage({
  lead,
  isLoading = false,
  error = null
}: LeadDetailPageProps) {
  let body;

  if (isLoading) {
    body = (
      <p className="state-copy" role="status">
        Loading lead detail...
      </p>
    );
  } else if (error) {
    body = (
      <p className="state-copy state-copy-error" role="alert">
        {errorMessage(error)}
      </p>
    );
  } else if (lead) {
    body = (
      <dl className="detail-list">
        <dt>Name</dt>
        <dd>{lead.name}</dd>
        <dt>Email</dt>
        <dd>{lead.email ?? "Missing"}</dd>
        <dt>Phone</dt>
        <dd>{lead.phone ?? "Missing"}</dd>
        <dt>Company</dt>
        <dd>{lead.company ?? "Missing"}</dd>
        <dt>Owner</dt>
        <dd>{lead.owner}</dd>
        <dt>Status</dt>
        <dd>{lead.status}</dd>
        <dt>CRM</dt>
        <dd>{lead.crmRemoteId ?? "Not synced"}</dd>
      </dl>
    );
  } else {
    body = <p className="state-copy">No lead selected.</p>;
  }

  return (
    <section className="panel" aria-labelledby="lead-detail-title">
      <h2 id="lead-detail-title">Lead Detail</h2>
      {body}
    </section>
  );
}
