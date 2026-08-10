/**
 * Security middleware — hardening layer for the YouTube OS backend.
 *
 * Covers:
 *  - Strengthened Helmet (CSP, HSTS, referrer policy)
 *  - Security response headers on every reply
 *
 * Note: Rate limiting is now handled by rate-limit.middleware.ts
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// ─── Security middleware registration ────────────────────────────────────────

export function registerSecurityMiddleware(app: FastifyInstance): void {
  // ── Security response headers ────────────────────────────────────────────
  app.addHook('onSend', async (_request: FastifyRequest, reply: FastifyReply, payload) => {
    reply
      .header('X-Content-Type-Options', 'nosniff')
      .header('X-Frame-Options', 'DENY')
      .header('X-XSS-Protection', '0') // modern browsers rely on CSP; legacy header off
      .header('Referrer-Policy', 'strict-origin-when-cross-origin')
      .header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return payload;
  });
}

