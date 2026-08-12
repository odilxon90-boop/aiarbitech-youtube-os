import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
import { bearerToken, requirePermission as requireLegacyPermission, resolvePrincipal } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import { GoalsController } from './goals-controller.js';
import {
  GoalsService,
  createGoalCenterGoal,
  deleteGoalCenterGoal,
  getGoalCenterRecommendations,
  listGoalCenterGoals,
  updateGoalCenterProgress,
  type CreateGoalInput,
  type GoalCenterStatus,
  type GoalCenterType,
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

  app.get('/api/v1/goals/list', async (request) => {
    requireLegacyPermission(request, 'goals:read');
    return successResponse(listGoalCenterGoals(), request.correlationId);
  });

  app.get('/api/v1/goals/recommendations', async (request) => {
    requireLegacyPermission(request, 'goals:read');
    return successResponse(getGoalCenterRecommendations(), request.correlationId);
  });

  app.post<{
    Body: { type?: string; title?: string; target?: number; deadline?: string };
  }>('/api/v1/goals/create', async (request) => {
    requireLegacyPermission(request, 'goals:write');
    const body = request.body;
    if (!body?.type || !body.title || typeof body.target !== 'number' || !body.deadline) {
      throw new PlatformError(400, 'BAD_REQUEST', 'type, title, target, and deadline are required.');
    }
    return successResponse(createGoalCenterGoal({
      type: body.type as GoalCenterType,
      title: body.title,
      target: body.target,
      deadline: body.deadline,
    }), request.correlationId);
  });

  app.put<{
    Params: { goalId: string };
    Body: { current?: number; status?: string };
  }>('/api/v1/goals/:goalId/progress', async (request) => {
    requireLegacyPermission(request, 'goals:write');
    if (typeof request.body?.current !== 'number') {
      throw new PlatformError(400, 'BAD_REQUEST', 'current (numeric) is required.');
    }
    const goal = updateGoalCenterProgress(
      request.params.goalId,
      request.body.current,
      request.body.status as GoalCenterStatus | undefined,
    );
    if (!goal) throw new PlatformError(404, 'NOT_FOUND', `Goal ${request.params.goalId} not found.`);
    return successResponse(goal, request.correlationId);
  });
}
