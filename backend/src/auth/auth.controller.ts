import { timingSafeEqual } from 'node:crypto';
import { randomUUID } from 'node:crypto';
import type { FastifyRequest } from 'fastify';
import { PlatformError } from '../shared/errors.js';
import { requireAuthenticated } from './auth.middleware.js';
import type { JwtIdentity, JwtService } from './jwt.service.js';

interface LoginInput {
  email: string;
  password: string;
}

const adminPermissions = [
  'admin:access',
  'ai-sync:access',
  'workflow:access',
  'prompts:access',
  'onboarding:access',
  'success:access',
  'twin:access',
  'gateway:access',
  'governance:access',
  'quality:read',
  'dashboard:access',
  'analytics:access',
  'ai:access',
  'goals:manage',
  'videos:read',
  'music:read',
  'music:license',
  'genres:read',
] as const;

function passwordsMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly bootstrapAdmin: { email: string; password: string },
  ) {}

  login(request: FastifyRequest<{ Body: LoginInput }>) {
    const { email, password } = request.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new PlatformError(400, 'INVALID_LOGIN_INPUT', 'email and password are required.');
    }
    const identity = email.trim().toLowerCase() === this.bootstrapAdmin.email.toLowerCase()
      ? {
          id: 'user-admin-01',
          email: this.bootstrapAdmin.email,
          password: this.bootstrapAdmin.password,
          role: 'Admin',
          permissions: adminPermissions,
        }
      : undefined;
    if (!identity || !passwordsMatch(password, identity.password)) {
      throw new PlatformError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }
    const familyId = randomUUID();
    return {
      token: this.jwtService.sign(identity, 'access', familyId),
      refreshToken: this.jwtService.sign(identity, 'refresh', familyId),
      user: { id: identity.id, email: identity.email, role: identity.role, permissions: identity.permissions },
    };
  }

  refresh(request: FastifyRequest<{ Body: { refreshToken: string } }>) {
    if (typeof request.body.refreshToken !== 'string') {
      throw new PlatformError(400, 'INVALID_REFRESH_INPUT', 'refreshToken is required.');
    }
    const claims = this.jwtService.verify(request.body.refreshToken, 'refresh');
    const identity: JwtIdentity = { id: claims.sub, email: claims.email, role: claims.role, permissions: claims.permissions };
    const familyId = randomUUID();
    return { token: this.jwtService.sign(identity, 'access', familyId), refreshToken: this.jwtService.sign(identity, 'refresh', familyId) };
  }

  logout(request: FastifyRequest) {
    const claims = requireAuthenticated(request);
    this.jwtService.revoke(claims);
    return { loggedOut: true };
  }
}
