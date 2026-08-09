import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import type { EnvironmentConfig } from '../config/environment.js';

export function registerHealthRoutes(app: FastifyInstance, config: EnvironmentConfig): void {
  app.get('/', async (request, reply) => {
    reply.header('content-type', 'text/plain; charset=utf-8');
    return reply.send('AIArbiTech YouTube OS backend');
  });

  app.get('/favicon.ico', async (_request, reply) => {
    reply.code(204).send();
  });

  app.get('/api/v1/health/live', async (request) =>
    successResponse(
      {
        status: 'ALIVE',
        platformId: 'PLATFORM_YOUTUBE_OS',
        timestamp: new Date().toISOString(),
      },
      request.correlationId,
    ),
  );

  app.get('/api/v1/health/ready', async (request) =>
    successResponse(
      {
        status: 'READY',
        checks: {
          environment: 'VALID',
          platformManifest: 'AVAILABLE',
          globalEcosystem: config.GLOBAL_ECOSYSTEM_BASE_URL ? 'NOT_VERIFIED' : 'NOT_CONFIGURED',
        },
      },
      request.correlationId,
    ),
  );
}
