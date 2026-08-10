import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import type { TwinService } from './twin-service.js';
function authorizeTwin(request: FastifyRequest): void { requirePermission(request, 'twin:access'); }
export class TwinController {
  constructor(private readonly service: TwinService) {}
  status(request: FastifyRequest) { authorizeTwin(request); return this.service.statusInfo(); }
  activate(request: FastifyRequest) { authorizeTwin(request); return this.service.activate(); }
  deactivate(request: FastifyRequest) { authorizeTwin(request); return this.service.deactivate(); }
  decisions(request: FastifyRequest) { authorizeTwin(request); return this.service.decisions(); }
  learn(request: FastifyRequest<{ Body: { source: string; summary: string } }>) { authorizeTwin(request); return this.service.learn(request.body.source, request.body.summary); }
  recommendations(request: FastifyRequest) { authorizeTwin(request); return this.service.recommendations(); }
}
