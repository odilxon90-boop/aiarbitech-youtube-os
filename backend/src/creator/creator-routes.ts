import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { dashboardController } from '../dashboard/dashboard-controller.js';
import { getAnalyticsPerformance } from '../analytics/analytics-service.js';
import { PlatformError } from '../shared/errors.js';

interface VideoPlanRequest {
  prompt: string;
}

export function registerCreatorRoutes(app: FastifyInstance): void {
  app.get('/api/v1/creator/stats', async (request) => {
    requirePermission(request, 'dashboard:read');
    return successResponse(await dashboardController.getSummary(), request.correlationId);
  });
  app.get('/api/v1/creator/revenue', async (request) => {
    requirePermission(request, 'dashboard:read');
    const summary = await dashboardController.getSummary();
    return successResponse(summary.revenueSeries, request.correlationId);
  });
  app.get('/api/v1/creator/videos', async (request) => {
    requirePermission(request, 'video:read');
    const performance = await getAnalyticsPerformance();
    return successResponse({ count: performance.topVideos.length, videos: performance.topVideos }, request.correlationId);
  });
  app.post<{ Body: VideoPlanRequest }>('/api/v1/creator/plan', async (request) => {
    requirePermission(request, 'ai:chat');
    const prompt = request.body?.prompt?.trim();
    if (!prompt) {
      throw new PlatformError(400, 'INVALID_REQUEST', 'A video prompt is required.');
    }
    return successResponse({
      prompt,
      status: 'QUEUED',
      plan: {
        hook: `Open with the strongest insight from: ${prompt}`,
        scenes: ['Hook and context', 'Core explanation', 'Practical next steps', 'Call to action'],
        nextAction: 'Review the outline before generating assets.',
      },
      createdAt: new Date().toISOString(),
    }, request.correlationId);
  });
}
