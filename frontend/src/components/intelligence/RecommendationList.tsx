import type { Recommendation } from '../../intelligence/types';

export interface RecommendationListProps {
  recommendations: readonly Recommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <section className="card" aria-label="AI Recommendations">
      <h3 className="card-title">AI Recommendations</h3>
      {recommendations.length === 0 ? (
        <p className="muted">No recommendations available.</p>
      ) : (
        <ul className="recommendation-list">
          {recommendations.map((recommendation) => (
            <li key={recommendation.id}>
              <div className="recommendation-head">
                <strong>{recommendation.title}</strong>
                <span className={`priority-badge priority-badge--${recommendation.priority.toLowerCase()}`}>
                  {recommendation.priority}
                </span>
              </div>
              <p>{recommendation.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
