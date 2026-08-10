<<<<<<< HEAD
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
=======
import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import type { PresidentService } from './president-service.js';
export class PresidentController {
  constructor(private readonly service: PresidentService) {}
  private authorize(request: FastifyRequest) { requirePermission(request, 'president:access'); }
  dashboard(request: FastifyRequest) { this.authorize(request); return this.service.dashboard(); }
  health(request: FastifyRequest) { this.authorize(request); return this.service.health(); }
  revenue(request: FastifyRequest) { this.authorize(request); return this.service.revenue(); }
  channels(request: FastifyRequest) { this.authorize(request); return this.service.channels(); }
  aiStatus(request: FastifyRequest) { this.authorize(request); return this.service.aiStatus(); }
  risks(request: FastifyRequest) { this.authorize(request); return this.service.risks(); }
}
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
