import type { Goal } from '../../goals/types';

export interface GoalProgressBarProps {
  goal: Goal;
}

export function GoalProgressBar({ goal }: GoalProgressBarProps) {
  const percent = Math.min(100, Math.max(0, goal.target > 0 ? (goal.current / goal.target) * 100 : 0));
  const achieved = goal.current >= goal.target;
  return (
    <div className="goal-progress" data-testid="goal-progress-bar">
      <div className="goal-progress__track">
        <div
          className={`goal-progress__fill goal-progress__fill--${achieved ? 'done' : 'active'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="goal-progress__label">
        {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
      </span>
    </div>
  );
}
