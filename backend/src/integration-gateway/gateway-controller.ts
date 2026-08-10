import type { FastifyRequest } from 'fastify';
import { requireGatewayAccess } from './gateway-middleware.js';
import type { GatewayService } from './gateway-service.js';
export class GatewayController {
  constructor(private readonly service: GatewayService) {}
  status(request: FastifyRequest) { requireGatewayAccess(request); return this.service.status(); }
  endpoints(request: FastifyRequest) { requireGatewayAccess(request); return this.service.endpoints(); }
  call(request: FastifyRequest<{ Params: { endpoint: string } }>) { requireGatewayAccess(request); return this.service.call(request.params.endpoint); }
  logs(request: FastifyRequest) { requireGatewayAccess(request); return this.service.logs(); }
  health(request: FastifyRequest) { requireGatewayAccess(request); return this.service.health(); }
}
