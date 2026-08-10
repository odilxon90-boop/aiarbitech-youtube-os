import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { VideoService } from './video-service.js';

export class VideoController {
  constructor(private readonly service: VideoService) {}

  ideas(request: FastifyRequest<{ Querystring: { genre?: string } }>) {
    requirePermission(request, 'videos:read');
    if (request.query.genre !== undefined && request.query.genre.trim() === '') {
      throw new PlatformError(400, 'INVALID_VIDEO_IDEA_QUERY', 'genre must not be blank.');
    }
    return this.service.ideas(request.query.genre);
  }
}
