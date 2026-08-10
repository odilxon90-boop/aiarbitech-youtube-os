import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
<<<<<<< HEAD
import { PlatformError } from '../shared/errors.js';
import { requirePermission } from '../shared/auth.js';
import { goalsController } from './goals-controller.js';
import type { GoalStatus, GoalType, ProgressInput } from './goals-service.js';

const GOALS_READ = 'goals:read';
const GOALS_WRITE = 'goals:write';

/**
 * Creator Goal Center routes. Authenticated and permission-checked.
 * Returns structured JSON via the shared API envelope.
 */
export function registerGoalsRoutes(app: FastifyInstance): void {
  app.get('/api/v1/goals/list', async (request) => {
    requirePermission(request, GOALS_READ);
    return successResponse(await goalsController.listGoals(), request.correlationId);
  });

  app.get('/api/v1/goals/recommendations', async (request) => {
    requirePermission(request, GOALS_READ);
    const goalId = (request.query as { goalId?: string } | undefined)?.goalId;
    return successResponse(await goalsController.getRecommendations(goalId ? { goalId } : undefined), request.correlationId);
  });

  app.post<{ Body: unknown }>('/api/v1/goals/create', async (request) => {
    requirePermission(request, GOALS_WRITE);
    const body = request.body as { type?: string; title?: string; target?: number; deadline?: string } | undefined;
    if (!body || !body.type || !body.title || typeof body.target !== 'number' || !body.deadline) {
      throw new PlatformError(400, 'BAD_REQUEST', 'type, title, target, and deadline are required.');
    }
    const created = await goalsController.createGoal({
      type: body.type as GoalType,
      title: body.title,
      target: body.target,
      deadline: body.deadline,
    });
    return successResponse(created, request.correlationId);
  });

  app.put<{ Params: { goalId: string }; Body: unknown }>('/api/v1/goals/:goalId/progress', async (request) => {
    requirePermission(request, GOALS_WRITE);
    const body = request.body as { current?: number; status?: string } | undefined;
    if (!body || typeof body.current !== 'number') {
      throw new PlatformError(400, 'BAD_REQUEST', 'current (numeric) is required.');
    }
    const progress: ProgressInput = { current: body.current };
    if (body.status) {
      progress.status = body.status as GoalStatus;
    }
    const updated = await goalsController.updateProgress(request.params.goalId, progress);
    if (!updated) {
      throw new PlatformError(404, 'NOT_FOUND', `Goal ${request.params.goalId} not found.`);
    }
    return successResponse(updated, request.correlationId);
  });

  app.delete<{ Params: { goalId: string } }>('/api/v1/goals/:goalId', async (request) => {
    requirePermission(request, GOALS_WRITE);
    const ok = await goalsController.deleteGoal(request.params.goalId);
    if (!ok) {
      throw new PlatformError(404, 'NOT_FOUND', `Goal ${request.params.goalId} not found.`);
    }
    return successResponse({ deleted: true, goalId: request.params.goalId }, request.correlationId);
  });
=======
import { GoalsController } from './goals-controller.js';
import { GoalsService, type CreateGoalInput, type UpdateGoalInput } from './goals-service.js';

type GoalBody = Partial<CreateGoalInput & UpdateGoalInput>;

export function registerGoalsRoutes(
  app: FastifyInstance,
  controller = new GoalsController(new GoalsService()),
): void {
  app.get<{ Querystring: { userId?: string } }>('/api/v1/goals', async (request) =>
    successResponse(controller.list(request), request.correlationId),
  );
  app.get<{ Params: { goalId: string } }>('/api/v1/goals/:goalId', async (request) =>
    successResponse(controller.get(request), request.correlationId),
  );
  app.post<{ Body: GoalBody }>('/api/v1/goals', async (request) =>
    successResponse(controller.create(request), request.correlationId),
  );
  app.patch<{ Params: { goalId: string }; Body: GoalBody }>('/api/v1/goals/:goalId', async (request) =>
    successResponse(controller.update(request), request.correlationId),
  );
  app.put<{ Params: { goalId: string }; Body: GoalBody }>('/api/v1/goals/:goalId', async (request) =>
    successResponse(controller.update(request), request.correlationId),
  );
  app.delete<{ Params: { goalId: string } }>('/api/v1/goals/:goalId', async (request) =>
    successResponse(controller.delete(request), request.correlationId),
  );
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
