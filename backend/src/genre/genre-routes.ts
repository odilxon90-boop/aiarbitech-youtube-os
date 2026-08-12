import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { GenreController } from './genre-controller.js';
import { GenreService } from './genre-service.js';

const genreDetails = [
  {
    id: 'genre-lofi',
    name: 'Lo-Fi Hip Hop',
    description: 'Relaxed beats for study and focus.',
    popularityScore: 92,
    trendDirection: 'RISING',
    styleKeywords: ['chill', 'study', 'focus'],
    trendingArtists: [{ name: 'Lofi Girl', subscribers: '13.1M' }],
    audienceAgeRange: '18-34',
    avgVideoLength: '1h 02m',
  },
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `genre-${index + 2}`,
    name: `Creator Genre ${index + 2}`,
    description: 'A music genre with measurable creator audience demand.',
    popularityScore: 88 - index * 3,
    trendDirection: index % 3 === 2 ? 'STABLE' : 'RISING',
    styleKeywords: ['creator', 'music'],
    trendingArtists: [{ name: `Artist ${index + 2}`, subscribers: `${index + 1}M` }],
    audienceAgeRange: '18-34',
    avgVideoLength: '4m 00s',
  })),
];

const trendPoints = (base: number) =>
  Array.from({ length: 30 }, (_, index) => ({
    date: new Date(Date.UTC(2026, 6, index + 1)).toISOString().slice(0, 10),
    score: Number((base + index * 0.2).toFixed(1)),
  }));

export function registerGenreRoutes(
  app: FastifyInstance,
  controller = new GenreController(new GenreService()),
): void {
  app.get('/api/v1/genre/trends', async (request) =>
    successResponse(controller.trends(request), request.correlationId),
  );
  app.get<{ Querystring: { channelId?: string } }>('/api/v1/genre/recommendations', async (request) =>
    successResponse(controller.recommendations(request), request.correlationId),
  );
  app.get<{ Querystring: { channelId?: string } }>('/api/v1/genres/recommendations', async (request) =>
    successResponse(controller.recommendations(request), request.correlationId),
  );
  app.get('/api/v1/genre/popularity', async (request) =>
    successResponse(controller.popularity(request), request.correlationId),
  );
  app.get<{ Params: { genreId: string } }>('/api/v1/genre/:genreId/details', async (request) =>
    successResponse(controller.details(request), request.correlationId),
  );
}
