import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { OnboardingService } from './onboarding-service.js';
function authorizeOnboarding(request: FastifyRequest): void {
  requirePermission(request, 'onboarding:access');
}
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}
  steps(request: FastifyRequest) { authorizeOnboarding(request); return this.service.steps(); }
  submitStep(request: FastifyRequest<{ Params: { stepId: string }; Body: { userId: string; data: Record<string, unknown> } }>) { authorizeOnboarding(request); return this.service.submitStep(request.body.userId, request.params.stepId, request.body.data); }
  status(request: FastifyRequest<{ Querystring: { userId: string } }>) { authorizeOnboarding(request); return this.service.status(request.query.userId); }
  complete(request: FastifyRequest<{ Body: { userId: string } }>) {
    authorizeOnboarding(request);
    const status = this.service.status(request.body.userId);
    if (!status.complete) throw new PlatformError(400, 'ONBOARDING_INCOMPLETE', 'All nine onboarding steps must be completed.');
    return this.service.complete(request.body.userId);
  }
}
