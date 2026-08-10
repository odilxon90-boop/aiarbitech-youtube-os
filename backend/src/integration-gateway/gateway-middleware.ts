import type { FastifyInstance } from 'fastify';

/**
 * Gateway middleware. Attaches request-level gateway metadata (correlation tracing,
 * rate-limit headers) to all /api/v1/gateway/* requests. Stub only — no real
 * rate-limiting logic until the Global Ecosystem contracts are ratified.
 */
export function registerGatewayMiddleware(app: FastifyInstance): void {
  app.addHook('onSend', async (request, reply, payload) => {
    if (request.url.startsWith('/api/v1/gateway/')) {
      reply.header('X-Gateway-Version', '1.4.2');
      reply.header('X-Gateway-RateLimit-Remaining', '4872');
      reply.header('X-Gateway-Circuit-Breaker', 'CLOSED');
    }
    return payload;
  });
}
