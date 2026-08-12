import type { EcosystemEndpoint } from '../../gateway/types';

export interface GatewayEndpoint { key: string; name: string; rateLimitPerMinute: number; }

export function EndpointList({ endpoints }: { endpoints: readonly (GatewayEndpoint | EcosystemEndpoint)[] }) {
  return (
    <section className="card gateway-card" aria-labelledby="gateway-endpoints-title">
      <p className="section-kicker">{endpoints.length} registered Global Ecosystem endpoints</p>
      <h2 id="gateway-endpoints-title">Endpoint Registry</h2>
      {endpoints.length === 0 ? (
        <p>No endpoints registered.</p>
      ) : (
        <ul className="gateway-list">
          {endpoints.map((item) => (
            <li key={'id' in item ? item.id : item.key}>
              <span>{item.name}{'method' in item ? ` · ${item.method} ${item.path}` : ''}</span>
              <small>{'latencyMs' in item ? `${item.latencyMs} ms avg · ${item.status}` : `${item.rateLimitPerMinute}/min`}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
