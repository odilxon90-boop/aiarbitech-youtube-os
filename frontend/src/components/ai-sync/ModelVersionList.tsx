<<<<<<< HEAD
import type { ModelVersion } from '../../ai-sync/types';

export interface ModelVersionListProps {
  models: readonly ModelVersion[];
}

export function ModelVersionList({ models }: ModelVersionListProps) {
  return (
    <section className="card" aria-label="Model Versions">
      <h3 className="card-title">Model Versions ({models.length})</h3>
      {models.length === 0 ? (
        <p className="muted">No model versions found.</p>
      ) : (
        <ul className="model-list">
          {models.map((model) => (
            <li key={model.id} className="model-item">
              <div className="model-head">
                <strong>{model.name}</strong>
                <span className={`status-badge ${model.active ? 'status-badge--published' : 'status-badge--draft'}`}>
                  {model.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="muted">Version: {model.version}</p>
              <small>Deployed: {new Date(model.deployedAt).toLocaleDateString()}</small>
              <div className="model-meta">
                {Object.entries(model.metadata).map(([key, value]) => (
                  <span key={key}>{key}: {value}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
=======
export interface ModelVersion { id: string; name: string; version: string; scope: string; active: boolean; }
export function ModelVersionList({ models }: { models: readonly ModelVersion[] }) {
  return <section className="card sync-card" aria-labelledby="sync-models-title"><p className="section-kicker">Mock model registry</p><h2 id="sync-models-title">Model versions</h2><ul className="sync-list">{models.map((model) => <li key={model.id}><span>{model.name} {model.version}</span><small>{model.scope} · {model.active ? 'ACTIVE' : 'INACTIVE'}</small></li>)}</ul></section>;
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
