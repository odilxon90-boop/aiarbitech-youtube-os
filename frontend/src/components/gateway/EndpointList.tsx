<<<<<<< HEAD
import type { EcosystemEndpoint } from '../../gateway/types';

const EP_STATUS_ICON: Record<EcosystemEndpoint['status'], string> = {
  AVAILABLE: '🟢',
  DEGRADED: '🟡',
  UNAVAILABLE: '🔴',
};

export interface EndpointListProps {
  endpoints: readonly EcosystemEndpoint[];
  onCall?: (endpointId: string) => void;
}

export function EndpointList({ endpoints, onCall }: EndpointListProps) {
  return (
    <section className="card" aria-label="Endpoint Registry">
      <h3 className="card-title">Endpoint Registry</h3>
      <p className="muted">{endpoints.length} registered Global Ecosystem endpoints</p>
      {endpoints.length === 0 ? (
        <p className="muted">No endpoints registered.</p>
      ) : (
        <ul className="endpoint-list">
          {endpoints.map((ep) => (
            <li key={ep.id} className="endpoint-item">
              <div className="endpoint-head">
                <span>{EP_STATUS_ICON[ep.status]}</span>
                <strong>{ep.name}</strong>
                <code className="endpoint-method">{ep.method}</code>
                <code className="endpoint-version">{ep.version}</code>
              </div>
              <code className="endpoint-path">{ep.path}</code>
              <p className="endpoint-desc muted">{ep.description}</p>
              <div className="endpoint-footer">
                <span className="muted">{ep.latencyMs} ms avg</span>
                {ep.requiresAuth && <span className="auth-badge">🔒 Auth required</span>}
                {onCall && ep.status !== 'UNAVAILABLE' && (
                  <button
                    type="button"
                    className="btn-call"
                    onClick={() => onCall(ep.id)}
                    data-testid={`call-${ep.id}`}
                  >
                    Call
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
=======
export interface GatewayEndpoint { key: string; name: string; rateLimitPerMinute: number; }
export function EndpointList({ endpoints }: { endpoints: readonly GatewayEndpoint[] }) { return <section className="card gateway-card" aria-labelledby="gateway-endpoints-title"><p className="section-kicker">Mock registry</p><h2 id="gateway-endpoints-title">Endpoints</h2><ul className="gateway-list">{endpoints.map((item) => <li key={item.key}><span>{item.name}</span><small>{item.rateLimitPerMinute}/min</small></li>)}</ul></section>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
