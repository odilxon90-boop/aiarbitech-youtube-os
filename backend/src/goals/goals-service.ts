import { randomUUID } from 'node:crypto';
import { PlatformError } from '../shared/errors.js';

export type GoalStatus = 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'ACHIEVED' | 'PAUSED' | 'ACTIVE';

export interface Goal {
  id: string;
  userId: string;
  type: string;
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
  type: string;
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

const seedGoals = (): Goal[] => {
  const createdAt = '2026-08-01T09:00:00.000Z';
  return [
    { id: 'goal-1', userId: 'creator-1', type: 'views', title: 'Reach 100,000 monthly views', target: 100000, current: 64250, deadline: '2026-12-31', status: 'ON_TRACK', createdAt, updatedAt: createdAt },
    { id: 'goal-2', userId: 'creator-1', type: 'subscribers', title: 'Grow to 10,000 subscribers', target: 10000, current: 7200, deadline: '2026-11-30', status: 'AT_RISK', createdAt, updatedAt: createdAt },
    { id: 'goal-3', userId: 'creator-1', type: 'revenue', title: 'Hit $5,000 monthly revenue', target: 5000, current: 2100, deadline: '2026-10-31', status: 'BEHIND', createdAt, updatedAt: createdAt },
    { id: 'goal-4', userId: 'creator-1', type: 'consistency', title: 'Publish 8 videos this month', target: 8, current: 8, deadline: '2026-08-31', status: 'ACHIEVED', createdAt, updatedAt: createdAt },
  ];
};

let goalsStore: Goal[] = seedGoals();

export function resetGoalsStore(): void {
  goalsStore = seedGoals();
}

interface GoalRecommendation {
  id: string;
  category: 'STEPS' | 'CONTENT_STRATEGY' | 'PUBLISHING_FREQUENCY' | 'SEO';
  title: string;
  detail: string;
}

export class GoalsService {
  list(userId?: string): readonly Goal[] {
    return userId ? goalsStore.filter((goal) => goal.userId === userId) : goalsStore;
  }

  get(id: string): Goal {
    return this.find(id);
  }

  create(input: CreateGoalInput): Goal {
    const now = new Date().toISOString();
    const goal: Goal = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
    goalsStore.unshift(goal);
    return goal;
  }

  update(id: string, input: UpdateGoalInput): Goal {
    const goal = this.find(id);
    Object.assign(goal, input, { updatedAt: new Date().toISOString() });
    return goal;
  }

  delete(id: string): { id: string; deleted: true } {
    const index = goalsStore.findIndex((goal) => goal.id === id);
    if (index < 0) throw new PlatformError(404, 'NOT_FOUND', `Goal ${id} was not found.`);
    goalsStore.splice(index, 1);
    return { id, deleted: true };
  }

  recommendations(): { goals: readonly Goal[]; recommendations: readonly GoalRecommendation[] } {
    return {
      goals: goalsStore.slice(0, 4),
      recommendations: [
        { id: 'gr-1', category: 'STEPS', title: 'Break subscriber goal into weekly targets', detail: 'Aim for 175 subscribers per week.' },
        { id: 'gr-2', category: 'STEPS', title: 'Review lagging KPI every Friday', detail: 'Track progress and adjust content mix.' },
        { id: 'gr-3', category: 'STEPS', title: 'Bundle production tasks', detail: 'Record two videos in one session.' },
        { id: 'gr-4', category: 'CONTENT_STRATEGY', title: 'Double down on tutorials', detail: 'Tutorials currently drive the best retention.' },
        { id: 'gr-5', category: 'CONTENT_STRATEGY', title: 'Repurpose top long-form videos into Shorts', detail: 'Use clips to widen discovery.' },
        { id: 'gr-6', category: 'CONTENT_STRATEGY', title: 'Create a recurring series', detail: 'Recurring formats improve return viewers.' },
        { id: 'gr-7', category: 'PUBLISHING_FREQUENCY', title: 'Publish twice weekly', detail: 'Consistency matters more than bursts.' },
        { id: 'gr-8', category: 'PUBLISHING_FREQUENCY', title: 'Reserve one Shorts slot', detail: 'Shorts can support subscriber growth.' },
        { id: 'gr-9', category: 'PUBLISHING_FREQUENCY', title: 'Schedule uploads at peak audience times', detail: 'Use the top 2 audience windows.' },
        { id: 'gr-10', category: 'SEO', title: 'Refresh titles with clear outcomes', detail: 'Outcome-driven titles improve CTR.' },
        { id: 'gr-11', category: 'SEO', title: 'Expand keyword clusters', detail: 'Target adjacent niche terms.' },
        { id: 'gr-12', category: 'SEO', title: 'Add search-first descriptions', detail: 'Front-load primary query phrases.' },
      ],
    };
  }

  private find(id: string): Goal {
    const goal = goalsStore.find((item) => item.id === id);
    if (!goal) throw new PlatformError(404, 'NOT_FOUND', `Goal ${id} was not found.`);
    return goal;
  }
}
