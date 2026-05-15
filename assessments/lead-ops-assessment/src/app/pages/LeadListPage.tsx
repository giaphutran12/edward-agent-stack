import type { Lead } from "../../domain/types";

interface LeadListPageProps {
  leads: Lead[];
}

export function LeadListPage({ leads }: LeadListPageProps) {
  return (
    <section className="panel" aria-labelledby="lead-list-title">
      <h2 id="lead-list-title">Leads</h2>
      <ul className="lead-list">
        {leads.map((lead) => (
          <li key={lead.id}>
            <strong>{lead.name}</strong>
            <span>{lead.company ?? "No company"}</span>
            <small>{lead.owner}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
