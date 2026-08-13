import type { RiskAlert } from '../../president/types';

interface LegacyRisk { id: string; title: string; severity: string; detail: string }

export function RiskList({ risks }: { risks: readonly (RiskAlert | LegacyRisk)[] }) {
  return <article className="president-card"><h3>Risk Alerts</h3>{risks.length === 0 ? <p>No risk alerts.</p> : risks.map((risk) => <p key={risk.id}><strong>{risk.severity}</strong> {risk.title}{'category' in risk ? ` · ${risk.category}` : ''}: {'description' in risk ? risk.description : risk.detail}</p>)}</article>;
}
