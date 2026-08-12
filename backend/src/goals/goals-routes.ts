import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { bearerToken, requirePermission as requireLegacyPermission, resolvePrincipal } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { GoalsController } from './goals-controller.js';
import {
  GoalsService,
  deleteGoalCenterGoal,
  type CreateGoalInput,
  type UpdateGoalInput,
} from './goals-service.js';

type GoalBody = Partial<CreateGoalInput & UpdateGoalInput>;

export function registerGoalsRoutes(
  app: FastifyInstance,
  controller = new GoalsController(new GoalsService()),
): void {
  app.get('/api/v1/goals/list', async (request) =>
    successResponse(controller.list(request), request.correlationId),
  );
  app.get<{ Querystring: { userId?: string } }>('/api/v1/goals', async (request) =>
    successResponse(controller.list(request), request.correlationId),
  );
  app.get('/api/v1/goals/recommendations', async (request) =>
    successResponse(controller.recommendations(request), request.correlationId),
  );
  app.get<{ Params: { goalId: string } }>('/api/v1/goals/:goalId', async (request) =>
    successResponse(controller.get(request), request.correlationId),
  );
  app.post<{ Body: GoalBody }>('/api/v1/goals/create', async (request) =>
    successResponse(controller.create(request), request.correlationId),
  );
  app.post<{ Body: GoalBody }>('/api/v1/goals', async (request) =>
    successResponse(controller.create(request), request.correlationId),
  );
  app.put<{ Params: { goalId: string }; Body: GoalBody }>('/api/v1/goals/:goalId/progress', async (request) =>
    successResponse(controller.update(request), request.correlationId),
  );
  app.patch<{ Params: { goalId: string }; Body: GoalBody }>('/api/v1/goals/:goalId', async (request) =>
    successResponse(controller.update(request), request.correlationId),
  );
  app.put<{ Params: { goalId: string }; Body: GoalBody }>('/api/v1/goals/:goalId', async (request) =>
    successResponse(controller.update(request), request.correlationId),
  );
  app.delete<{ Params: { goalId: string } }>('/api/v1/goals/:goalId', async (request) => {
    if (resolvePrincipal(bearerToken(request))) {
      requireLegacyPermission(request, 'goals:write');
      if (!deleteGoalCenterGoal(request.params.goalId)) {
        throw new PlatformError(404, 'NOT_FOUND', `Goal ${request.params.goalId} not found.`);
      }
      return successResponse({ deleted: true, goalId: request.params.goalId }, request.correlationId);
    }
    return successResponse(controller.delete(request), request.correlationId);
  });
}
