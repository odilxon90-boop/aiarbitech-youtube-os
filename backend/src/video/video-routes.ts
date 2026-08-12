import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { VideoController } from './video-controller.js';
import { VideoService } from './video-service.js';

const videoIdeas = Array.from({ length: 11 }, (_, index) => ({
  id: `idea-${index + 1}`,
  title: index === 0 ? 'Top 10 AI Tools for Creators' : `Creator video idea ${index + 1}`,
  description: 'A data-backed video concept for creator growth.',
  confidence: Number((0.92 - index * 0.01).toFixed(2)),
  trend: index % 2 === 0 ? 'AI Tools' : 'Creator Growth',
}));

const scripts = new Map([
  ['script-1', {
    id: 'script-1',
    topic: 'Top 10 AI Tools for Creators',
    style: 'Listicle',
    length: '8-10 min',
    outline: ['Intro hook', 'Main content', 'Examples', 'Conclusion'],
  }],
]);

const projects = Array.from({ length: 5 }, (_, index) => ({
  id: `proj-${index + 1}`,
  title: `Creator project ${index + 1}`,
  status: index === 0 ? 'PUBLISHED' : 'DRAFT',
  createdAt: `2026-07-${String(index + 1).padStart(2, '0')}`,
  updatedAt: `2026-07-${String(index + 6).padStart(2, '0')}`,
}));

export function registerVideoRoutes(
  app: FastifyInstance,
  controller = new VideoController(new VideoService()),
): void {
  app.get<{ Querystring: { genre?: string } }>('/api/v1/videos/ideas', async (request) =>
    successResponse(controller.ideas(request), request.correlationId),
  );

  app.get('/api/v1/video/ideas', async (request) => {
    requirePermission(request, 'video:read');
    return successResponse({ ideas: videoIdeas }, request.correlationId);
  });

  app.get<{ Params: { id: string } }>('/api/v1/video/script/:id', async (request) => {
    requirePermission(request, 'video:read');
    const script = scripts.get(request.params.id);
    if (!script) throw new PlatformError(404, 'NOT_FOUND', 'Script not found.');
    return successResponse(script, request.correlationId);
  });

  app.post<{ Body: { topic?: string; style?: string; length?: string } }>('/api/v1/video/generate', async (request) => {
    requirePermission(request, 'video:write');
    const script = {
      id: `script-${Date.now()}`,
      topic: request.body?.topic ?? '',
      style: request.body?.style ?? '',
      length: request.body?.length ?? '',
      outline: ['Intro hook', 'Main content', 'Examples', 'Conclusion'],
    };
    scripts.set(script.id, script);
    return successResponse({ script }, request.correlationId);
  });

  app.get('/api/v1/video/projects', async (request) => {
    requirePermission(request, 'video:read');
    return successResponse({ projects }, request.correlationId);
  });

  app.get<{ Params: { id: string } }>('/api/v1/video/projects/:id', async (request) => {
    requirePermission(request, 'video:read');
    const project = projects.find((candidate) => candidate.id === request.params.id);
    if (!project) throw new PlatformError(404, 'NOT_FOUND', 'Project not found.');
    return successResponse(project, request.correlationId);
  });
}
