import type { DerivedHealthScore, PlatformHealthManifest } from './types';

function ScoreCard({ label, score }: { label: string; score: DerivedHealthScore }) {
  return (
    <div className="health-score">
      <dt>{label}</dt>
      <dd>{score.value}%</dd>
      <span>{score.status} · {score.passed}/{score.total}</span>
    </div>
  );
}

export function PlatformHealthDashboard({ manifest }: { manifest: PlatformHealthManifest }) {
  return (
    <section className="card card--health-dashboard" aria-labelledby="platform-health-title">
      <p className="section-kicker">Repository-derived operational evidence</p>
      <h2 id="platform-health-title">Platform Capability Health &amp; Readiness</h2>
      <p className="lead">Read-only scores calculated by the backend from versioned local governance artifacts and required repository files. No external request is performed.</p>

      <dl className="health-score-grid">
        <ScoreCard label="Architecture Compliance Score" score={manifest.architectureComplianceScore} />
        <ScoreCard label="Repository Health Score" score={manifest.repositoryHealthScore} />
        <ScoreCard label="Foundation Completion" score={manifest.foundationCompletion} />
        <ScoreCard label="Overall Readiness" score={manifest.overallReadiness} />
      </dl>

      <dl className="definition-grid">
        <div><dt>Current Gate</dt><dd>{manifest.currentGate}</dd></div>
        <div><dt>Current Sprint</dt><dd>{manifest.currentSprint}</dd></div>
        <div><dt>Current Phase</dt><dd>{manifest.currentPhase}</dd></div>
        <div><dt>Validation Status</dt><dd>{manifest.validationStatus}</dd></div>
        <div><dt>Readiness Status</dt><dd>{manifest.readiness.readinessStatus}</dd></div>
        <div><dt>Last Validation Timestamp</dt><dd><time dateTime={manifest.lastValidationTimestamp}>{manifest.lastValidationTimestamp}</time></dd></div>
      </dl>

      <h3>Readiness Blocking Items</h3>
      {manifest.readiness.blockingItems.length > 0 ? <ul className="blocking-list">{manifest.readiness.blockingItems.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="muted">None</p>}
      <div className="evidence-strip"><strong>READ ONLY</strong><span>Network request performed: {String(manifest.networkRequestPerformed)}</span><span>{manifest.overallReadiness.basis}</span></div>
    </section>
  );
}