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

export interface TrainingModule {
  id: string;
  title: string;
  completed: boolean;
  score: number;
}

export interface TrainingProgress {
  modulesCompleted: number;
  totalModules: number;
  overallScore: number;
  nextSteps: string[];
  modules: TrainingModule[];
}

export interface HeirDashboard {
  health: HealthMetric[];
  revenue: RevenueOverview;
  channels: ChannelStat[];
  aiStatus: AIStatus[];
  risks: RiskAlert[];
  training: TrainingProgress;
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

const MOCK_CHANNELS: ChannelStat[] = Array.from({ length: 8 }, (_, idx) => ({
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
  { id: 'ai-4', name: 'Analytics Engine', state: 'ERROR', lastActive: '2026-08-09T09:30:00.000Z', message: 'Data sync delayed; retrying.' },
];

const MOCK_RISKS: RiskAlert[] = [
  { id: 'r-1', severity: 'HIGH', title: 'Revenue dependency', description: '85% of revenue comes from one channel.', category: 'Monetization' },
  { id: 'r-2', severity: 'MEDIUM', title: 'API quota spike', description: 'YouTube API usage spiked 40% this week.', category: 'Security' },
  { id: 'r-3', severity: 'LOW', title: 'Outdated thumbnails', description: 'Older videos have low-CTR thumbnails.', category: 'Compliance' },
  { id: 'r-4', severity: 'CRITICAL', title: 'Copyright claim', description: 'One video received a copyright strike.', category: 'Compliance' },
];

const MOCK_TRAINING: TrainingProgress = {
  modulesCompleted: 3,
  totalModules: 4,
  overallScore: 82,
  nextSteps: ['Complete advanced moderation module', 'Review copyright compliance'],
  modules: [
    { id: 't-1', title: 'Platform Fundamentals', completed: true, score: 90 },
    { id: 't-2', title: 'Content Governance', completed: true, score: 88 },
    { id: 't-3', title: 'Revenue Optimization', completed: true, score: 82 },
    { id: 't-4', title: 'Advanced Moderation', completed: false, score: 0 },
  ],
};

export async function getHeirDashboard(): Promise<HeirDashboard> {
  return {
    health: MOCK_HEALTH,
    revenue: MOCK_REVENUE,
    channels: MOCK_CHANNELS,
    aiStatus: MOCK_AI_STATUS,
    risks: MOCK_RISKS,
    training: MOCK_TRAINING,
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
}

export async function getTraining(): Promise<TrainingProgress> {
  return MOCK_TRAINING;
}
