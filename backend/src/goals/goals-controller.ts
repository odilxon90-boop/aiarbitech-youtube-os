import type { FastifyRequest } from 'fastify';
import { requirePermission } from '../shared/auth.js';
import { PlatformError } from '../shared/errors.js';
import type { CreateGoalInput, GoalStatus, GoalsService, UpdateGoalInput } from './goals-service.js';

interface GoalParams {
  goalId: string;
}

interface GoalQuery {
  userId?: string;
}

type GoalBody = Partial<CreateGoalInput> & { type?: string };

const validStatuses: readonly GoalStatus[] = ['ON_TRACK', 'AT_RISK', 'BEHIND', 'ACHIEVED', 'PAUSED', 'ACTIVE'];

function authorizeGoalsRead(request: FastifyRequest): void {
  requirePermission(request, 'goals:read');
}

function authorizeGoalsWrite(request: FastifyRequest): void {
  requirePermission(request, 'goals:write');
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new PlatformError(400, 'BAD_REQUEST', `${field} is required.`);
  }
  return value.trim();
}

function nonNegativeNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new PlatformError(400, 'BAD_REQUEST', `${field} must be a non-negative number.`);
  }
  return value;
}

function optionalDeadline(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new PlatformError(400, 'BAD_REQUEST', 'deadline must be a valid date string.');
  }
  return value;
}

function optionalStatus(value: unknown): GoalStatus {
  if (value === undefined) return 'ON_TRACK';
  if (typeof value !== 'string' || !validStatuses.includes(value as GoalStatus)) {
    throw new PlatformError(400, 'BAD_REQUEST', 'status is invalid.');
  }
  return value as GoalStatus;
}

export class GoalsController {
  constructor(private readonly service: GoalsService) {}

  list(request: FastifyRequest<{ Querystring: GoalQuery }>) {
    authorizeGoalsRead(request);
    if (request.query.userId !== undefined && request.query.userId.trim() === '') {
      throw new PlatformError(400, 'BAD_REQUEST', 'userId must not be blank.');
    }
    return this.service.list(request.query.userId?.trim());
  }

  get(request: FastifyRequest<{ Params: GoalParams }>) {
    authorizeGoalsRead(request);
    return this.service.get(request.params.goalId);
  }

  create(request: FastifyRequest<{ Body: GoalBody }>) {
    authorizeGoalsWrite(request);
    const body = request.body;
    const target = nonNegativeNumber(body.target, 'target');
    const current = body.current === undefined ? 0 : nonNegativeNumber(body.current, 'current');
    return this.service.create({
      userId: typeof body.userId === 'string' && body.userId.trim() ? body.userId.trim() : 'creator-1',
      type: typeof body.type === 'string' && body.type.trim() ? body.type.trim() : 'general',
      title: requiredString(body.title, 'title'),
      target,
      current,
      deadline: optionalDeadline(body.deadline),
      status: current >= target ? 'ACHIEVED' : optionalStatus(body.status),
    });
  }

  update(request: FastifyRequest<{ Params: GoalParams; Body: GoalBody }>) {
    authorizeGoalsWrite(request);
    const body = request.body;
    const update: UpdateGoalInput = {};
    if (body.title !== undefined) update.title = requiredString(body.title, 'title');
    if (body.target !== undefined) update.target = nonNegativeNumber(body.target, 'target');
    if (body.current !== undefined) update.current = nonNegativeNumber(body.current, 'current');
    if (body.deadline !== undefined) update.deadline = optionalDeadline(body.deadline);
    if (body.status !== undefined) update.status = optionalStatus(body.status);
    if (Object.keys(update).length === 0) {
      throw new PlatformError(400, 'BAD_REQUEST', 'At least one editable goal field is required.');
    }

    const existing = this.service.get(request.params.goalId);
    const target = update.target ?? existing.target;
    const current = update.current ?? existing.current;
    if (current >= target) {
      update.status = 'ACHIEVED';
    } else if (update.current !== undefined && update.status === undefined) {
      update.status = 'ACTIVE';
    }
    return this.service.update(existing.id, update);
  }

  delete(request: FastifyRequest<{ Params: GoalParams }>) {
    authorizeGoalsWrite(request);
    return this.service.delete(request.params.goalId);
  }

  recommendations(request: FastifyRequest) {
    authorizeGoalsRead(request);
    return this.service.recommendations();
  }
}
