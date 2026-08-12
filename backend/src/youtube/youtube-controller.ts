import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { YouTubeService } from './youtube-service.js';

interface ChannelParams { channelId: string; }
interface UploadBody {
  channelId: string;
  title: string;
  description: string;
  mimeType: string;
  contentBase64: string;
  privacyStatus?: 'public' | 'unlisted' | 'private';
  tags?: string[];
}

function authorizeRead(request: FastifyRequest): void {
  requirePermission(request, 'videos:read');
}

function authorizeWrite(request: FastifyRequest): void {
  requirePermission(request, 'videos:create');
}

export class YouTubeController {
  constructor(private readonly service: YouTubeService) {}

  status() {
    return this.service.status();
  }

  channelMetadata(request: FastifyRequest<{ Params: ChannelParams }>) {
    authorizeRead(request);
    return this.service.getChannelMetadata(request.params.channelId);
  }

  videos(request: FastifyRequest<{ Params: ChannelParams; Querystring: { maxResults?: string } }>) {
    authorizeRead(request);
    const maxResults = request.query.maxResults ? Number(request.query.maxResults) : 10;
    if (!Number.isInteger(maxResults) || maxResults < 1 || maxResults > 50) {
      throw new PlatformError(400, 'INVALID_VIDEO_QUERY', 'maxResults must be between 1 and 50.');
    }
    return this.service.listVideos(request.params.channelId, maxResults);
  }

  async upload(request: FastifyRequest<{ Body: UploadBody }>) {
    authorizeWrite(request);
    const { channelId, title, description, mimeType, contentBase64, privacyStatus, tags } = request.body;
    if (!channelId || !title || !description || !mimeType || !contentBase64) {
      throw new PlatformError(400, 'INVALID_UPLOAD_REQUEST', 'channelId, title, description, mimeType, and contentBase64 are required.');
    }
    return this.service.uploadVideo({
      channelId,
      title,
      description,
      mimeType,
      content: Buffer.from(contentBase64, 'base64'),
      ...(privacyStatus ? { privacyStatus } : {}),
      ...(tags ? { tags } : {}),
    });
  }
}
