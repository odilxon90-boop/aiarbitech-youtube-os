// Creator Dashboard service. Returns mock/stub data only; no real YouTube API,
// no persistence, no business runtime. Replace with data source after Gate 0.

export type AiStatusLevel = 'HEALTHY' | 'DEGRADED' | 'CRITICAL';

export interface AiStatus {
  level: AiStatusLevel;
  label: string;
  detail: string;
  updatedAt: string;
}

export interface MonetizationProgress {
  current: number;
  goal: number;
  note: string;
}

export interface ChannelSummary {
  id: string;
  title: string;
  subscriberCount: string;
  videoCount: number;
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: number;
  hint: string;
}

export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  title: string;
  reason: string;
}

export interface ActivityItem {
  id: string;
  at: string;
  message: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface AiChatShortcut {
  enabled: boolean;
  label: string;
  prompt: string;
}

export interface ChannelHealth {
  score: number;
  label: string;
  details: string[];
}

export interface RevenuePoint {
  date: string;
  value: number;
}

export interface RevenueSeries {
  points: readonly RevenuePoint[];
}

export interface DashboardSummary {
  aiStatus: AiStatus;
  monetization: MonetizationProgress;
  channels: ChannelSummary[];
  kpis: Kpi[];
  recommendations: Recommendation[];
  recentActivity: ActivityItem[];
  quickActions: QuickAction[];
  aiChat: AiChatShortcut;
  revenueSeries: RevenueSeries;
  channelHealth: ChannelHealth;
}

export interface KpiSummary {
  metrics: Kpi[];
}

export interface RecommendationList {
  count: number;
  items: Recommendation[];
}

const nowIso = (): string => new Date().toISOString();

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return {
    aiStatus: {
      level: 'HEALTHY',
      label: 'HEALTHY',
      detail: 'AI Director is running with a healthy recommendation pipeline.',
      updatedAt: nowIso(),
    },
    monetization: {
      current: 512,
      goal: 1000,
      note: 'Affiliate + paid subscription earnings toward the $1,000 milestone.',
    },
    channels: [
      { id: 'chn-1', title: 'AIArbiTech Actions', subscriberCount: '18,240', videoCount: 42 },
      { id: 'chn-2', title: 'AI Automation Lab', subscriberCount: '9,610', videoCount: 17 },
    ],
    kpis: [
      { id: 'views', label: 'Views', value: '128,400', delta: 12.4, hint: 'last 28 days' },
      { id: 'subscribers', label: 'Subscribers', value: '27,850', delta: 5.1, hint: 'last 28 days' },
      { id: 'revenue', label: 'Revenue', value: '$512', delta: 8.7, hint: 'affiliate + subscriptions' },
      { id: 'ctr', label: 'CTR', value: '6.2%', delta: -0.4, hint: 'click-through rate' },
    ],
    recommendations: [
      {
        id: 'rec-1',
        priority: 'HIGH',
        title: 'Publish 3 shorts this week',
        reason: 'Shorts are driving 68% of new subscribers.',
      },
      {
        id: 'rec-2',
        priority: 'MEDIUM',
        title: 'Refresh the first 15 seconds',
        reason: 'Audience retention drops after the intro on recent uploads.',
      },
      {
        id: 'rec-3',
        priority: 'LOW',
        title: 'Add end screens to older videos',
        reason: 'End screens lift channel sessions by ~9%.',
      },
    ],
    recentActivity: [
      { id: 'act-1', at: '2h ago', message: 'Video "Top 5 AI Automations" scheduled for Friday.' },
      { id: 'act-2', at: '1d ago', message: 'New subscriber milestone reached on channel 1.' },
      { id: 'act-3', at: '2d ago', message: 'AI Director proposed 4 new topic ideas.' },
    ],
    quickActions: [
      { id: 'qa-1', label: 'New Video', icon: '🎬', description: 'Start drafting a video' },
      { id: 'qa-2', label: 'Schedule', icon: '📅', description: 'Plan the content calendar' },
      { id: 'qa-3', label: 'Analytics', icon: '📊', description: 'Open performance reports' },
    ],
    aiChat: {
      enabled: true,
      label: 'Ask AI',
      prompt: 'What should I publish next?',
    },
    revenueSeries: {
      points: Array.from({ length: 30 }, (_, idx) => {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - (29 - idx));
        const base = 18 + idx * 0.4 + Math.sin(idx * 0.6) * 4;
        return { date: date.toISOString().slice(0, 10), value: Number(base.toFixed(2)) };
      }),
    },
    channelHealth: {
      score: 84,
      label: 'Healthy',
      details: [
        'Upload consistency: 4.2/5',
        'Audience retention: 62%',
        'CTR benchmark: above average',
        'No copyright strikes',
      ],
    },
  };
}

export async function getKpiSummary(): Promise<KpiSummary> {
  const summary = await getDashboardSummary();
  return { metrics: summary.kpis };
}

export async function getRecommendations(): Promise<RecommendationList> {
  const summary = await getDashboardSummary();
  return { count: summary.recommendations.length, items: summary.recommendations };
}