/**
 * Validation middleware — Zod-based request body validation helper.
 *
 * Usage in a route handler:
 *
 *   import { validateBody } from '../middleware/validation.middleware.js';
 *   import { z } from 'zod';
 *
 *   const schema = z.object({ name: z.string().min(1) });
 *
 *   app.post('/example', async (request) => {
 *     const body = validateBody(request, schema);
 *     // body is fully typed and validated
 *   });
 */

import type { FastifyRequest } from 'fastify';
import { z, type ZodTypeAny } from 'zod';
import { PlatformError } from '../shared/errors.js';

/**
 * Validates `request.body` against the provided Zod schema.
 * Throws a 400 PlatformError with structured field errors on failure.
 */
export function validateBody<T extends ZodTypeAny>(
  request: FastifyRequest,
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join('; ');
    throw new PlatformError(400, 'VALIDATION_ERROR', message);
  }
  return result.data as z.infer<T>;
}

/**
 * Validates `request.params` against the provided Zod schema.
 * Throws a 400 PlatformError with structured field errors on failure.
 */
export function validateParams<T extends ZodTypeAny>(
  request: FastifyRequest,
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(request.params);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'params'}: ${issue.message}`)
      .join('; ');
    throw new PlatformError(400, 'VALIDATION_ERROR', message);
  }
  return result.data as z.infer<T>;
}

/**
 * Validates `request.query` against the provided Zod schema.
 * Throws a 400 PlatformError with structured field errors on failure.
 */
export function validateQuery<T extends ZodTypeAny>(
  request: FastifyRequest,
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(request.query);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'query'}: ${issue.message}`)
      .join('; ');
    throw new PlatformError(400, 'VALIDATION_ERROR', message);
  }
  return result.data as z.infer<T>;
}

// ─── Common reusable schemas ──────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().min(1).max(128).regex(/^[\w-]+$/, 'id must be alphanumeric with hyphens only'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
