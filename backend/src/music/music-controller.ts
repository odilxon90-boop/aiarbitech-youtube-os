import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { MusicService } from './music-service.js';

export class MusicController {
  constructor(private readonly service: MusicService) {}

  browse(request: FastifyRequest<{ Querystring: { genre?: string } }>) {
    requirePermission(request, 'music:read');
    if (request.query.genre !== undefined && request.query.genre.trim() === '') {
      throw new PlatformError(400, 'INVALID_MUSIC_QUERY', 'genre must not be blank.');
    }
    return this.service.browse(request.query.genre);
  }

  search(request: FastifyRequest<{ Querystring: { q?: string } }>) {
    requirePermission(request, 'music:read');
    if (typeof request.query.q !== 'string' || request.query.q.trim() === '') {
      throw new PlatformError(400, 'INVALID_MUSIC_QUERY', 'q is required.');
    }
    return this.service.search(request.query.q);
  }

  license(request: FastifyRequest<{ Params: { trackId: string }; Body: { commercialUse?: boolean } }>) {
    requirePermission(request, 'music:license');
    if (request.body.commercialUse !== undefined && typeof request.body.commercialUse !== 'boolean') {
      throw new PlatformError(400, 'INVALID_MUSIC_LICENSE_INPUT', 'commercialUse must be a boolean.');
    }
    return this.service.authorizeUse(request.params.trackId, request.body.commercialUse ?? true);
  }
}
