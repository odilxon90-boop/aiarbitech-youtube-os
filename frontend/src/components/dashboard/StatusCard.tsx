import type { AiStatus, AiStatusLevel } from '../../dashboard/types';

export function aiStatusSignal(level: AiStatusLevel): string {
  switch (level) {
    case 'HEALTHY':
      return '🟢';
    case 'DEGRADED':
      return '🟡';
    case 'CRITICAL':
      return '🔴';
  }
}

interface StatusCardProps {
  aiStatus: AiStatus;
}

export function StatusCard({ aiStatus }: StatusCardProps) {
  return (
    <section className="card" aria-label="AI Status">
      <h3 className="card-title">AI Status</h3>
      <div className="ai-status-row">
        <span className="ai-status-signal" role="img" aria-label={`AI status ${aiStatus.level}`}>
          {aiStatusSignal(aiStatus.level)}
        </span>
        <strong className={`ai-status-level ai-status-level--${aiStatus.level.toLowerCase()}`}>
          {aiStatus.label}
        </strong>
      </div>
      <p className="lead">{aiStatus.detail}</p>
      <p className="muted">Updated {aiStatus.updatedAt}</p>
    </section>
  );
}