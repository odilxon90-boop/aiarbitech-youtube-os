import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { PlatformError } from '../shared/errors.js';

export type TokenUse = 'access' | 'refresh';

export interface JwtClaims {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  tokenUse: TokenUse;
  iat: number;
  exp: number;
  jti: string;
  familyId: string;
}

export interface JwtIdentity {
  id: string;
  email: string;
  role: string;
  permissions: readonly string[];
}

function encode(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function decode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function parseExpiration(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) throw new Error('JWT expiration must use the format <number><s|m|h|d>.');
  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3_600 : 86_400;
  return amount * multiplier;
}

export class JwtService {
  private readonly revokedFamilies = new Set<string>();

  constructor(
    private readonly secret: string,
    private readonly accessExpiration: string,
    private readonly refreshExpiration: string,
  ) {}

  sign(identity: JwtIdentity, tokenUse: TokenUse = 'access', familyId = randomUUID()): string {
    const issuedAt = Math.floor(Date.now() / 1_000);
    const claims: JwtClaims = {
      sub: identity.id,
      email: identity.email,
      role: identity.role,
      permissions: [...identity.permissions],
      tokenUse,
      iat: issuedAt,
      exp: issuedAt + parseExpiration(tokenUse === 'access' ? this.accessExpiration : this.refreshExpiration),
      jti: randomUUID(),
      familyId,
    };
    const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = encode(JSON.stringify(claims));
    return `${header}.${payload}.${this.signature(`${header}.${payload}`)}`;
  }

  verify(token: string, expectedUse: TokenUse = 'access'): JwtClaims {
    const [encodedHeader, encodedPayload, signature, ...rest] = token.split('.');
    if (!encodedHeader || !encodedPayload || !signature || rest.length > 0) this.unauthenticated();

    const expectedSignature = this.signature(`${encodedHeader!}.${encodedPayload!}`);
    if (
      signature!.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature!), Buffer.from(expectedSignature))
    ) this.unauthenticated();

    try {
      const header = JSON.parse(decode(encodedHeader!)) as { alg?: string; typ?: string };
      const claims = JSON.parse(decode(encodedPayload!)) as Partial<JwtClaims>;
      if (
        header.alg !== 'HS256' ||
        header.typ !== 'JWT' ||
        typeof claims.sub !== 'string' ||
        typeof claims.email !== 'string' ||
        typeof claims.role !== 'string' ||
        !Array.isArray(claims.permissions) ||
        !claims.permissions.every((permission) => typeof permission === 'string') ||
        claims.tokenUse !== expectedUse ||
        typeof claims.exp !== 'number' ||
        typeof claims.iat !== 'number' ||
        typeof claims.jti !== 'string' ||
        typeof claims.familyId !== 'string' ||
        claims.exp <= Math.floor(Date.now() / 1_000)
      ) this.unauthenticated();
      const verifiedClaims = claims as JwtClaims;
      if (this.revokedFamilies.has(verifiedClaims.familyId)) {
        throw new PlatformError(401, 'TOKEN_REVOKED', 'The token has been revoked.');
      }
      return verifiedClaims;
    } catch (error) {
      if (error instanceof PlatformError) throw error;
      this.unauthenticated();
    }
  }

  decode(token: string): Partial<JwtClaims> {
    const payload = token.split('.')[1];
    if (!payload) this.unauthenticated();
    try {
      return JSON.parse(decode(payload!)) as Partial<JwtClaims>;
    } catch {
      this.unauthenticated();
    }
  }

  revoke(claims: JwtClaims): void {
    this.revokedFamilies.add(claims.familyId);
  }

  private signature(value: string): string {
    return createHmac('sha256', this.secret).update(value).digest('base64url');
  }

  private unauthenticated(): never {
    throw new PlatformError(401, 'UNAUTHENTICATED', 'A valid bearer token is required.');
  }
}
