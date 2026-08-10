import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { GenreService } from './genre-service.js';

export class GenreController {
  constructor(private readonly service: GenreService) {}

  recommendations(request: FastifyRequest<{ Querystring: { channelId?: string } }>) {
    requirePermission(request, 'genres:read');
    if (typeof request.query.channelId !== 'string' || request.query.channelId.trim() === '') {
      throw new PlatformError(400, 'INVALID_GENRE_QUERY', 'channelId is required.');
    }
    return this.service.recommendationsFor(request.query.channelId.trim());
  }
}
