<<<<<<< HEAD
export interface HealthMetric {
  id: string;
  name: string;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  message: string;
}

export interface RevenueOverview {
  total: number;
  monthly: number;
  trend: number;
  currency: string;
}

export interface ChannelStat {
  id: string;
  title: string;
  subscribers: string;
  growth: number;
  monetized: boolean;
}

export interface AIStatus {
  id: string;
  name: string;
  state: 'ACTIVE' | 'IDLE' | 'ERROR';
  lastActive: string;
  message: string;
}

export interface RiskAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  category: string;
}

export interface PresidentDashboard {
  health: HealthMetric[];
  revenue: RevenueOverview;
  channels: ChannelStat[];
  aiStatus: AIStatus[];
  risks: RiskAlert[];
}

const MOCK_HEALTH: HealthMetric[] = [
  { id: 'h-1', name: 'API Gateway', status: 'HEALTHY', message: 'All endpoints responding within SLA.' },
  { id: 'h-2', name: 'Database', status: 'HEALTHY', message: 'Connection pool utilization normal.' },
  { id: 'h-3', name: 'AI Core', status: 'DEGRADED', message: 'Latency above baseline; investigating.' },
  { id: 'h-4', name: 'YouTube Integration', status: 'HEALTHY', message: 'Quota and auth valid.' },
];

const MOCK_REVENUE: RevenueOverview = {
  total: 128450,
  monthly: 12420,
  trend: 8.3,
  currency: 'USD',
};

const MOCK_CHANNELS: ChannelStat[] = Array.from({ length: 12 }, (_, idx) => ({
  id: `chn-${idx + 1}`,
  title: `Channel ${idx + 1} - ${['AI Tools', 'Automation', 'Tutorials', 'Reviews', 'Shorts'][idx % 5]}`,
  subscribers: `${(18000 + idx * 1200).toLocaleString()}`,
  growth: Number((Math.random() * 15 - 2).toFixed(1)),
  monetized: idx % 3 !== 0,
}));

const MOCK_AI_STATUS: AIStatus[] = [
  { id: 'ai-1', name: 'Director', state: 'ACTIVE', lastActive: '2026-08-09T12:00:00.000Z', message: 'Recommendation pipeline healthy.' },
  { id: 'ai-2', name: 'Script Writer', state: 'ACTIVE', lastActive: '2026-08-09T11:55:00.000Z', message: 'Processing 3 requests.' },
  { id: 'ai-3', name: 'Thumbnail Optimizer', state: 'IDLE', lastActive: '2026-08-09T10:00:00.000Z', message: 'Waiting for new uploads.' },
  { id: 'ai-4', name: 'Comment Moderator', state: 'ACTIVE', lastActive: '2026-08-09T12:01:00.000Z', message: 'Moderation queue normal.' },
  { id: 'ai-5', name: 'Analytics Engine', state: 'ERROR', lastActive: '2026-08-09T09:30:00.000Z', message: 'Data sync delayed; retrying.' },
];

const MOCK_RISKS: RiskAlert[] = [
  { id: 'r-1', severity: 'HIGH', title: 'Revenue dependency', description: '85% of revenue comes from one channel.', category: 'Monetization' },
  { id: 'r-2', severity: 'MEDIUM', title: 'API quota spike', description: 'YouTube API usage spiked 40% this week.', category: 'Security' },
  { id: 'r-3', severity: 'LOW', title: 'Outdated thumbnails', description: 'Older videos have low-CTR thumbnails.', category: 'Compliance' },
  { id: 'r-4', severity: 'CRITICAL', title: 'Copyright claim', description: 'One video received a copyright strike.', category: 'Compliance' },
  { id: 'r-5', severity: 'MEDIUM', title: 'Upload schedule gap', description: 'No uploads scheduled for next week.', category: 'Operations' },
];

export async function getPresidentDashboard(): Promise<PresidentDashboard> {
  return {
    health: MOCK_HEALTH,
    revenue: MOCK_REVENUE,
    channels: MOCK_CHANNELS,
    aiStatus: MOCK_AI_STATUS,
    risks: MOCK_RISKS,
  };
}

export async function getHealth(): Promise<{ health: HealthMetric[] }> {
  return { health: MOCK_HEALTH };
}

export async function getRevenue(): Promise<RevenueOverview> {
  return MOCK_REVENUE;
}

export async function getChannels(): Promise<{ channels: ChannelStat[] }> {
  return { channels: MOCK_CHANNELS };
}

export async function getAiStatus(): Promise<{ aiStatus: AIStatus[] }> {
  return { aiStatus: MOCK_AI_STATUS };
}

export async function getRisks(): Promise<{ risks: RiskAlert[] }> {
  return { risks: MOCK_RISKS };
=======
export class PresidentService {
  dashboard() { return { platformHealth: 'HEALTHY', activeChannels: 42, monthlyRevenue: 28450, riskCount: 5 }; }
  health() { return ['API', 'Database', 'AI Core', 'YouTube'].map((name, index) => ({ name, status: index === 2 ? 'YELLOW' : 'GREEN', detail: index === 2 ? 'Model queue is elevated.' : 'Operating normally.' })); }
  revenue() { return { total: 184200, monthly: 28450, trendPercent: 12, trend: [19000, 21400, 23100, 25400, 28450] }; }
  channels() { return Array.from({ length: 10 }, (_, index) => ({ id: `channel-${index + 1}`, name: `Creator Channel ${index + 1}`, subscribers: 120000 - index * 8500, monetized: index < 8, growthPercent: 4 + (index % 6) })); }
  aiStatus() { return ['Content planning', 'Script review', 'Quality scoring', 'Audience analysis', 'Monetization advice'].map((name, index) => ({ name, status: index === 3 ? 'IDLE' : 'ACTIVE', detail: `Mock ${name.toLowerCase()} service.` })); }
  risks() { return ['Security review due', 'Revenue concentration', 'Copyright review', 'Channel compliance', 'AI queue latency'].map((title, index) => ({ id: `risk-${index + 1}`, title, severity: index < 2 ? 'HIGH' : index < 4 ? 'MEDIUM' : 'LOW', detail: 'Mock executive risk alert.' })); }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
