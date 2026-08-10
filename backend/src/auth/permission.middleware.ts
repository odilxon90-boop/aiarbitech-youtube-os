import type { FastifyRequest } from 'fastify';
import { PlatformError } from '../shared/errors.js';
import { requireAuthenticated } from './auth.middleware.js';

export function requirePermission(request: FastifyRequest, permission: string): void {
  const claims = requireAuthenticated(request);
  if (!claims.permissions.includes(permission)) {
    throw new PlatformError(403, 'PERMISSION_DENIED', `The ${permission} permission is required.`);
  }
}
