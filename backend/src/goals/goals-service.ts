<<<<<<< HEAD
// Creator Goal Center service. In-memory mock store only вЂ” no persistence,
// no real AI API, no live YouTube integration. Returns deterministic mock data.

export type GoalType = 'subscribers' | 'revenue' | 'video_count' | 'watch_time';

export type GoalStatus = 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'ACHIEVED' | 'PAUSED';

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  target: number;
  current: number;
  deadline: string;
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
<<<<<<< HEAD
  type: GoalType;
  title: string;
  target: number;
  deadline: string;
}

export interface ProgressInput {
  current?: number;
  status?: GoalStatus;
}

export type RecommendationCategory = 'STEPS' | 'CONTENT_STRATEGY' | 'PUBLISHING_FREQUENCY' | 'SEO';

export interface GoalRecommendation {
  id: string;
  goalId: string;
  category: RecommendationCategory;
  title: string;
  suggestion: string;
}

export interface GoalsBundle {
  goals: Goal[];
  recommendations: GoalRecommendation[];
}

const nowIso = (): string => new Date().toISOString();

const isoDate = (offsetDays: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

/** Goals are created (not yet due), so the earliest they could be due is today. */
function daysRemaining(deadline: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const remaining = (Date.parse(deadline) - Date.now()) / msPerDay;
  return Math.max(0, Math.ceil(remaining));
}

/**
 * Recomputes a goal's status from its progress. If the caller supplied an
 * explicit status override (e.g. "PAUSED") it is honored before recomputation.
 */
function computeStatus(current: number, target: number, deadline: string, override?: GoalStatus): GoalStatus {
      if (current >= target) {
    return 'ACHIEVED';
  }
  if (override === 'PAUSED') {
    return 'PAUSED';
  }
  if (override === 'BEHIND') {
    return 'BEHIND';
  }
  if (override === 'AT_RISK') {
    return 'AT_RISK';
  }
  const progress = target > 0 ? current / target : 0;
  const remaining = daysRemaining(deadline);
  // Expected progress assuming linear pacing to the deadline.
  const expected = remaining > 30 ? 0.5 : remaining > 14 ? 0.75 : remaining > 0 ? 0.9 : 1;
  if (progress >= expected) {
    return 'ON_TRACK';
  }
  if (progress >= expected * 0.7) {
    return 'AT_RISK';
  }
  return 'BEHIND';
}

const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-1',
    type: 'subscribers',
    title: 'Reach 1,000 subscribers',
    target: 1000,
    current: 684,
    deadline: isoDate(30),
    status: 'ON_TRACK',
    createdAt: isoDate(-60),
    updatedAt: isoDate(-2),
  },
  {
    id: 'goal-2',
    type: 'revenue',
    title: 'Earn $1,000/month',
    target: 1000,
    current: 512,
    deadline: isoDate(30),
    status: 'AT_RISK',
    createdAt: isoDate(-60),
    updatedAt: isoDate(-1),
  },
  {
    id: 'goal-3',
    type: 'video_count',
    title: 'Publish 30 videos',
    target: 30,
    current: 18,
    deadline: isoDate(10),
    status: 'BEHIND',
    createdAt: isoDate(-60),
    updatedAt: isoDate(-3),
  },
  {
    id: 'goal-4',
    type: 'watch_time',
    title: 'Hit 4,000 watch hours',
    target: 4000,
    current: 3200,
    deadline: isoDate(45),
    status: 'ON_TRACK',
    createdAt: isoDate(-60),
    updatedAt: isoDate(-2),
    },
];

