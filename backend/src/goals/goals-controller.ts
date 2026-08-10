import {
  type CreateGoalInput,
  type Goal,
  type GoalRecommendation,
  type GoalsBundle,
  type ProgressInput,
  createGoal,
  deleteGoal,
  getRecommendations,
  listGoals,
  resetGoalsStore,
  updateProgress,
} from './goals-service.js';

export interface GoalsController {
  listGoals(): Promise<Goal[]>;
  createGoal(input: CreateGoalInput): Promise<Goal>;
  updateProgress(goalId: string, input: ProgressInput): Promise<Goal | null>;
  deleteGoal(goalId: string): Promise<boolean>;
  getRecommendations(input?: { goalId?: string }): Promise<GoalsBundle>;
}

export const goalsController: GoalsController = {
  listGoals: () => listGoals(),
  createGoal: (input) => createGoal(input),
  updateProgress: (goalId, input) => updateProgress(goalId, input),
  deleteGoal: (goalId) => deleteGoal(goalId),
  getRecommendations: (input) => getRecommendations(input),
};

export { resetGoalsStore, type GoalRecommendation, type GoalsBundle };
