import type { GlobalEcosystemConnectionStatus } from './types';

export function GlobalEcosystemStatusPage({ status }: { status: GlobalEcosystemConnectionStatus }) {
  return (
    <section className="card" aria-labelledby="ecosystem-title">
      <p className="section-kicker">Enterprise core boundary</p>
      <h2 id="ecosystem-title">Global Ecosystem connection</h2>
      <div className="connection-status">
        <span className="connection-status__label">{status.status.replaceAll('_', ' ')}</span>
        <p>
          Contract compatibility is not assumed. Direct Global Ecosystem requests and direct database
          access remain prohibited until Gate 0 verification.
        </p>
      </div>
      <dl className="compact-grid">
        <div><dt>Contract version</dt><dd>{status.contractVersion}</dd></div>
        <div><dt>Configured</dt><dd>{status.integrationConfigured ? 'YES' : 'NO'}</dd></div>
        <div><dt>External request</dt><dd>{status.networkRequestPerformed ? 'PERFORMED' : 'NOT PERFORMED'}</dd></div>
      </dl>
      <h3>Required shared capabilities</h3>
      {status.capabilities.length === 0 ? (
        <p className="muted">Capability contracts will be populated from the platform manifest.</p>
      ) : (
        <ul className="capability-list">
          {status.capabilities.map((capability) => (
            <li key={capability.name}>
              <span>{capability.name}</span>
              <strong>{capability.compatibility.replaceAll('_', ' ')}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
