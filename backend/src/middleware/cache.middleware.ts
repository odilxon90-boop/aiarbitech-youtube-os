import type { FastifyInstance } from 'fastify';

const CACHEABLE_PREFIXES = [
  '/api/v1/platform/',
  '/api/v1/quality/',
  '/api/v1/success-score/',
  '/api/v1/gateway/',
  '/api/v1/prompts/performance',
];

export function registerCacheMiddleware(app: FastifyInstance): void {
  app.addHook('onSend', async (request, reply, payload) => {
    if (
      request.method === 'GET' &&
      reply.statusCode === 200 &&
      CACHEABLE_PREFIXES.some((prefix) => request.url.startsWith(prefix))
    ) {
      reply.header('Cache-Control', 'private, max-age=60, stale-while-revalidate=30');
    }
    return payload;
  });
}
