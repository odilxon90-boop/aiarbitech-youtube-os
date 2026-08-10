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
}
