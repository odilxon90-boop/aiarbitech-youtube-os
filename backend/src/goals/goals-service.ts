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

export type GoalCenterType = 'subscribers' | 'revenue' | 'video_count' | 'watch_time';
export type GoalCenterStatus = 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'ACHIEVED' | 'PAUSED';

export interface GoalCenterGoal {
  id: string;
  type: GoalCenterType;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: GoalCenterStatus;
  createdAt: string;
  updatedAt: string;
}

const seededGoalCenterGoals: GoalCenterGoal[] = [
  ['goal-1', 'subscribers', 'Reach 1,000 subscribers', 1000, 684, 'ON_TRACK'],
  ['goal-2', 'revenue', 'Earn $1,000/month', 1000, 512, 'AT_RISK'],
  ['goal-3', 'video_count', 'Publish 30 videos', 30, 18, 'BEHIND'],
  ['goal-4', 'watch_time', 'Hit 4,000 watch hours', 4000, 3200, 'ON_TRACK'],
].map(([id, type, title, target, current, status], index) => ({
  id: id as string,
  type: type as GoalCenterType,
  title: title as string,
  target: target as number,
  current: current as number,
  deadline: `2026-12-${String(index + 1).padStart(2, '0')}`,
  status: status as GoalCenterStatus,
  createdAt: `2026-07-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
  updatedAt: `2026-08-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
}));

let goalCenterStore: GoalCenterGoal[] = [];

export function resetGoalsStore(): void {
  goalCenterStore = seededGoalCenterGoals.map((goal) => ({ ...goal }));
}

resetGoalsStore();

export function listGoalCenterGoals(): GoalCenterGoal[] {
  return goalCenterStore.map((goal) => ({ ...goal }));
}

export function createGoalCenterGoal(input: {
  type: GoalCenterType;
  title: string;
  target: number;
  deadline: string;
}): GoalCenterGoal {
  const now = new Date().toISOString();
  const goal: GoalCenterGoal = {
    id: `goal-${goalCenterStore.length + 1}`,
    ...input,
    current: 0,
    status: 'BEHIND',
    createdAt: now,
    updatedAt: now,
  };
  goalCenterStore.push(goal);
  return { ...goal };
}

export function updateGoalCenterProgress(
  goalId: string,
  current: number,
  status?: GoalCenterStatus,
): GoalCenterGoal | undefined {
  const goal = goalCenterStore.find((candidate) => candidate.id === goalId);
  if (!goal) return undefined;
  goal.current = current;
  goal.status = current >= goal.target ? 'ACHIEVED' : status ?? goal.status;
  goal.updatedAt = new Date().toISOString();
  return { ...goal };
}

export function deleteGoalCenterGoal(goalId: string): boolean {
  const index = goalCenterStore.findIndex((goal) => goal.id === goalId);
  if (index < 0) return false;
  goalCenterStore.splice(index, 1);
  return true;
}

export function getGoalCenterRecommendations() {
  const categories = ['STEPS', 'CONTENT_STRATEGY', 'PUBLISHING_FREQUENCY', 'SEO'] as const;
  return {
    goals: listGoalCenterGoals(),
    recommendations: goalCenterStore.flatMap((goal) =>
      categories.map((category, index) => ({
        id: `${goal.id}-${index + 1}`,
        goalId: goal.id,
        category,
        title: `${category.replaceAll('_', ' ')} recommendation`,
        suggestion: `Recommended next action for ${goal.title}.`,
      }))),
  };
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
