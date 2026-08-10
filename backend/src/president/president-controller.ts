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
