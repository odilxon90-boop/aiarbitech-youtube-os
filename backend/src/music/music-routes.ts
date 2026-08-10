import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { MusicController } from './music-controller.js';
import { MusicService } from './music-service.js';

export function registerMusicRoutes(
  app: FastifyInstance,
  controller = new MusicController(new MusicService()),
): void {
  app.get<{ Querystring: { genre?: string } }>('/api/v1/music', async (request) =>
    successResponse(controller.browse(request), request.correlationId),
  );
  app.get<{ Querystring: { q?: string } }>('/api/v1/music/search', async (request) =>
    successResponse(controller.search(request), request.correlationId),
  );
  app.post<{ Params: { trackId: string }; Body: { commercialUse?: boolean } }>('/api/v1/music/:trackId/license', async (request) =>
    successResponse(controller.license(request), request.correlationId),
  );
}
