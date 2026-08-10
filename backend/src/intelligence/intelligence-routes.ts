import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { requirePermission } from '../shared/auth.js';
import { intelligenceController } from './intelligence-controller.js';

const INTELLIGENCE_READ = 'intelligence:read';

export function registerIntelligenceRoutes(app: FastifyInstance): void {
  app.get('/api/v1/intelligence/profile', async (request) => {
    requirePermission(request, INTELLIGENCE_READ);
    return successResponse(await intelligenceController.getProfile(), request.correlationId);
  });

  app.get('/api/v1/intelligence/skills', async (request) => {
    requirePermission(request, INTELLIGENCE_READ);
    return successResponse(await intelligenceController.getSkills(), request.correlationId);
  });

  app.get('/api/v1/intelligence/strengths', async (request) => {
    requirePermission(request, INTELLIGENCE_READ);
    return successResponse(await intelligenceController.getStrengths(), request.correlationId);
  });

  app.get('/api/v1/intelligence/weaknesses', async (request) => {
    requirePermission(request, INTELLIGENCE_READ);
    return successResponse(await intelligenceController.getWeaknesses(), request.correlationId);
  });

  app.get('/api/v1/intelligence/recommendations', async (request) => {
    requirePermission(request, INTELLIGENCE_READ);
    return successResponse(await intelligenceController.getRecommendations(), request.correlationId);
  });
}
