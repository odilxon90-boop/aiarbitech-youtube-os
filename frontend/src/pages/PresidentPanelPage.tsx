import { HealthCard } from '../components/president/HealthCard';
import { RevenueCard } from '../components/president/RevenueCard';
import { ChannelList } from '../components/president/ChannelList';
import { AIStatusList } from '../components/president/AIStatusList';
import { RiskList } from '../components/president/RiskList';
import type { PresidentDashboard } from '../president/types';
const health = ['API', 'Database', 'AI Core', 'YouTube'].map((name, index) => ({ name, status: index === 2 ? 'YELLOW' : 'GREEN', detail: 'Mock health metric.' }));
const channels = Array.from({ length: 10 }, (_, index) => ({ id: `channel-${index}`, name: `Creator Channel ${index + 1}`, subscribers: 120000 - index * 8500, monetized: index < 8, growthPercent: 4 + index % 6 }));
const ai = ['Content planning', 'Script review', 'Quality scoring', 'Audience analysis', 'Monetization advice'].map((name) => ({ name, status: 'ACTIVE', detail: 'Mock AI Director status.' }));
const risks = ['Security review due', 'Revenue concentration', 'Copyright review', 'Channel compliance', 'AI queue latency'].map((title, index) => ({ id: `risk-${index}`, title, severity: index < 2 ? 'HIGH' : 'MEDIUM', detail: 'Mock executive risk alert.' }));
export function PresidentPanelPage({ initialData }: { initialData?: PresidentDashboard }) {
  const data = initialData;
  return (
    <section aria-labelledby="president-title">
      <p className="eyebrow">{data ? 'Executive overview' : 'Loading president panel…'}</p>
      <h2 id="president-title">President Panel</h2>
      <div className="success-grid">
        <HealthCard metrics={data?.health ?? health} />
        {data
          ? <RevenueCard revenue={data.revenue} />
          : <RevenueCard monthly={28450} total={184200} trendPercent={12} />}
        <ChannelList channels={data?.channels ?? channels} />
        {data ? <AIStatusList aiStatus={data.aiStatus} /> : <AIStatusList statuses={ai} />}
        <RiskList risks={data?.risks ?? risks} />
      </div>
    </section>
  );
}
