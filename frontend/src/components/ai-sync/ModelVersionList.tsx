import type { ModelVersion as SyncModelVersion } from '../../ai-sync/types';

export interface ModelVersion { id: string; name: string; version: string; scope: string; active: boolean; }

export function ModelVersionList({ models }: { models: readonly (ModelVersion | SyncModelVersion)[] }) {
  return (
    <section className="card sync-card" aria-labelledby="sync-models-title">
      <p className="section-kicker">Mock model registry</p>
      <h2 id="sync-models-title">Model Versions ({models.length})</h2>
      {models.length === 0 ? (
        <p>No model versions found.</p>
      ) : (
        <ul className="sync-list">
          {models.map((model) => (
            <li key={model.id}>
              <span>{model.name} {model.version}</span>
              <small>
                {'scope' in model ? `${model.scope} · ` : ''}
                {model.active ? 'Active' : 'Inactive'}
                {'metadata' in model && Object.keys(model.metadata).length > 0
                  ? ` · ${Object.entries(model.metadata).map(([key, value]) => `${key}: ${value}`).join(' · ')}`
                  : ''}
              </small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
