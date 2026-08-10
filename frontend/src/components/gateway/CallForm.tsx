import { useState } from 'react';
<<<<<<< HEAD
import type { EcosystemEndpoint, GatewayCallResponse } from '../../gateway/types';

const OUTCOME_CLASS: Record<GatewayCallResponse['outcome'], string> = {
  SUCCESS: 'outcome--success',
  ERROR: 'outcome--error',
  TIMEOUT: 'outcome--timeout',
  CIRCUIT_OPEN: 'outcome--circuit',
};

export interface CallFormProps {
  endpoints: readonly EcosystemEndpoint[];
  onCall: (endpointId: string, payload: Record<string, unknown>) => Promise<GatewayCallResponse>;
}

export function CallForm({ endpoints, onCall }: CallFormProps) {
  const [selectedId, setSelectedId] = useState(endpoints[0]?.id ?? '');
  const [payloadText, setPayloadText] = useState('{}');
  const [result, setResult] = useState<GatewayCallResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const payload = JSON.parse(payloadText) as Record<string, unknown>;
      const res = await onCall(selectedId, payload);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Call failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" aria-label="Execute Gateway Call">
      <h3 className="card-title">Execute Gateway Call</h3>
      <form className="call-form" onSubmit={handleSubmit} aria-label="Gateway call form">
        <label>
          Endpoint
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            aria-label="Select endpoint"
          >
            {endpoints.map((ep) => (
              <option key={ep.id} value={ep.id} disabled={ep.status === 'UNAVAILABLE'}>
                {ep.name} ({ep.method} {ep.path})
              </option>
            ))}
          </select>
        </label>
        <label>
          Payload (JSON)
          <textarea
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            rows={3}
            aria-label="Request payload"
          />
        </label>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Calling…' : 'Execute Call'}
        </button>
      </form>

      {error && <p className="call-error muted">Error: {error}</p>}

      {result && (
        <div className="call-result">
          <div className={`outcome-badge ${OUTCOME_CLASS[result.outcome]}`}>
            {result.outcome} — {result.statusCode} — {result.latencyMs} ms
          </div>
          <pre className="call-response">{JSON.stringify(result.response, null, 2)}</pre>
          <p className="muted">Request ID: {result.requestId}</p>
        </div>
      )}
    </section>
  );
}
=======
export function CallForm() { const [called, setCalled] = useState(false); return <section className="card gateway-card" aria-labelledby="gateway-call-title"><p className="section-kicker">Mock execution</p><h2 id="gateway-call-title">Call endpoint</h2><form onSubmit={(event) => { event.preventDefault(); setCalled(true); }}><label>Endpoint<select aria-label="Gateway endpoint" defaultValue="ai-core"><option value="ai-core">AI Core</option><option value="identity">Identity</option></select></label><button type="submit">Run mock call</button>{called && <p role="status">Mock call completed.</p>}</form></section>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
