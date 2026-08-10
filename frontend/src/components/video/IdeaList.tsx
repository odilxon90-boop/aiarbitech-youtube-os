import type { VideoIdea } from '../../video/types';

export interface IdeaListProps {
  ideas: readonly VideoIdea[];
}

export function IdeaList({ ideas }: IdeaListProps) {
  return (
    <section className="card" aria-label="Video Ideas">
      <h3 className="card-title">Video Ideas</h3>
      {ideas.length === 0 ? (
        <p className="muted">No video ideas available.</p>
      ) : (
        <ul className="idea-list">
          {ideas.map((idea) => (
            <li key={idea.id} className="idea-item">
              <div className="idea-head">
                <strong>{idea.title}</strong>
                <span className="confidence-badge" title={`Confidence: ${Math.round(idea.confidence * 100)}%`}>
                  {Math.round(idea.confidence * 100)}%
                </span>
              </div>
              <p className="muted">{idea.description}</p>
              <small className="trend-badge">Trend: {idea.trend}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
