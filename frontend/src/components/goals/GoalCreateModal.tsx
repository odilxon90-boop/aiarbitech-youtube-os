import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateGoalInput, GoalType } from '../../goals/types';
import { GOAL_TYPE_LABELS } from '../../goals/types';

export interface GoalCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateGoalInput) => void;
}

function tomorrowIso(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function GoalCreateModal({ open, onClose, onCreate }: GoalCreateModalProps) {
  const [type, setType] = useState<GoalType>('subscribers');
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState(tomorrowIso());

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || Number(target) <= 0) return;
    onCreate({ type, title: title.trim(), target: Number(target), deadline });
    onClose();
  };

  return (
    <div className="goal-modal" data-testid="goal-create-modal" role="dialog" aria-modal="true">
      <form className="goal-modal__form" onSubmit={handleSubmit}>
        <h3 className="goal-modal__title">New Goal</h3>
        <label className="goal-modal__field">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as GoalType)}>
            {(Object.keys(GOAL_TYPE_LABELS) as GoalType[]).map((t) => (
              <option key={t} value={t}>{GOAL_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </label>
        <label className="goal-modal__field">
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Reach 1,000 subscribers" />
        </label>
        <label className="goal-modal__field">
          <span>Target</span>
          <input type="number" min={1} value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
        <label className="goal-modal__field">
          <span>Deadline</span>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
        <div className="goal-modal__actions">
          <button type="button" className="goal-modal__cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="goal-modal__submit">Create</button>
        </div>
      </form>
    </div>
  );
}
