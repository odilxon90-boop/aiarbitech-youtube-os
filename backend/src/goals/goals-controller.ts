import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../auth/permission.middleware.js';
import { PlatformError } from '../shared/errors.js';
import type { CreateGoalInput, GoalStatus, GoalsService, UpdateGoalInput } from './goals-service.js';

interface GoalParams {
  goalId: string;
}

interface GoalQuery {
  userId?: string;
}

type GoalBody = Partial<CreateGoalInput>;

const validStatuses: readonly GoalStatus[] = ['ACTIVE', 'PAUSED', 'COMPLETED'];

function authorizeGoals(request: FastifyRequest): void {
  requirePermission(request, 'goals:manage');
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new PlatformError(400, 'INVALID_GOAL_INPUT', `${field} is required.`);
  }
  return value.trim();
}

function nonNegativeNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new PlatformError(400, 'INVALID_GOAL_INPUT', `${field} must be a non-negative number.`);
  }
  return value;
}

function optionalDeadline(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new PlatformError(400, 'INVALID_GOAL_INPUT', 'deadline must be a valid date string.');
  }
  return value;
}

function optionalStatus(value: unknown): GoalStatus {
  if (value === undefined) return 'ACTIVE';
  if (typeof value !== 'string' || !validStatuses.includes(value as GoalStatus)) {
    throw new PlatformError(400, 'INVALID_GOAL_INPUT', 'status must be ACTIVE, PAUSED, or COMPLETED.');
  }
  return value as GoalStatus;
}

export class GoalsController {
  constructor(private readonly service: GoalsService) {}

  list(request: FastifyRequest<{ Querystring: GoalQuery }>) {
    authorizeGoals(request);
    if (request.query.userId !== undefined && request.query.userId.trim() === '') {
      throw new PlatformError(400, 'INVALID_GOAL_INPUT', 'userId must not be blank.');
    }
    return this.service.list(request.query.userId?.trim());
  }

  get(request: FastifyRequest<{ Params: GoalParams }>) {
    authorizeGoals(request);
    return this.service.get(request.params.goalId);
  }

  create(request: FastifyRequest<{ Body: GoalBody }>) {
    authorizeGoals(request);
    const body = request.body;
    const target = nonNegativeNumber(body.target, 'target');
    const current = body.current === undefined ? 0 : nonNegativeNumber(body.current, 'current');
    if (current > target) {
      throw new PlatformError(400, 'INVALID_GOAL_INPUT', 'current cannot exceed target.');
    }
    return this.service.create({
      userId: requiredString(body.userId, 'userId'),
      title: requiredString(body.title, 'title'),
      target,
      current,
      deadline: optionalDeadline(body.deadline),
      status: optionalStatus(body.status),
    });
  }

  update(request: FastifyRequest<{ Params: GoalParams; Body: GoalBody }>) {
    authorizeGoals(request);
    const body = request.body;
    const update: UpdateGoalInput = {};
    if (body.title !== undefined) update.title = requiredString(body.title, 'title');
    if (body.target !== undefined) update.target = nonNegativeNumber(body.target, 'target');
    if (body.current !== undefined) update.current = nonNegativeNumber(body.current, 'current');
    if (body.deadline !== undefined) update.deadline = optionalDeadline(body.deadline);
    if (body.status !== undefined) update.status = optionalStatus(body.status);
    if (Object.keys(update).length === 0) {
      throw new PlatformError(400, 'INVALID_GOAL_INPUT', 'At least one editable goal field is required.');
    }

    const existing = this.service.get(request.params.goalId);
    const target = update.target ?? existing.target;
    const current = update.current ?? existing.current;
    if (current > target) {
      throw new PlatformError(400, 'INVALID_GOAL_INPUT', 'current cannot exceed target.');
    }
    return this.service.update(existing.id, update);
  }

  delete(request: FastifyRequest<{ Params: GoalParams }>) {
    authorizeGoals(request);
    return this.service.delete(request.params.goalId);
  }
}
