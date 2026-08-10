<<<<<<< HEAD
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
=======
import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
export function requireGatewayAccess(request: FastifyRequest): void { requirePermission(request, 'gateway:access'); }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
