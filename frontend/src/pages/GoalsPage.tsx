import { useEffect, useMemo, useState } from 'react';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalCreateModal } from '../components/goals/GoalCreateModal';
import { GoalRecommendations } from '../components/goals/GoalRecommendations';
import { createGoalsClient } from '../goals/goals-client';
import type { CreateGoalInput, GoalsBundle, GoalsClient } from '../goals/types';
import { ErrorState, LoadingState } from '../shared/components/AsyncStates';

interface GoalsPageProps {
  client?: GoalsClient;
  initialData?: GoalsBundle;
}

export function GoalsPage({ client, initialData }: GoalsPageProps) {
  const goalsClient = useMemo(() => client ?? createGoalsClient(), [client]);
  const [data, setData] = useState<GoalsBundle | undefined>(initialData);
  const [error, setError] = useState<string>();
  const [isCreateOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (initialData) return;
    const controller = new AbortController();
    goalsClient.getRecommendations(undefined, controller.signal).then(setData).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Unable to load goals.');
    });
    return () => controller.abort();
  }, [goalsClient, initialData]);

  const createGoal = (input: CreateGoalInput) => {
    void goalsClient.createGoal(input).then((goal) => {
      setData((current) => current ? { ...current, goals: [goal, ...current.goals] } : current);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to create goal.'));
  };
  const updateProgress = (goalId: string, current: number) => {
    void goalsClient.updateProgress(goalId, { current }).then((goal) => {
      setData((bundle) => bundle ? { ...bundle, goals: bundle.goals.map((item) => item.id === goal.id ? goal : item) } : bundle);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to update goal.'));
  };
  const deleteGoal = (goalId: string) => {
    void goalsClient.deleteGoal(goalId).then(() => {
      setData((bundle) => bundle ? { ...bundle, goals: bundle.goals.filter((goal) => goal.id !== goalId) } : bundle);
    }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to delete goal.'));
  };

  return <section className="goals-page" aria-labelledby="goals-title">
    <header className="goals-header"><div><p className="section-kicker">Creator strategy</p><h2 id="goals-title">Creator Goal Center</h2><p className="muted">Set measurable goals and use AI guidance to keep progress on track.</p></div><button type="button" onClick={() => setCreateOpen(true)}>Create goal</button></header>
    {error && <ErrorState message={error} />}
    {!data && !error && <LoadingState message="Loading goals…" />}
    {data && <div className="goals-layout"><div className="goals-grid">{data.goals.length === 0 ? <p className="muted">No goals created yet.</p> : data.goals.map((goal) => <GoalCard key={goal.id} goal={goal} onUpdateProgress={(_, current) => updateProgress(goal.id, current)} onDelete={(item) => deleteGoal(item.id)} />)}</div><GoalRecommendations recommendations={data.recommendations} /></div>}
    <GoalCreateModal open={isCreateOpen} onClose={() => setCreateOpen(false)} onCreate={createGoal} />
  </section>;
}
