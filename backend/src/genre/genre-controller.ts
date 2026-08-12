import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import type { GenreService } from './genre-service.js';

export class GenreController {
  constructor(private readonly service: GenreService) {}

  trends(request: FastifyRequest) {
    requirePermission(request, 'genre:read');
    return this.service.getTrends();
  }

  recommendations(request: FastifyRequest<{ Querystring: { channelId?: string } }>) {
    requirePermission(request, 'genre:read');
    if (typeof request.query.channelId === 'string' && request.query.channelId.trim() !== '') {
      return this.service.getLegacyRecommendations(request.query.channelId.trim());
    }
    return this.service.getRecommendations();
  }

  popularity(request: FastifyRequest) {
    requirePermission(request, 'genre:read');
    return this.service.getPopularity();
  }

  details(request: FastifyRequest<{ Params: { genreId: string } }>) {
    requirePermission(request, 'genre:read');
    const genre = this.service.getDetails(request.params.genreId);
    if (!genre) {
      throw new PlatformError(404, 'NOT_FOUND', `Genre ${request.params.genreId} was not found.`);
    }
    return { genre };
  }
}
