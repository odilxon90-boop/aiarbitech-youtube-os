export class PresidentService {
  dashboard() { return { platformHealth: 'HEALTHY', activeChannels: 42, monthlyRevenue: 28450, riskCount: 5 }; }
  health() { return ['API', 'Database', 'AI Core', 'YouTube'].map((name, index) => ({ name, status: index === 2 ? 'YELLOW' : 'GREEN', detail: index === 2 ? 'Model queue is elevated.' : 'Operating normally.' })); }
  revenue() { return { total: 184200, monthly: 28450, trendPercent: 12, trend: [19000, 21400, 23100, 25400, 28450] }; }
  channels() { return Array.from({ length: 10 }, (_, index) => ({ id: `channel-${index + 1}`, name: `Creator Channel ${index + 1}`, subscribers: 120000 - index * 8500, monetized: index < 8, growthPercent: 4 + (index % 6) })); }
  aiStatus() { return ['Content planning', 'Script review', 'Quality scoring', 'Audience analysis', 'Monetization advice'].map((name, index) => ({ name, status: index === 3 ? 'IDLE' : 'ACTIVE', detail: `Mock ${name.toLowerCase()} service.` })); }
  risks() { return ['Security review due', 'Revenue concentration', 'Copyright review', 'Channel compliance', 'AI queue latency'].map((title, index) => ({ id: `risk-${index + 1}`, title, severity: index < 2 ? 'HIGH' : index < 4 ? 'MEDIUM' : 'LOW', detail: 'Mock executive risk alert.' })); }
}
