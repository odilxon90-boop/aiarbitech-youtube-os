import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { OnboardingController } from './onboarding-controller.js';
import { OnboardingService } from './onboarding-service.js';
export function registerOnboardingRoutes(app: FastifyInstance, controller = new OnboardingController(new OnboardingService())): void {
  app.get('/api/v1/onboarding/steps', async (request) => successResponse(controller.steps(request), request.correlationId));
  app.post<{ Params: { stepId: string }; Body: { userId: string; data: Record<string, unknown> } }>('/api/v1/onboarding/step/:stepId', async (request) => successResponse(controller.submitStep(request), request.correlationId));
  app.get<{ Querystring: { userId: string } }>('/api/v1/onboarding/status', async (request) => successResponse(controller.status(request), request.correlationId));
  app.post<{ Body: { userId: string } }>('/api/v1/onboarding/complete', async (request) => successResponse(controller.complete(request), request.correlationId));
}
