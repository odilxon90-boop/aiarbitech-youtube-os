import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { gatewayController } from './gateway-controller.js';
import type { GatewayCallRequest } from './gateway-service.js';

const GATEWAY_ACCESS = 'gateway:access';

export function registerGatewayRoutes(app: FastifyInstance): void {
  app.get('/api/v1/gateway/status', async (request) => {
    requirePermission(request, GATEWAY_ACCESS);
    return successResponse(await gatewayController.getStatus(), request.correlationId);
  });

  app.get('/api/v1/gateway/endpoints', async (request) => {
    requirePermission(request, GATEWAY_ACCESS);
    return successResponse(await gatewayController.listEndpoints(), request.correlationId);
  });

  app.post('/api/v1/gateway/call/:endpoint', async (request) => {
    requirePermission(request, GATEWAY_ACCESS);
    const { endpoint } = request.params as { endpoint: string };
    const payload = (request.body ?? {}) as GatewayCallRequest;
    const result = await gatewayController.callEndpoint(endpoint, payload);
    if (!result) {
      throw new PlatformError(404, 'NOT_FOUND', `Endpoint '${endpoint}' is not registered in the gateway.`);
    }
    return successResponse(result, request.correlationId);
  });

  app.get('/api/v1/gateway/logs', async (request) => {
    requirePermission(request, GATEWAY_ACCESS);
    return successResponse(await gatewayController.getLogs(), request.correlationId);
  });

  app.get('/api/v1/gateway/health', async (request) => {
    requirePermission(request, GATEWAY_ACCESS);
    return successResponse(await gatewayController.getHealth(), request.correlationId);
  });
}
