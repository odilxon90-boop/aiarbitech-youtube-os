/**
 * Production Security Middleware — Hardened security layer for production deployment.
 *
 * Enhances the base security middleware with:
 *  - Stricter Content Security Policy (CSP)
 *  - Enhanced HSTS with preload
 *  - Additional security headers (X-Content-Type-Options, X-Frame-Options, etc.)
 *  - CORS hardening with explicit origin validation
 *  - Rate limit header exposure
 *
 * This middleware should be used in production environments only.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// ─── Production CSP Configuration ────────────────────────────────────────────

const PRODUCTION_CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'strict-dynamic'",
    // Allow inline scripts only with nonce (recommended for production)
    // "'nonce-{random}'",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS libraries
  ],
  imgSrc: [
    "'self'",
    'data:',
    'https:',
    'blob:',
  ],
  connectSrc: [
    "'self'",
    // Add your API domains here
    // 'https://api.yourdomain.com',
    // 'https://*.yourdomain.com',
  ],
  fontSrc: [
    "'self'",
    'data:',
  ],
  objectSrc: ["'none'"],
  frameSrc: ["'none'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  upgradeInsecureRequests: [],
  blockAllMixedContent: [],
};

// ─── Production Security Headers ─────────────────────────────────────────────

const PRODUCTION_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '0', // Modern browsers rely on CSP
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

// ─── Production Security Middleware Registration ─────────────────────────────

export function registerProductionSecurityMiddleware(app: FastifyInstance): void {
  // ── Enhanced Security Headers ────────────────────────────────────────────
  app.addHook('onSend', async (_request: FastifyRequest, reply: FastifyReply, payload) => {
    // Apply all production security headers
    Object.entries(PRODUCTION_SECURITY_HEADERS).forEach(([key, value]) => {
      reply.header(key, value);
    });

    // Apply CSP header
    const cspHeader = Object.entries(PRODUCTION_CSP_DIRECTIVES)
      .map(([key, values]) => {
        const directiveName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${directiveName} ${values.join(' ')}`;
      })
      .join('; ');

    reply.header('Content-Security-Policy', cspHeader);

    // Apply HSTS header with preload
    reply.header(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );

    return payload;
  });

  // ── Request Validation ───────────────────────────────────────────────────
  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Block requests with suspicious headers
    const userAgent = request.headers['user-agent'];
    if (!userAgent || userAgent.length < 10) {
      // Allow empty user-agent for health checks and monitoring
      if (!request.url.includes('/health') && !request.url.includes('/metrics')) {
        reply.status(400).send({
          error: {
            code: 'BAD_REQUEST',
            message: 'Invalid request headers',
          },
        });
        return;
      }
    }

    // Block requests with overly long URLs (potential attack)
    if (request.url.length > 2000) {
      reply.status(414).send({
        error: {
          code: 'URI_TOO_LONG',
          message: 'Request URI is too long',
        },
      });
      return;
    }
  });
}

// ─── Production CORS Configuration Helper ────────────────────────────────────

export function getProductionCorsConfig(allowedOrigins: string[]) {
  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Correlation-Id',
      'X-Request-ID',
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'X-Request-ID',
      'X-Correlation-Id',
    ],
    maxAge: 86400, // 24 hours
  };
}
