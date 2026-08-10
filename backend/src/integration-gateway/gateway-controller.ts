<<<<<<< HEAD
import type {
  GatewayStatusResponse,
  EndpointListResponse,
  GatewayCallRequest,
  GatewayCallResponse,
  GatewayLogResponse,
  GatewayHealthResponse,
} from './gateway-service.js';
import {
  getGatewayStatus,
  listEndpoints,
  callEndpoint,
  getGatewayLogs,
  getGatewayHealth,
} from './gateway-service.js';

export interface GatewayController {
  getStatus(): Promise<GatewayStatusResponse>;
  listEndpoints(): Promise<EndpointListResponse>;
  callEndpoint(endpointId: string, payload: GatewayCallRequest): Promise<GatewayCallResponse | null>;
  getLogs(): Promise<GatewayLogResponse>;
  getHealth(): Promise<GatewayHealthResponse>;
}

export const gatewayController: GatewayController = {
  getStatus: () => getGatewayStatus(),
  listEndpoints: () => listEndpoints(),
  callEndpoint: (id, payload) => callEndpoint(id, payload),
  getLogs: () => getGatewayLogs(),
  getHealth: () => getGatewayHealth(),
};
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
