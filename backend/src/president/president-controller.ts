import type {
  PresidentDashboard,
  HealthMetric,
  RevenueOverview,
  ChannelStat,
  AIStatus,
  RiskAlert,
} from './president-service.js';
import {
  getPresidentDashboard,
  getHealth,
  getRevenue,
  getChannels,
  getAiStatus,
  getRisks,
} from './president-service.js';

export interface PresidentController {
  getDashboard(): Promise<PresidentDashboard>;
  getHealth(): Promise<{ health: HealthMetric[] }>;
  getRevenue(): Promise<RevenueOverview>;
  getChannels(): Promise<{ channels: ChannelStat[] }>;
  getAiStatus(): Promise<{ aiStatus: AIStatus[] }>;
  getRisks(): Promise<{ risks: RiskAlert[] }>;
}

export const presidentController: PresidentController = {
  getDashboard: () => getPresidentDashboard(),
  getHealth: () => getHealth(),
  getRevenue: () => getRevenue(),
  getChannels: () => getChannels(),
  getAiStatus: () => getAiStatus(),
  getRisks: () => getRisks(),
};
