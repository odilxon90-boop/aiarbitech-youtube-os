import { AIStatusList } from '../components/president/AIStatusList';
import { ChannelList } from '../components/president/ChannelList';
import { HealthCard } from '../components/president/HealthCard';
import { RevenueCard } from '../components/president/RevenueCard';
import { RiskList } from '../components/president/RiskList';
import type { PresidentDashboard } from '../president/types';

const mockDashboard: PresidentDashboard = {
  health: [{ id: 'health-api', name: 'API', status: 'HEALTHY', message: 'All platform services are responding normally.' }, { id: 'health-database', name: 'Database', status: 'HEALTHY', message: 'Connection pool is within target.' }, { id: 'health-ai', name: 'AI Core', status: 'DEGRADED', message: 'Model queue is elevated.' }, { id: 'health-youtube', name: 'YouTube', status: 'CRITICAL', message: 'Publishing connector needs review.' }],
  revenue: { total: 184_200, monthly: 28_450, trend: 12, currency: 'USD' },
  channels: Array.from({ length: 10 }, (_, index) => ({ id: `channel-${index + 1}`, title: `Creator Channel ${index + 1}`, subscribers: (120_000 - index * 8_500).toLocaleString('en-US'), growth: 4 + (index % 6), monetized: index < 8 })),
  aiStatus: ['Content planning', 'Script review', 'Quality scoring', 'Audience analysis', 'Monetization advice'].map((name, index) => ({ id: `ai-${index + 1}`, name, state: index === 3 ? 'IDLE' as const : index === 4 ? 'ERROR' as const : 'ACTIVE' as const, lastActive: `2026-08-13T${String(12 - index).padStart(2, '0')}:00:00:00.000Z`, message: `Mock ${name.toLowerCase()} service.` })),
  risks: [{ id: 'risk-1', severity: 'HIGH', title: 'Security review due', description: 'Complete the scheduled access review.', category: 'Security' }, { id: 'risk-2', severity: 'HIGH', title: 'Revenue concentration', description: 'A limited channel group accounts for most monthly revenue.', category: 'Monetization' }, { id: 'risk-3', severity: 'MEDIUM', title: 'Copyright review', description: 'Review assets waiting for rights confirmation.', category: 'Compliance' }, { id: 'risk-4', severity: 'MEDIUM', title: 'Channel compliance', description: 'One creator channel needs a policy acknowledgement.', category: 'Compliance' }, { id: 'risk-5', severity: 'LOW', title: 'AI queue latency', description: 'Monitor the queue during peak hours.', category: 'Operations' }],
};

export function PresidentPanelPage({ initialData }: { initialData?: PresidentDashboard }) {
  const dashboard = initialData ?? mockDashboard;
  return <section className="president-page" aria-labelledby="president-title">{!initialData && <p className="sr-only">Loading president panel…</p>}<div className="president-panel__header"><div><p className="eyebrow">Executive overview · Mock data only</p><h2 id="president-title">President Panel</h2><p className="muted">Platform health, revenue, channels, AI operations, and executive risks.</p></div><span className="foundation-badge">president:access</span></div><div className="success-grid"><HealthCard metrics={dashboard.health} /><RevenueCard revenue={dashboard.revenue} /><ChannelList channels={dashboard.channels} /><AIStatusList aiStatus={dashboard.aiStatus} /><RiskList risks={dashboard.risks} /></div></section>;
}
