import type { ContractRegistry, VersionMatrixRow } from './types';

const Empty = () => <p className="muted">No repository evidence registered.</p>;
const Values = ({ values }: { values: readonly string[] }) => values.length ? <ul>{values.map((value) => <li key={value}><code>{value}</code></li>)}</ul> : <Empty />;

export function ContractRegistryDashboard({ registry }: { registry: ContractRegistry }) {
  const isApi = registry.registryType === 'API_CONTRACT_REGISTRY';
  return <section className="panel" aria-labelledby="contract-title">
    <h2 id="contract-title">{isApi ? 'API Contract Registry' : 'Event Contract Registry'}</h2>
    <p className="muted">Authoritative read-only contract inventory · {registry.currentSprint}</p>
    <div className="grid">
      <article className="card"><h3>Contracts</h3><Values values={registry.contracts.map((c) => `${c.contractId} · ${c.ownership} · ${c.lifecycle} · ${c.compatibility}`)} /></article>
      <article className="card"><h3>Repository Evidence</h3><Values values={registry.contracts.map((c) => `${c.contractId} · ${c.origin}`)} /></article>
      <article className="card"><h3>Related Files</h3><Values values={registry.contracts.flatMap((c) => c.relatedFiles)} /></article>
    </div>
  </section>;
}

export function VersionMatrixDashboard({ matrix }: { matrix: readonly VersionMatrixRow[] }) {
  return <section className="panel" aria-labelledby="matrix-title">
    <h2 id="matrix-title">API Version Matrix</h2>
    <p className="muted">Read-only version and compatibility matrix · AAT-YTOS-SPRINT-0.0.5</p>
    <div className="grid">
      <article className="card"><h3>Version Rows</h3><Values values={matrix.map((row) => `${row.contractId} · ${row.kind} · ${row.ownership} · ${row.version} → ${row.requiredVersion} · ${row.lifecycle} · ${row.compatibility}`)} /></article>
      <article className="card"><h3>Repository Evidence</h3><Values values={matrix.map((row) => `${row.contractId} · ${row.origin}`)} /></article>
    </div>
  </section>;
}
