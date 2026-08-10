<<<<<<< HEAD
import type {
  IdeasResponse,
  VideoScript,
  GenerateResponse,
  GenerateRequest,
  ProjectsResponse,
  VideoProject,
} from './video-service.js';
import {
  getVideoIdeas,
  getScript,
  generateVideo,
  getProjects,
  getProject,
} from './video-service.js';

export interface VideoController {
  getIdeas(): Promise<IdeasResponse>;
  getScript(id: string): Promise<VideoScript | null>;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  getProjects(): Promise<ProjectsResponse>;
  getProject(id: string): Promise<VideoProject | null>;
}

export const videoController: VideoController = {
  getIdeas: () => getVideoIdeas(),
  getScript: (id) => getScript(id),
  generate: (request) => generateVideo(request),
  getProjects: () => getProjects(),
  getProject: (id) => getProject(id),
};
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
