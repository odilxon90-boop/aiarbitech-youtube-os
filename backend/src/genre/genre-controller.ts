<<<<<<< HEAD
import type {
  GenreTrendsResponse,
  GenreRecommendationsResponse,
  GenrePopularityResponse,
  GenreDetailsResponse,
} from './genre-service.js';
import {
  getGenreTrends,
  getGenreRecommendations,
  getGenrePopularity,
  getGenreById,
} from './genre-service.js';

export interface GenreController {
  getTrends(): Promise<GenreTrendsResponse>;
  getRecommendations(): Promise<GenreRecommendationsResponse>;
  getPopularity(): Promise<GenrePopularityResponse>;
  getGenreDetails(id: string): Promise<GenreDetailsResponse | null>;
}

export const genreController: GenreController = {
  getTrends: () => getGenreTrends(),
  getRecommendations: () => getGenreRecommendations(),
  getPopularity: () => getGenrePopularity(),
  getGenreDetails: (id) => getGenreById(id),
};
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
