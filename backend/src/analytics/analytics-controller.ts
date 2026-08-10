import { type AnalyticsSummary, type AnalyticsTrends, type AnalyticsPerformance, getAnalyticsSummary, getAnalyticsPerformance, getAnalyticsTrends } from './analytics-service.js';

export interface AnalyticsController {
  getSummary(): Promise<AnalyticsSummary>;
  getTrends(): Promise<AnalyticsTrends>;
  getPerformance(): Promise<AnalyticsPerformance>;
}

export const analyticsController: AnalyticsController = {
  getSummary: () => getAnalyticsSummary(),
  getTrends: () => getAnalyticsTrends(),
  getPerformance: () => getAnalyticsPerformance(),
};