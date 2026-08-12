import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import type { AuthController } from './auth.controller.js';

export function registerAuthRoutes(app: FastifyInstance, controller: AuthController): void {
  app.post<{ Body: { email: string; password: string } }>('/api/v1/auth/login', async (request) =>
    successResponse(controller.login(request), request.correlationId),
  );
  app.post<{ Body: { refreshToken: string } }>('/api/v1/auth/refresh', async (request) =>
    successResponse(controller.refresh(request), request.correlationId),
  );
  app.post('/api/v1/auth/logout', async (request) =>
    successResponse(controller.logout(request), request.correlationId),
  );
  app.get('/api/v1/privacy/export', async (request) =>
    successResponse(controller.exportPersonalData(request), request.correlationId),
  );
  app.post('/api/v1/privacy/deletion-request', async (request) =>
    successResponse(controller.requestAccountDeletion(request), request.correlationId),
  );
}
