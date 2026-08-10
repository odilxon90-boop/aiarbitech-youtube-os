import {
  getDashboardSummary,
  getKpiSummary,
  getRecommendations,
  type DashboardSummary,
  type KpiSummary,
  type RecommendationList,
} from './dashboard-service.js';

export interface DashboardController {
  getSummary(): Promise<DashboardSummary>;
  getKpis(): Promise<KpiSummary>;
  getRecommendations(): Promise<RecommendationList>;
}

export const dashboardController: DashboardController = {
  getSummary: () => getDashboardSummary(),
  getKpis: () => getKpiSummary(),
  getRecommendations: () => getRecommendations(),
};