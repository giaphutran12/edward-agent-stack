import type { Lead } from "../../domain/types";

interface LeadDetailPageProps {
  lead?: Lead;
}

export function LeadDetailPage({ lead }: LeadDetailPageProps) {
  return (
    <section className="panel" aria-labelledby="lead-detail-title">
      <h2 id="lead-detail-title">Lead Detail</h2>
      {lead ? (
        <dl className="detail-list">
          <dt>Name</dt>
          <dd>{lead.name}</dd>
          <dt>Email</dt>
          <dd>{lead.email ?? "Missing"}</dd>
          <dt>Phone</dt>
          <dd>{lead.phone ?? "Missing"}</dd>
          <dt>Status</dt>
          <dd>{lead.status}</dd>
        </dl>
      ) : (
        <p>No lead selected.</p>
      )}
    </section>
  );
}
