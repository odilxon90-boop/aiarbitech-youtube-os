import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { buildYouTubeAuthorizeUrl } from '../oauth.js';
import type { AuthController } from './auth.controller.js';

export function registerAuthRoutes(app: FastifyInstance, controller: AuthController): void {
  app.get<{ Querystring: { state?: string } }>('/api/v1/auth/youtube/authorize-url', async (request) =>
    successResponse(
      {
        authorizeUrl: buildYouTubeAuthorizeUrl({ state: request.query.state }),
      },
      request.correlationId,
    ),
  );

  app.post<{ Body: { email: string; password: string } }>('/api/v1/auth/login', async (request) =>
    successResponse(controller.login(request), request.correlationId),
  );
  app.post<{ Body: { refreshToken: string } }>('/api/v1/auth/refresh', async (request) =>
    successResponse(controller.refresh(request), request.correlationId),
  );
  app.post('/api/v1/auth/logout', async (request) =>
    successResponse(controller.logout(request), request.correlationId),
  );
}
