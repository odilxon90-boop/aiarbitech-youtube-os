import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { YouTubeController } from './youtube-controller.js';
import { YouTubeService } from './youtube-service.js';

export function registerYouTubeRoutes(app: FastifyInstance, controller = new YouTubeController(new YouTubeService())): void {
  app.get('/api/v1/youtube/status', async (request) =>
    successResponse(controller.status(), request.correlationId),
  );
  app.get<{ Params: { channelId: string } }>('/api/v1/youtube/channels/:channelId', async (request) =>
    successResponse(await controller.channelMetadata(request), request.correlationId),
  );
  app.get<{ Params: { channelId: string }; Querystring: { maxResults?: string } }>('/api/v1/youtube/channels/:channelId/videos', async (request) =>
    successResponse(await controller.videos(request), request.correlationId),
  );
  app.post<{ Body: { channelId: string; title: string; description: string; mimeType: string; contentBase64: string; privacyStatus?: 'public' | 'unlisted' | 'private'; tags?: string[] } }>('/api/v1/youtube/upload', async (request) =>
    successResponse(await controller.upload(request), request.correlationId),
  );
}
