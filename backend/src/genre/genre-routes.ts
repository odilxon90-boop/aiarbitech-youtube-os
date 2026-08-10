import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
<<<<<<< HEAD
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { genreController } from './genre-controller.js';

const GENRE_READ = 'genre:read';

export function registerGenreRoutes(app: FastifyInstance): void {
  app.get('/api/v1/genre/trends', async (request) => {
    requirePermission(request, GENRE_READ);
    return successResponse(await genreController.getTrends(), request.correlationId);
  });

  app.get('/api/v1/genre/recommendations', async (request) => {
    requirePermission(request, GENRE_READ);
    return successResponse(await genreController.getRecommendations(), request.correlationId);
  });

  app.get('/api/v1/genre/popularity', async (request) => {
    requirePermission(request, GENRE_READ);
    return successResponse(await genreController.getPopularity(), request.correlationId);
  });

  app.get('/api/v1/genre/:id/details', async (request) => {
    requirePermission(request, GENRE_READ);
    const { id } = request.params as { id: string };
    const result = await genreController.getGenreDetails(id);
    if (!result) {
      throw new PlatformError(404, 'NOT_FOUND', `Genre '${id}' was not found.`);
    }
    return successResponse(result, request.correlationId);
  });
=======
import { GenreController } from './genre-controller.js';
import { GenreService } from './genre-service.js';

export function registerGenreRoutes(
  app: FastifyInstance,
  controller = new GenreController(new GenreService()),
): void {
  app.get<{ Querystring: { channelId?: string } }>('/api/v1/genres/recommendations', async (request) =>
    successResponse(controller.recommendations(request), request.correlationId),
  );
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
