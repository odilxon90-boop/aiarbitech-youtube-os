import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { GatewayController } from './gateway-controller.js';
import { GatewayService } from './gateway-service.js';
export function registerGatewayRoutes(app: FastifyInstance, controller = new GatewayController(new GatewayService())): void {
  app.get('/api/v1/gateway/status', async (request) => successResponse(controller.status(request), request.correlationId));
  app.get('/api/v1/gateway/endpoints', async (request) => successResponse(controller.endpoints(request), request.correlationId));
  app.post<{ Params: { endpoint: string } }>('/api/v1/gateway/call/:endpoint', async (request) => successResponse(controller.call(request), request.correlationId));
  app.get('/api/v1/gateway/logs', async (request) => successResponse(controller.logs(request), request.correlationId));
  app.get('/api/v1/gateway/health', async (request) => successResponse(controller.health(request), request.correlationId));
}
