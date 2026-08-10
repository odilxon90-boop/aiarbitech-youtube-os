import type { GenreRecommendation } from '../../genre/types';

export interface RecommendationListProps {
  recommendations: readonly GenreRecommendation[];
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <section className="card" aria-label="Genre Recommendations">
      <h3 className="card-title">AI Genre Recommendations</h3>
      {recommendations.length === 0 ? (
        <p className="muted">No genre recommendations available.</p>
      ) : (
        <ul className="genre-recommendation-list">
          {recommendations.map((rec) => (
            <li key={rec.id} className="genre-recommendation-item">
              <div className="genre-rec-head">
                <strong>{rec.name}</strong>
                <span className="confidence-badge" title="Confidence score">
                  {rec.confidence}% match
                </span>
              </div>
              <p className="genre-rec-reason">{rec.reason}</p>
              <div className="genre-rec-tags">
                {rec.tags.map((tag) => (
                  <span key={tag} className="genre-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
