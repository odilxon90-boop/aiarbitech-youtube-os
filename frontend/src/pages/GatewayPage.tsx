import { CallForm } from '../components/gateway/CallForm';
import { EndpointList } from '../components/gateway/EndpointList';
import { HealthChart } from '../components/gateway/HealthChart';
import { LogList } from '../components/gateway/LogList';
import { StatusCard } from '../components/gateway/StatusCard';
const endpointSeeds: readonly [string, string, number][] = [['identity', 'Identity service', 60], ['security', 'Security service', 120], ['ai-core', 'AI Core service', 30], ['wallet', 'Wallet service', 60], ['payment', 'Payment service', 40]];
const endpoints = endpointSeeds.map(([key, name, rateLimitPerMinute]) => ({ key, name, rateLimitPerMinute }));
const logs = Array.from({ length: 50 }, (_, index) => ({ id: `log-${index}`, endpoint: endpoints[index % endpoints.length]!.key, status: index % 11 ? 'SUCCESS' : 'FALLBACK', latencyMs: 45 + (index % 7) * 15 }));
const health = [{ metric: 'Availability', value: '99.9%', status: 'HEALTHY' }, { metric: 'Latency', value: '74ms', status: 'HEALTHY' }, { metric: 'Error rate', value: '0.2%', status: 'HEALTHY' }, { metric: 'Rate limits', value: '42%', status: 'HEALTHY' }, { metric: 'Circuit breaker', value: 'CLOSED', status: 'HEALTHY' }];
export function GatewayPage() { return <section className="gateway-page" aria-labelledby="gateway-page-title"><div className="gateway-header"><div><p className="eyebrow">Mock data only</p><h2 id="gateway-page-title">Global Ecosystem Gateway</h2></div><span className="foundation-badge">gateway:access</span></div><div className="gateway-grid"><StatusCard status="ACTIVE" /><CallForm /><EndpointList endpoints={endpoints} /><HealthChart metrics={health} /><LogList logs={logs} /></div></section>; }
