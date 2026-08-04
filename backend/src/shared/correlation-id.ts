import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';

declare module 'fastify' {
  interface FastifyRequest {
    correlationId: string;
  }
}

export function registerCorrelationIds(app: FastifyInstance): void {
  app.addHook('onRequest', async (request, reply) => {
    const incoming = request.headers['x-correlation-id'];
    const correlationId =
      typeof incoming === 'string' && incoming.length > 0 && incoming.length <= 128
        ? incoming
        : randomUUID();
    request.correlationId = correlationId;
    reply.header('x-correlation-id', correlationId);
  });
}
