import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import type { SuccessService } from './success-service.js';
function authorizeSuccess(request: FastifyRequest): void { requirePermission(request, 'success:access'); }
export class SuccessController {
  constructor(private readonly service: SuccessService) {}
  current(request: FastifyRequest) { authorizeSuccess(request); return this.service.current(); }
  history(request: FastifyRequest) { authorizeSuccess(request); return this.service.history(); }
  breakdown(request: FastifyRequest) { authorizeSuccess(request); return this.service.breakdown(); }
  improvements(request: FastifyRequest) { authorizeSuccess(request); return this.service.improvements(); }
}
