import { HealthCard } from '../components/president/HealthCard';
import { RevenueCard } from '../components/president/RevenueCard';
import { ChannelList } from '../components/president/ChannelList';
import { AIStatusList } from '../components/president/AIStatusList';
import { RiskList } from '../components/president/RiskList';
const health = ['API', 'Database', 'AI Core', 'YouTube'].map((name, index) => ({ name, status: index === 2 ? 'YELLOW' : 'GREEN', detail: 'Mock health metric.' }));
const channels = Array.from({ length: 10 }, (_, index) => ({ id: `channel-${index}`, name: `Creator Channel ${index + 1}`, subscribers: 120000 - index * 8500, monetized: index < 8, growthPercent: 4 + index % 6 }));
const ai = ['Content planning', 'Script review', 'Quality scoring', 'Audience analysis', 'Monetization advice'].map((name) => ({ name, status: 'ACTIVE', detail: 'Mock AI Director status.' }));
const risks = ['Security review due', 'Revenue concentration', 'Copyright review', 'Channel compliance', 'AI queue latency'].map((title, index) => ({ id: `risk-${index}`, title, severity: index < 2 ? 'HIGH' : 'MEDIUM', detail: 'Mock executive risk alert.' }));
export function PresidentPanelPage() { return <section aria-labelledby="president-title"><p className="eyebrow">Mock data only</p><h2 id="president-title">President Panel</h2><div className="success-grid"><HealthCard metrics={health} /><RevenueCard monthly={28450} total={184200} trendPercent={12} /><ChannelList channels={channels} /><AIStatusList statuses={ai} /><RiskList risks={risks} /></div></section>; }
