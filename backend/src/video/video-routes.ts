import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
<<<<<<< HEAD
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { videoController } from './video-controller.js';

const VIDEO_READ = 'video:read';
const VIDEO_WRITE = 'video:write';

export function registerVideoRoutes(app: FastifyInstance): void {
  app.get('/api/v1/video/ideas', async (request) => {
    requirePermission(request, VIDEO_READ);
    return successResponse(await videoController.getIdeas(), request.correlationId);
  });

  app.get('/api/v1/video/script/:id', async (request) => {
    requirePermission(request, VIDEO_READ);
    const params = request.params as { id: string };
    const script = await videoController.getScript(params.id);
    if (!script) {
      throw new PlatformError(404, 'NOT_FOUND', 'Script not found');
    }
    return successResponse(script, request.correlationId);
  });

  app.post('/api/v1/video/generate', async (request) => {
    requirePermission(request, VIDEO_WRITE);
    const body = request.body as { topic?: string; style?: string; length?: string };
    const topic = body.topic ?? '';
    const style = body.style ?? '';
    const length = body.length ?? '';
    return successResponse(await videoController.generate({ topic, style, length }), request.correlationId);
  });

  app.get('/api/v1/video/projects', async (request) => {
    requirePermission(request, VIDEO_READ);
    return successResponse(await videoController.getProjects(), request.correlationId);
  });

  app.get('/api/v1/video/projects/:id', async (request) => {
    requirePermission(request, VIDEO_READ);
    const params = request.params as { id: string };
    const project = await videoController.getProject(params.id);
    if (!project) {
      throw new PlatformError(404, 'NOT_FOUND', 'Project not found');
    }
    return successResponse(project, request.correlationId);
  });
=======
import { VideoController } from './video-controller.js';
import { VideoService } from './video-service.js';

export function registerVideoRoutes(
  app: FastifyInstance,
  controller = new VideoController(new VideoService()),
): void {
  app.get<{ Querystring: { genre?: string } }>('/api/v1/videos/ideas', async (request) =>
    successResponse(controller.ideas(request), request.correlationId),
  );
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
