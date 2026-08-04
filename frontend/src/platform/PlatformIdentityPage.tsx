import type { PlatformManifest } from './types';

export function PlatformIdentityPage({ manifest }: { manifest: PlatformManifest }) {
  return (
    <section className="card card--identity" aria-labelledby="platform-identity-title">
      <p className="section-kicker">Platform identity</p>
      <h2 id="platform-identity-title">{manifest.platformName}</h2>
      <p className="lead">
        A separately deployed platform boundary governed by the AIArbiTechnology Global Ecosystem.
      </p>
      <dl className="definition-grid">
        <div><dt>Platform ID</dt><dd>{manifest.platformId}</dd></div>
        <div><dt>Version</dt><dd>{manifest.platformVersion}</dd></div>
        <div><dt>Architecture</dt><dd>{manifest.architectureModel}</dd></div>
        <div><dt>Deployment</dt><dd>{manifest.deploymentModel}</dd></div>
        <div><dt>Data ownership</dt><dd>{manifest.dataOwnership}</dd></div>
        <div><dt>Foundation status</dt><dd>{manifest.status}</dd></div>
      </dl>
      <div className="boundary-callout">
        <strong>Database boundary enforced</strong>
        <span>Global and cross-platform database access: {manifest.globalDatabaseAccess}</span>
      </div>
    </section>
  );
}
