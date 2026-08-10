import { randomUUID } from 'node:crypto';
import { PlatformError } from '../shared/errors.js';

export type GoalStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface Goal {
  id: string;
  userId: string;
  title: string;
  target: number;
  current: number;
  deadline: string | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  userId: string;
  title: string;
  target: number;
  current: number;
  deadline: string | null;
  status: GoalStatus;
}

export interface UpdateGoalInput {
  title?: string;
  target?: number;
  current?: number;
  deadline?: string | null;
  status?: GoalStatus;
}

export class GoalsService {
  private readonly goals: Goal[] = [];

  list(userId?: string): readonly Goal[] {
    return userId ? this.goals.filter((goal) => goal.userId === userId) : this.goals;
  }

  get(id: string): Goal {
    return this.find(id);
  }

  create(input: CreateGoalInput): Goal {
    const now = new Date().toISOString();
    const goal: Goal = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
    this.goals.unshift(goal);
    return goal;
  }

  update(id: string, input: UpdateGoalInput): Goal {
    const goal = this.find(id);
    Object.assign(goal, input, { updatedAt: new Date().toISOString() });
    return goal;
  }

  delete(id: string): { id: string; deleted: true } {
    const index = this.goals.findIndex((goal) => goal.id === id);
    if (index < 0) throw new PlatformError(404, 'GOAL_NOT_FOUND', `Goal ${id} was not found.`);
    this.goals.splice(index, 1);
    return { id, deleted: true };
  }

  private find(id: string): Goal {
    const goal = this.goals.find((item) => item.id === id);
    if (!goal) throw new PlatformError(404, 'GOAL_NOT_FOUND', `Goal ${id} was not found.`);
    return goal;
  }
}
