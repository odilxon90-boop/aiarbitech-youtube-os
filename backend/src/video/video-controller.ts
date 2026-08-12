import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import type { VideoService } from './video-service.js';

export class VideoController {
  constructor(private readonly service: VideoService) {}

  ideas(request: FastifyRequest<{ Querystring: { genre?: string } }>) {
    requirePermission(request, 'video:read');
    if (request.query.genre !== undefined && request.query.genre.trim() === '') {
      throw new PlatformError(400, 'INVALID_VIDEO_IDEA_QUERY', 'genre must not be blank.');
    }
    return { ideas: this.service.ideas(request.query.genre) };
  }

  script(request: FastifyRequest<{ Params: { scriptId: string } }>) {
    requirePermission(request, 'video:read');
    const script = this.service.getScript(request.params.scriptId);
    if (!script) {
      throw new PlatformError(404, 'NOT_FOUND', `Script ${request.params.scriptId} was not found.`);
    }
    return script;
  }

  generate(request: FastifyRequest<{ Body: { topic?: string; style?: string; length?: string } }>) {
    requirePermission(request, 'video:write');
    const topic = request.body?.topic?.trim();
    const style = request.body?.style?.trim();
    const length = request.body?.length?.trim();
    if (!topic || !style || !length) {
      throw new PlatformError(400, 'BAD_REQUEST', 'topic, style, and length are required.');
    }
    return { script: this.service.generateScript(topic, style, length) };
  }

  projects(request: FastifyRequest) {
    requirePermission(request, 'video:read');
    return { projects: this.service.listProjects() };
  }

  project(request: FastifyRequest<{ Params: { projectId: string } }>) {
    requirePermission(request, 'video:read');
    const project = this.service.getProject(request.params.projectId);
    if (!project) {
      throw new PlatformError(404, 'NOT_FOUND', `Project ${request.params.projectId} was not found.`);
    }
    return project;
  }
}
