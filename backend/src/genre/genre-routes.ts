import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { GenreController } from './genre-controller.js';
import { GenreService } from './genre-service.js';

export function registerGenreRoutes(
  app: FastifyInstance,
  controller = new GenreController(new GenreService()),
): void {
  app.get<{ Querystring: { channelId?: string } }>('/api/v1/genres/recommendations', async (request) =>
    successResponse(controller.recommendations(request), request.correlationId),
  );
}
