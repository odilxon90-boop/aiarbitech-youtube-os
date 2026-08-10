import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
export function requireGatewayAccess(request: FastifyRequest): void { requirePermission(request, 'gateway:access'); }
