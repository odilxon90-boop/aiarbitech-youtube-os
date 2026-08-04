import type { FastifyInstance } from 'fastify';
import type { PlatformLogger } from './logger.js';
import { requestLogContext } from './logger.js';

export function registerRequestLogging(app: FastifyInstance, logger: PlatformLogger): void {
  app.addHook('onRequest', async (request) => {
    logger.info('Request received', requestLogContext(request));
  });

  app.addHook('onResponse', async (request, reply) => {
    logger.info('Request completed', {
      ...requestLogContext(request),
      statusCode: reply.statusCode,
      responseTimeMs: reply.elapsedTime,
    });
  });
}
