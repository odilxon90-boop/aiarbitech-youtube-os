import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { QualityService } from './quality-service.js';

interface VideoParams {
  videoId: string;
}

function authorizeQualityRead(request: FastifyRequest): void {
  requirePermission(request, 'quality:read');
}

export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  score(request: FastifyRequest<{ Params: VideoParams }>) {
    authorizeQualityRead(request);
    return this.qualityService.getScore(request.params.videoId);
  }

  retention(request: FastifyRequest<{ Params: VideoParams }>) {
    authorizeQualityRead(request);
    return this.qualityService.getRetention(request.params.videoId);
  }

  readiness(request: FastifyRequest<{ Params: VideoParams }>) {
    authorizeQualityRead(request);
    return this.qualityService.getReadiness(request.params.videoId);
  }

  checklist(request: FastifyRequest<{ Params: VideoParams }>) {
    authorizeQualityRead(request);
    return this.qualityService.getChecklist(request.params.videoId);
  }
}