const RECOMMENDATIONS: Record<GoalType, GoalRecommendation[]> = {
  subscribers: [
    { id: 'r-sub-1', goalId: 'goal-1', category: 'STEPS', title: 'Add end-screen calls to action', suggestion: 'Append a 5-second subscribe prompt to the last 15% of your videos; shorts convert at 2.3x the rate of long form.' },
    { id: 'r-sub-3', goalId: 'goal-1', category: 'CONTENT_STRATEGY', title: 'Double down on your top topic', suggestion: 'Your "AI Automations" series drives 42% of new subscribers вЂ” publish a follow-up every 10 days until the goal is reached.' },
    { id: 'r-sub-4', goalId: 'goal-1', category: 'PUBLISHING_FREQUENCY', title: 'Shorts cadence: 3x per week', suggestion: 'Shorts bring 68% of new subs; schedule 3 shorts weekly (Mon/Wed/Fri) alongside one long-form video.' },
    { id: 'r-sub-5', goalId: 'goal-1', category: 'SEO', title: 'Optimize title length and keywords', suggestion: 'Trim "Top 5 AI Automations" to <60 chars and place the high-volume keyword first to lift CTR by ~9%.' },
  ],
  revenue: [
    { id: 'r-rev-1', goalId: 'goal-2', category: 'STEPS', title: 'Unlock channel memberships', suggestion: 'Memberships add ~$140/mo once you hit 500 subs вЂ” enable them now to add a recurring revenue stream.' },
    { id: 'r-rev-3', goalId: 'goal-2', category: 'CONTENT_STRATEGY', title: 'Pivot to high-CPM niches', suggestion: 'Finance and SaaS content commands a $38 avg CPM vs your current $18 вЂ” remix one subscriber hit into a "monetization" angle this week.' },
    { id: 'r-rev-4', goalId: 'goal-2', category: 'PUBLISHING_FREQUENCY', title: 'Batch-premiere for watch time', suggestion: 'Premiering batches creates watch time spikes that compound ad revenue; schedule 2 premieres per week.' },
    { id: 'r-rev-5', goalId: 'goal-2', category: 'SEO', title: 'Add affiliate links to top 5 videos', suggestion: 'The "AI Automations" video earns 48k views/mo вЂ” add 2 topically-relevant affiliate links to add an estimated $80вЂ“$130/mo immediately.' },
  ],
  video_count: [
    { id: 'r-vid-1', goalId: 'goal-3', category: 'STEPS', title: 'Template your production workflow', suggestion: 'A 3-step template (outline в†’ record в†’ edit) cuts production time by 45%, letting you ship 3 videos/week reliably.' },
    { id: 'r-vid-3', goalId: 'goal-3', category: 'CONTENT_STRATEGY', title: 'Re-purpose one long video into 3 shorts', suggestion: 'Turn your next hour-long tutorial into a 60s short + 90s short + 3min clip to triple output with a single shoot.' },
    { id: 'r-vid-4', goalId: 'goal-3', category: 'PUBLISHING_FREQUENCY', title: 'Shorts every other day', suggestion: 'At your current pace you are 12 videos short with 10 days left вЂ” add a short every other day (6 videos) and trim one long-form script.' },
    { id: 'r-vid-5', goalId: 'goal-3', category: 'SEO', title: 'Series-stack your titles', suggestion: 'Naming videos "AI Automation #1, #2, #3вЂ¦" boosts the series CTR and encourages binge-watching, lifting views per video by ~14%.' },
  ],
  watch_time: [
    { id: 'r-wt-1', goalId: 'goal-4', category: 'STEPS', title: 'Pin a hook in the first 8 seconds', suggestion: 'Retention drops sharply after second 8 вЂ” add a hook card there to lift average view duration by ~22%.' },
    { id: 'r-wt-3', goalId: 'goal-4', category: 'CONTENT_STRATEGY', title: 'Build a 6-part series', suggestion: 'Series playlists keep viewers watching the next video automatically, adding 1,200+ watch hours per complete series released.' },
    { id: 'r-wt-4', goalId: 'goal-4', category: 'PUBLISHING_FREQUENCY', title: 'Schedule a weekly deep-dive', suggestion: 'Long-form (12+ min) content carries your watch-time average; block 3 hours every Sunday for one weekly deep-dive.' },
    { id: 'r-wt-5', goalId: 'goal-4', category: 'SEO', title: 'Add chapters and end-screen next steps', suggestion: 'Chapters boost retention 7% and end-screen links drive 18% more session watch time вЂ” add both to your last 3 uploads.' },
  ],
};

let store: Goal[] = [...MOCK_GOALS];

export function resetGoalsStore(): void {
  store = [...MOCK_GOALS];
}

export async function listGoals(): Promise<Goal[]> {
  return [...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const id = `goal-${store.length + 1}`;
  const now = nowIso();
  const goal: Goal = {
    id,
    type: input.type,
    title: input.title,
    target: input.target,
    current: 0,
    deadline: input.deadline,
    status: computeStatus(0, input.target, input.deadline),
    createdAt: now,
    updatedAt: now,
  };
  store.push(goal);
  return goal;
}

export async function updateProgress(goalId: string, input: ProgressInput): Promise<Goal | null> {
  const goal = store.find((g) => g.id === goalId);
  if (!goal) return null;
  const current = input.current ?? goal.current;
  const status = computeStatus(current, goal.target, goal.deadline, input.status);
  goal.current = current;
  goal.status = status;
  goal.updatedAt = nowIso();
  return { ...goal };
}

export async function deleteGoal(goalId: string): Promise<boolean> {
  const index = store.findIndex((g) => g.id === goalId);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}

export async function getRecommendations(input?: { goalId?: string }): Promise<GoalsBundle> {
  const goals = await listGoals();
  let recommendations: GoalRecommendation[] = goals.flatMap((goal) => RECOMMENDATIONS[goal.type] ?? []);
  if (input?.goalId) {
    recommendations = recommendations.filter((r) => r.goalId === input.goalId);
  }
  return { goals, recommendations };
}

=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
