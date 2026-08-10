import type { StylePreference, ContentPreference } from '../../memory/types';

export interface PreferenceListProps {
  stylePreferences: readonly StylePreference[];
  contentPreferences: readonly ContentPreference[];
}

export function PreferenceList({ stylePreferences, contentPreferences }: PreferenceListProps) {
  return (
    <div className="preferences">
      <section className="card" aria-label="Style Preferences">
        <h3 className="card-title">Style Preferences</h3>
        <ul className="preference-list">
          {stylePreferences.map((pref) => (
            <li key={pref.id} className="preference-item">
              <div>
                <strong>{pref.category}</strong>
                <span>{pref.value}</span>
              </div>
              <span className="confidence-badge" title={`Confidence: ${Math.round(pref.confidence * 100)}%`}>
                {Math.round(pref.confidence * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-label="Content Preferences">
        <h3 className="card-title">Content Preferences</h3>
        <ul className="preference-list">
          {contentPreferences.map((pref) => (
            <li key={pref.id} className="preference-item">
              <div>
                <strong>{pref.topic}</strong>
                <span>{pref.format}</span>
                <small>{pref.note}</small>
              </div>
              <span className={`priority-badge priority-badge--${pref.priority.toLowerCase()}`}>{pref.priority}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
