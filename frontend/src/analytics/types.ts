// Creator Analytics Center types. Mirrors the backend analytics service DTOs.

export type AnalyticsMetric = 'subscribers' | 'views' | 'watchTime' | 'ctr' | 'revenue';

export interface TimePoint {
  date: string;
  value: number;
}

export interface MetricSeries {
  metric: AnalyticsMetric;
  label: string;
  points: readonly TimePoint[];
}

export interface MetricSummary {
  metric: AnalyticsMetric;
  label: string;
  value: number;
  delta: number;
  display: string;
}

export interface AnalyticsSummary {
  generatedAt: string;
  metrics: readonly MetricSummary[];
}

export interface AnalyticsTrends {
  generatedAt: string;
  series: readonly MetricSeries[];
}

export interface TopVideo {
  id: string;
  title: string;
  views: number;
  watchTimeHours: number;
  ctr: number;
  revenue: number;
}

export interface RegionBreakdown {
  country: string;
  share: number;
  viewers: number;
}

export interface DeviceBreakdown {
  device: string;
  share: number;
  viewers: number;
}

export interface AnalyticsPerformance {
  generatedAt: string;
  topVideos: readonly TopVideo[];
  geography: readonly RegionBreakdown[];
  devices: readonly DeviceBreakdown[];
}

export interface AnalyticsBundle {
  summary: AnalyticsSummary;
  trends: AnalyticsTrends;
  performance: AnalyticsPerformance;
}

export interface AnalyticsClient {
  loadBundle(signal?: AbortSignal): Promise<AnalyticsBundle>;
}

export const METRIC_LABELS: Readonly<Record<AnalyticsMetric, string>> = {
  subscribers: 'Subscribers',
  views: 'Views',
  watchTime: 'Watch Time',
  ctr: 'CTR',
  revenue: 'Revenue',
};