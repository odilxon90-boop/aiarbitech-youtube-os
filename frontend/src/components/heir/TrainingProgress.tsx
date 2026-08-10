import type { TrainingProgress } from '../../heir/types';

export interface TrainingProgressProps {
  progress: TrainingProgress;
}

export function TrainingProgress({ progress }: TrainingProgressProps) {
  const pct = Math.round((progress.modulesCompleted / progress.totalModules) * 100);
  return (
    <section className="card" aria-label="Training Progress">
      <h3 className="card-title">Training Progress</h3>
      <div className="training-summary">
        <span>{progress.modulesCompleted}/{progress.totalModules} modules completed</span>
        <span>{pct}% complete</span>
        <span>Score: {progress.overallScore}%</span>
      </div>
      <ul className="training-list">
        {progress.modules.map((module) => (
          <li key={module.id} className="training-item">
            <div className="training-head">
              <strong>{module.title}</strong>
              <span className={`status-badge ${module.completed ? 'status-badge--published' : 'status-badge--draft'}`}>
                {module.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
            {module.completed && <small>Score: {module.score}%</small>}
          </li>
        ))}
      </ul>
      {progress.nextSteps.length > 0 && (
        <div className="training-next">
          <h4>Next Steps</h4>
          <ul>
            {progress.nextSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
