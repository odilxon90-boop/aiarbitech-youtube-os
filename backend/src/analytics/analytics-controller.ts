import { type AnalyticsSummary, type AnalyticsTrends, type AnalyticsPerformance, getAnalyticsSummary, getAnalyticsPerformance, getAnalyticsTrends, getAnalyticsOverview } from './analytics-service.js';

export interface AnalyticsController {
  getSummary(): Promise<AnalyticsSummary>;
  getTrends(): Promise<AnalyticsTrends>;
  getPerformance(): Promise<AnalyticsPerformance>;
  getOverview(channel?: string, range?: 'week' | 'month'): Promise<{ dateRange: 'week' | 'month'; channel: string; views: number[]; retentionPercent: number; revenue: number }>;
}

export const analyticsController: AnalyticsController = {
  getSummary: () => getAnalyticsSummary(),
  getTrends: () => getAnalyticsTrends(),
  getPerformance: () => getAnalyticsPerformance(),
  getOverview: (channel, range) => getAnalyticsOverview(channel, range),
};