import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
export function requireGovernanceAccess(request: FastifyRequest): void { requirePermission(request, 'governance:access'); }
