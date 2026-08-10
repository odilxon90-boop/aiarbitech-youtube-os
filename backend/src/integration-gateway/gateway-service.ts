export type GatewayStatus = 'ACTIVE' | 'DEGRADED' | 'DOWN';
export interface GatewayEndpoint { key: string; name: string; capability: 'Identity' | 'Security' | 'AI Core' | 'Wallet' | 'Payment'; rateLimitPerMinute: number; }
export interface GatewayLog { id: string; timestamp: string; endpoint: string; status: 'SUCCESS' | 'THROTTLED' | 'FALLBACK'; latencyMs: number; retryCount: number; circuitState: 'CLOSED' | 'OPEN'; }
export interface GatewayHealth { metric: string; value: string; status: 'HEALTHY' | 'WARNING'; }
const endpoints: readonly GatewayEndpoint[] = [
  { key: 'identity', name: 'Identity service', capability: 'Identity', rateLimitPerMinute: 60 },
  { key: 'security', name: 'Security service', capability: 'Security', rateLimitPerMinute: 120 },
  { key: 'ai-core', name: 'AI Core service', capability: 'AI Core', rateLimitPerMinute: 30 },
  { key: 'wallet', name: 'Wallet service', capability: 'Wallet', rateLimitPerMinute: 60 },
  { key: 'payment', name: 'Payment service', capability: 'Payment', rateLimitPerMinute: 40 },
];
const logs: GatewayLog[] = Array.from({ length: 50 }, (_, index) => ({ id: `gateway-log-${String(index + 1).padStart(2, '0')}`, timestamp: `2026-08-09T${String(18 - Math.floor(index / 4)).padStart(2, '0')}:${String((index * 3) % 60).padStart(2, '0')}:00.000Z`, endpoint: endpoints[index % endpoints.length]!.key, status: index % 17 === 0 ? 'THROTTLED' : index % 11 === 0 ? 'FALLBACK' : 'SUCCESS', latencyMs: 45 + (index % 7) * 15, retryCount: index % 11 === 0 ? 1 : 0, circuitState: 'CLOSED' }));
const health: readonly GatewayHealth[] = [
  { metric: 'Availability', value: '99.9%', status: 'HEALTHY' },
  { metric: 'Mock latency', value: '74ms', status: 'HEALTHY' },
  { metric: 'Mock error rate', value: '0.2%', status: 'HEALTHY' },
  { metric: 'Rate-limit utilization', value: '42%', status: 'HEALTHY' },
  { metric: 'Circuit breaker', value: 'CLOSED', status: 'HEALTHY' },
];
export class GatewayService {
  private count = logs.length;
  status() { return { status: 'ACTIVE' as GatewayStatus, externalRequestPerformed: false, retryPolicy: 'MOCK_RETRY_2', circuitBreaker: 'CLOSED' }; }
  endpoints(): readonly GatewayEndpoint[] { return endpoints; }
  call(endpoint: string): GatewayLog {
    if (!endpoints.some((item) => item.key === endpoint)) throw new Error(`Gateway endpoint ${endpoint} was not found.`);
    this.count += 1;
    const entry: GatewayLog = { id: `gateway-log-${this.count}`, timestamp: new Date().toISOString(), endpoint, status: 'SUCCESS', latencyMs: 75, retryCount: 0, circuitState: 'CLOSED' };
    logs.unshift(entry);
    logs.length = 50;
    return entry;
  }
  logs(): readonly GatewayLog[] { return logs.slice(0, 50); }
  health(): readonly GatewayHealth[] { return health; }
}
