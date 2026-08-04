import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import type { ApiErrorResponse } from '../contracts/api.js';
import type { PlatformLogger } from './logger.js';

export class PlatformError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
    readonly retryable = false,
  ) {
    super(message);
    this.name = 'PlatformError';
  }
}

export function registerErrorHandler(app: FastifyInstance, logger: PlatformLogger): void {
  app.setErrorHandler((error, request, reply) => {
    const platformError =
      error instanceof PlatformError
        ? error
        : new PlatformError(500, 'INTERNAL_ERROR', 'An unexpected platform error occurred.');

    if (!(error instanceof PlatformError) && !(error instanceof ZodError)) {
      logger.error('Unhandled request error', {
        correlationId: request.correlationId,
        errorName: error instanceof Error ? error.name : 'UnknownError',
      });
    }

    const response: ApiErrorResponse = {
      error: {
        code: platformError.code,
        message: platformError.message,
        correlationId: request.correlationId,
        retryable: platformError.retryable,
        ...(error instanceof ZodError
          ? {
              details: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                reason: issue.message,
              })),
            }
          : {}),
      },
    };

    reply.status(platformError.statusCode).send(response);
  });
}
