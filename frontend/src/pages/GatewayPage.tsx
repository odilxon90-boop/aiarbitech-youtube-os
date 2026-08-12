import type { GatewaySummary } from '../gateway/types';
import { CallForm } from '../components/gateway/CallForm';
import { EndpointList } from '../components/gateway/EndpointList';
import { HealthChart } from '../components/gateway/HealthChart';
import { LogList } from '../components/gateway/LogList';
import { StatusCard } from '../components/gateway/StatusCard';

export function GatewayPage({ initialData }: { initialData?: GatewaySummary }) {
  if (!initialData) {
    return <section className="gateway-page"><h2>Integration Gateway</h2><p>Loading gateway data…</p></section>;
  }
  return (
    <section className="gateway-page" aria-labelledby="gateway-page-title">
      <div className="gateway-header">
        <div><p className="eyebrow">Global Ecosystem</p><h2 id="gateway-page-title">Integration Gateway</h2></div>
        <span className="foundation-badge">gateway:access</span>
      </div>
      <div className="gateway-grid">
        <StatusCard status={initialData.status} />
        <CallForm />
        <EndpointList endpoints={initialData.endpoints} />
        <HealthChart health={initialData.health} />
        <LogList entries={initialData.logs} />
      </div>
    </section>
  );
}
