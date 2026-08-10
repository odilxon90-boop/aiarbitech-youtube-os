import type { GoalRecommendation } from '../../goals/types';

export interface GoalRecommendationsProps {
  recommendations: readonly GoalRecommendation[];
}

const CATEGORY_ORDER: ReadonlyArray<GoalRecommendation['category']> = [
  'STEPS',
  'CONTENT_STRATEGY',
  'PUBLISHING_FREQUENCY',
  'SEO',
];

const CATEGORY_LABELS: Record<GoalRecommendation['category'], string> = {
  STEPS: 'Steps to Reach the Goal Faster',
  CONTENT_STRATEGY: 'Content Strategy Adjustments',
  PUBLISHING_FREQUENCY: 'Publishing Frequency Recommendations',
  SEO: 'SEO Improvement Suggestions',
};

export function GoalRecommendations({ recommendations }: GoalRecommendationsProps) {
  if (recommendations.length === 0) {
    return <p className="muted">No recommendations yet.</p>;
  }

  const byCategory = new Map<GoalRecommendation['category'], GoalRecommendation[]>();
  for (const rec of recommendations) {
    const bucket = byCategory.get(rec.category) ?? [];
    bucket.push(rec);
    byCategory.set(rec.category, bucket);
  }

  return (
    <section className="goal-recommendations" data-testid="goal-recommendations">
      <h3 className="goal-recommendations__title">AI Recommendations</h3>
      {CATEGORY_ORDER.map((category) => {
        const items = byCategory.get(category) ?? [];
        if (items.length === 0) return null;
        return (
          <div key={category} className="goal-rec-group">
            <h4 className="goal-rec-group__title">{CATEGORY_LABELS[category]}</h4>
            <ul className="goal-rec-list">
              {items.map((item) => (
                <li key={item.id} className="goal-rec">
                  <strong className="goal-rec__title">{item.title}</strong>
                  <p className="goal-rec__suggestion">{item.suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
