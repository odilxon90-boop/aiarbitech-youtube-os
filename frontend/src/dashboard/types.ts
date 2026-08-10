// Creator Dashboard types. Mirrors the backend dashboard service DTOs.

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

export interface RevenuePoint {
  date: string;
  value: number;
}

export interface RevenueSeries {
  points: readonly RevenuePoint[];
}

export interface ChannelHealth {
  score: number;
  label: string;
  details: string[];
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