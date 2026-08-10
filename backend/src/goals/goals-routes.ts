import type { FastifyInstance } from 'fastify';
import { successResponse } from '../contracts/api.js';
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
}
