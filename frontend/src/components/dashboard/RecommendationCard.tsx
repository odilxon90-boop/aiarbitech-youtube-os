import type { Recommendation, RecommendationPriority } from '../../dashboard/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function priorityBadge(priority: RecommendationPriority): string {
  return priority;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <article className="recommendation-card">
      <div className="recommendation-head">
        <strong>{recommendation.title}</strong>
        <span
          className={`recommendation-priority recommendation-priority--${recommendation.priority.toLowerCase()}`}
        >
          {priorityBadge(recommendation.priority)}
        </span>
      </div>
      <p className="muted">{recommendation.reason}</p>
    </article>
  );
}