import { useState } from 'react';
import type { Goal } from '../../goals/types';
import { GOAL_TYPE_LABELS } from '../../goals/types';
import { GoalProgressBar } from './GoalProgressBar';

export interface GoalCardProps {
  goal: Goal;
  onUpdateProgress?: (goal: Goal, next: number) => void;
  onDelete?: (goal: Goal) => void;
}

const STATUS_TONE: Record<Goal['status'], 'success' | 'warning' | 'danger' | 'neutral'> = {
  ON_TRACK: 'success',
  AT_RISK: 'warning',
  BEHIND: 'danger',
  ACHIEVED: 'success',
  PAUSED: 'neutral',
};

export function GoalCard({ goal, onUpdateProgress, onDelete }: GoalCardProps) {
  const [step] = useState(1);
  return (
    <article className="goal-card" data-testid={`goal-card-${goal.id}`}>
      <header className="goal-card__head">
        <h3 className="goal-card__title">{goal.title}</h3>
        <span className={`goal-card__status goal-card__status--${STATUS_TONE[goal.status]}`}>
          {goal.status.replace('_', ' ')}
        </span>
      </header>
      <p className="goal-card__type">{GOAL_TYPE_LABELS[goal.type]}</p>
      <GoalProgressBar goal={goal} />
      <p className="goal-card__meta">
        Target by <time dateTime={goal.deadline}>{goal.deadline}</time>
      </p>
      {onUpdateProgress && (
        <button
          type="button"
          className="goal-card__action goal-card__action--progress"
          onClick={() => onUpdateProgress(goal, Math.min(goal.target, goal.current + step))}
        >
          +{step} step
        </button>
      )}
      {onDelete && (
        <button type="button" className="goal-card__action goal-card__action--delete" onClick={() => onDelete(goal)}>
          Delete
        </button>
      )}
    </article>
  );
}

// Re-export so consuming pages can place the bar independently of a card.
export { GoalProgressBar };

