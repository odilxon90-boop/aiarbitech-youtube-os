import type { RegistrationSummary } from './types';

export function PlatformRegistrationPage({ registration }: { registration: RegistrationSummary }) {
  const { metadata, readiness, status } = registration;
  return (
    <section className="card card--registration" aria-labelledby="platform-registration-title">
      <p className="section-kicker">Local registration preparation</p>
      <h2 id="platform-registration-title">Platform Registration</h2>
      <p className="lead">
        Read-only metadata prepared from verified local repository evidence. No registration action or remote communication is available.
      </p>

      <dl className="definition-grid">
        <div><dt>Platform ID</dt><dd>{metadata.platformId}</dd></div>
        <div><dt>Platform Name</dt><dd>{metadata.platformName}</dd></div>
        <div><dt>Platform Version</dt><dd>{metadata.platformVersion}</dd></div>
        <div><dt>Registration Status</dt><dd>{status}</dd></div>
        <div><dt>Registration Readiness</dt><dd>{readiness.ready ? 'READY' : 'BLOCKED'}</dd></div>
        <div><dt>Current Gate</dt><dd>{metadata.currentGate}</dd></div>
        <div><dt>Current Sprint</dt><dd>{metadata.currentSprint}</dd></div>
        <div><dt>Current Phase</dt><dd>{metadata.currentPhase}</dd></div>
        <div><dt>Compatibility Status</dt><dd>{metadata.compatibilityStatus}</dd></div>
      </dl>

      <h3>Blocking Items</h3>
      {readiness.blockingItems.length > 0 ? (
        <ul className="blocking-list">
          {readiness.blockingItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : <p className="muted">None</p>}

      <div className="evidence-strip">
        <strong>{readiness.evidence.status}</strong>
        <span>{readiness.evidence.confidence} confidence</span>
        <span>Origin: {readiness.evidence.origin.join(', ')}</span>
        <span>Mode: {metadata.registrationMode}</span>
      </div>
    </section>
  );
}