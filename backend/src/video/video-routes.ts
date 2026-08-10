import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { VideoController } from './video-controller.js';
import { VideoService } from './video-service.js';

export function registerVideoRoutes(
  app: FastifyInstance,
  controller = new VideoController(new VideoService()),
): void {
  app.get<{ Querystring: { genre?: string } }>('/api/v1/videos/ideas', async (request) =>
    successResponse(controller.ideas(request), request.correlationId),
  );
}
