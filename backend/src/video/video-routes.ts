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
  app.get<{ Querystring: { genre?: string } }>('/api/v1/video/ideas', async (request) =>
    successResponse(controller.ideas(request), request.correlationId),
  );
  app.get<{ Querystring: { genre?: string } }>('/api/v1/videos/ideas', async (request) =>
    successResponse(
      request.query.genre ? controller.ideas(request).ideas.slice(0, 1) : controller.ideas(request).ideas,
      request.correlationId,
    ),
  );
  app.get<{ Params: { scriptId: string } }>('/api/v1/video/script/:scriptId', async (request) =>
    successResponse(controller.script(request), request.correlationId),
  );
  app.post<{ Body: { topic?: string; style?: string; length?: string } }>('/api/v1/video/generate', async (request) =>
    successResponse(controller.generate(request), request.correlationId),
  );
  app.get('/api/v1/video/projects', async (request) =>
    successResponse(controller.projects(request), request.correlationId),
  );
  app.get<{ Params: { projectId: string } }>('/api/v1/video/projects/:projectId', async (request) =>
    successResponse(controller.project(request), request.correlationId),
  );
}
