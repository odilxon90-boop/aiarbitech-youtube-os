import type {
  HeirDashboard,
  HealthMetric,
  RevenueOverview,
  ChannelStat,
  AIStatus,
  RiskAlert,
  TrainingProgress,
} from './heir-service.js';
import {
  getHeirDashboard,
  getHealth,
  getRevenue,
  getChannels,
  getAiStatus,
  getRisks,
  getTraining,
} from './heir-service.js';

export interface HeirController {
  getDashboard(): Promise<HeirDashboard>;
  getHealth(): Promise<{ health: HealthMetric[] }>;
  getRevenue(): Promise<RevenueOverview>;
  getChannels(): Promise<{ channels: ChannelStat[] }>;
  getAiStatus(): Promise<{ aiStatus: AIStatus[] }>;
  getRisks(): Promise<{ risks: RiskAlert[] }>;
  getTraining(): Promise<TrainingProgress>;
}

export const heirController: HeirController = {
  getDashboard: () => getHeirDashboard(),
  getHealth: () => getHealth(),
  getRevenue: () => getRevenue(),
  getChannels: () => getChannels(),
  getAiStatus: () => getAiStatus(),
  getRisks: () => getRisks(),
  getTraining: () => getTraining(),
};
