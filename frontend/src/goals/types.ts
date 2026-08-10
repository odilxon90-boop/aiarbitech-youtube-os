// Creator Goal Center types. Mirrors the backend goals service DTOs.

export type GoalType = 'subscribers' | 'revenue' | 'video_count' | 'watch_time';

export type GoalStatus = 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'ACHIEVED' | 'PAUSED';

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  target: number;
  current: number;
  deadline: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
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

export interface GoalsClient {
  listGoals(signal?: AbortSignal): Promise<Goal[]>;
  createGoal(input: CreateGoalInput, signal?: AbortSignal): Promise<Goal>;
  updateProgress(goalId: string, input: ProgressInput, signal?: AbortSignal): Promise<Goal>;
  deleteGoal(goalId: string, signal?: AbortSignal): Promise<{ deleted: boolean; goalId: string }>;
  getRecommendations(goalId?: string, signal?: AbortSignal): Promise<GoalsBundle>;
}

export const GOAL_TYPE_LABELS: Readonly<Record<GoalType, string>> = {
  subscribers: 'Subscribers',
  revenue: 'Revenue',
  video_count: 'Video Count',
  watch_time: 'Watch Time',
};

export const GOAL_STATUS_LABELS: Readonly<Record<GoalStatus, string>> = {
  ON_TRACK: 'On Track',
  AT_RISK: 'At Risk',
  BEHIND: 'Behind',
  ACHIEVED: 'Achieved',
  PAUSED: 'Paused',
};
