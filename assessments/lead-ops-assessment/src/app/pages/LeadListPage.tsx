import type { Lead } from "../../domain/types";

interface LeadListPageProps {
  leads: Lead[];
  selectedLeadId?: string;
  isLoading?: boolean;
  error?: Error | string | null;
  onSelectLead?: (leadId: string) => void;
}

function errorMessage(error: Error | string): string {
  return typeof error === "string" ? error : error.message;
}

export function LeadListPage({
  leads,
  selectedLeadId,
  isLoading = false,
  error = null,
  onSelectLead
}: LeadListPageProps) {
  let body;

  if (isLoading) {
    body = (
      <p className="state-copy" role="status">
        Loading leads...
      </p>
    );
  } else if (error) {
    body = (
      <p className="state-copy state-copy-error" role="alert">
        {errorMessage(error)}
      </p>
    );
  } else if (leads.length === 0) {
    body = <p className="state-copy">No leads found.</p>;
  } else {
    body = (
      <ul className="lead-list">
        {leads.map((lead) => (
          <li key={lead.id}>
            <button
              type="button"
              className="lead-row"
              aria-pressed={lead.id === selectedLeadId}
              onClick={() => onSelectLead?.(lead.id)}
            >
              <span className="row-main">
                <strong>{lead.name}</strong>
                <span>{lead.company ?? "No company"}</span>
              </span>
              <span className="row-meta">
                <small>{lead.owner}</small>
                <small>{lead.status}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="panel" aria-labelledby="lead-list-title">
      <h2 id="lead-list-title">Leads</h2>
      {body}
    </section>
  );
}
