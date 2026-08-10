export interface ModelVersion { id: string; name: string; version: string; scope: string; active: boolean; }
export function ModelVersionList({ models }: { models: readonly ModelVersion[] }) {
  return <section className="card sync-card" aria-labelledby="sync-models-title"><p className="section-kicker">Mock model registry</p><h2 id="sync-models-title">Model versions</h2><ul className="sync-list">{models.map((model) => <li key={model.id}><span>{model.name} {model.version}</span><small>{model.scope} · {model.active ? 'ACTIVE' : 'INACTIVE'}</small></li>)}</ul></section>;
}
