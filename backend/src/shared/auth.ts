import type { FastifyRequest } from 'fastify';
import { PlatformError } from './errors.js';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: Principal;
  }
}

export type PrincipalRole = 'CREATOR' | 'ADMIN' | 'VIEWER';

export interface Principal {
  subject: string;
  role: PrincipalRole;
  permissions: readonly string[];
}

/**
 * Mock credential store for the dashboard foundation. This is stub/development
 * authentication only; it authorizes no production integration and is replaced by
 * the Global Ecosystem Identity/Auth boundary when authoritative contracts exist.
 */
const MOCK_CREDENTIALS: Readonly<Record<string, Principal>> = {
  'mock-creator-token': {
    subject: 'creator-1',
    role: 'CREATOR',
    permissions: ['dashboard:read', 'ai:chat', 'analytics:read', 'goals:read', 'goals:write', 'memory:read', 'memory:write', 'intelligence:read', 'video:read', 'video:write', 'genre:read'],
  },
  'mock-creator-token-2': {
    subject: 'creator-2',
    role: 'CREATOR',
    permissions: ['dashboard:read', 'ai:chat', 'analytics:read', 'goals:read', 'goals:write', 'memory:read', 'memory:write', 'intelligence:read', 'video:read', 'video:write', 'genre:read'],
  },
  'mock-admin-token': {
    subject: 'admin-1',
    role: 'ADMIN',
    permissions: ['dashboard:read', 'dashboard:admin', 'ai:chat', 'analytics:read', 'goals:read', 'goals:write', 'memory:read', 'memory:write', 'intelligence:read', 'video:read', 'video:write', 'genre:read', 'president:access', 'admin:access', 'gateway:access'],
  },
  'mock-president-token': {
    subject: 'president-1',
    role: 'ADMIN',
    permissions: ['dashboard:read', 'dashboard:admin', 'ai:chat', 'analytics:read', 'goals:read', 'goals:write', 'memory:read', 'memory:write', 'intelligence:read', 'video:read', 'video:write', 'genre:read', 'president:access', 'admin:access', 'gateway:access'],
  },
  'mock-heir-token': {
    subject: 'heir-1',
    role: 'ADMIN',
    permissions: ['dashboard:read', 'dashboard:admin', 'ai:chat', 'analytics:read', 'goals:read', 'goals:write', 'memory:read', 'memory:write', 'intelligence:read', 'video:read', 'video:write', 'genre:read', 'heir:access'],
  },
  'mock-ai-sync-token': {
    subject: 'ai-sync-1',
    role: 'ADMIN',
    permissions: ['dashboard:read', 'dashboard:admin', 'ai:chat', 'analytics:read', 'goals:read', 'goals:write', 'memory:read', 'memory:write', 'intelligence:read', 'video:read', 'video:write', 'genre:read', 'ai-sync:access'],
  },
  'mock-viewer-token': {
    subject: 'viewer-1',
    role: 'VIEWER',
    permissions: [],
  },
};

export function bearerToken(request: FastifyRequest): string | undefined {
  const header = request.headers.authorization;
  if (!header) return undefined;
  const [scheme, credential] = header.split(' ');
  if (scheme !== 'Bearer' || !credential) return undefined;
  return credential;
}

export function resolvePrincipal(token: string | undefined): Principal | undefined {
  if (!token) return undefined;
  return MOCK_CREDENTIALS[token];
}

/**
 * Enforces authentication (401) and permission (403) for a single request.
 * Returns the resolved principal for the request handler to use.
 */
export function requirePermission(request: FastifyRequest, permission: string): Principal {
  const principal = resolvePrincipal(bearerToken(request));
  if (!principal) {
    throw new PlatformError(401, 'UNAUTHORIZED', 'A valid bearer token is required.');
  }
  if (!principal.permissions.includes(permission)) {
    throw new PlatformError(
      403,
      'FORBIDDEN',
      'Insufficient permissions for the requested operation.',
    );
  }
  request.auth = principal;
  return principal;
}