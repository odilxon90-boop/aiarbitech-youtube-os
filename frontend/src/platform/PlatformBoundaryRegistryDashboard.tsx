import type { PlatformBoundaryRegistry } from './types';

const Empty = () => <p className="muted">No repository evidence registered.</p>;
const Values = ({ values }: { values: readonly string[] }) => values.length ? <ul>{values.map((value) => <li key={value}><code>{value}</code></li>)}</ul> : <Empty />;

export function PlatformBoundaryRegistryDashboard({ registry }: { registry: PlatformBoundaryRegistry }) {
  return <section className="panel" aria-labelledby="boundary-title">
    <h2 id="boundary-title">Platform Boundary Registry</h2><p className="muted">Authoritative read-only inventory · {registry.currentSprint}</p>
    <div className="grid">
      <article className="card"><h3>Internal Modules</h3><Values values={registry.platformInternalModules.map((item) => `${item.id} · ${item.classification}`)} /></article>
      <article className="card"><h3>Database Ownership</h3><Values values={registry.platformOwnedDatabaseObjects.map((item) => `${item.name} · ${item.classification}`)} /></article>
      <article className="card"><h3>Public APIs</h3><Values values={registry.platformPublicApis.map((item) => `${item.method} ${item.path}`)} /></article>
      <article className="card"><h3>Public Events</h3><Values values={registry.platformPublicEvents} /></article>
      <article className="card"><h3>Consumed Global APIs</h3><Values values={registry.consumedGlobalApis.map((item) => `${item.id} · ${item.status}`)} /></article>
      <article className="card"><h3>Consumed Global Events</h3><Values values={registry.consumedGlobalEvents.map((item) => `${item.id} · ${item.status}`)} /></article>
      <article className="card"><h3>Forbidden Dependencies</h3><Values values={registry.forbiddenDependencies} /></article>
      <article className="card"><h3>Forbidden Database Access</h3><Values values={registry.forbiddenDatabaseAccess} /></article>
      <article className="card"><h3>External Providers</h3><Values values={registry.externalProviders.map((item) => item.id)} /></article>
      <article className="card"><h3>Allowed Network Destinations</h3><Values values={registry.allowedNetworkDestinations.map((item) => item.id)} /></article>
    </div>
  </section>;
}