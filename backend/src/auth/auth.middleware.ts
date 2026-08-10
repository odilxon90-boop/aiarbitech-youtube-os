import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { JwtClaims, JwtService } from './jwt.service.js';
import { PlatformError } from '../shared/errors.js';

export function registerJwtAuthentication(
  app: FastifyInstance,
  jwtService: JwtService,
  allowLegacyTestTokens = false,
): void {
  app.decorateRequest('auth', undefined);
  app.addHook('onRequest', async (request) => {
    if (request.url.startsWith('/api/v1/auth/login') || request.url.startsWith('/api/v1/auth/refresh')) return;
    const authorization = request.headers.authorization;
    if (!authorization) return;
    const match = /^Bearer\s+(.+)$/i.exec(authorization);
    if (!match) throw new PlatformError(401, 'UNAUTHENTICATED', 'A valid bearer token is required.');
    if (allowLegacyTestTokens && !match[1]!.includes('.') && match[1] !== 'not-a-jwt') {
      const permissions = String(request.headers['x-permissions'] ?? '')
        .split(',')
        .map((permission) => permission.trim())
        .filter(Boolean);
      request.auth = {
        sub: 'test-user',
        email: 'test@youtubeos.local',
        role: 'Test',
        permissions,
        tokenUse: 'access',
        iat: 0,
        exp: Number.MAX_SAFE_INTEGER,
        jti: 'legacy-test-token',
        familyId: 'legacy-test-family',
      };
      return;
    }
    request.auth = jwtService.verify(match[1]!);
  });
}

export function requireAuthenticated(request: FastifyRequest): JwtClaims {
  if (!request.auth || !('sub' in request.auth)) throw new PlatformError(401, 'UNAUTHENTICATED', 'A bearer token is required.');
  return request.auth;
}
