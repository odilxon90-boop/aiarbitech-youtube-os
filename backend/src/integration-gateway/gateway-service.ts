<<<<<<< HEAD
// Integration Gateway service. Mock/stub only — no real Global Ecosystem calls.
// Replace with live adapter after Gate 0 contract ratification.

export type GatewayStatus = 'ACTIVE' | 'DEGRADED' | 'DOWN';
export type EndpointStatus = 'AVAILABLE' | 'DEGRADED' | 'UNAVAILABLE';
export type CallOutcome = 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'CIRCUIT_OPEN';

export interface GatewayStatusResponse {
  status: GatewayStatus;
  version: string;
  uptime: string;
  activeConnections: number;
  circuitBreaker: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  rateLimitRemaining: number;
  checkedAt: string;
}

export interface EcosystemEndpoint {
  id: string;
  name: string;
  domain: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: EndpointStatus;
  latencyMs: number;
  description: string;
  requiresAuth: boolean;
  version: string;
}

export interface EndpointListResponse {
  count: number;
  endpoints: EcosystemEndpoint[];
}

export interface GatewayCallRequest {
  payload?: Record<string, unknown>;
}

export interface GatewayCallResponse {
  endpointId: string;
  outcome: CallOutcome;
  statusCode: number;
  latencyMs: number;
  requestId: string;
  calledAt: string;
  response: Record<string, unknown>;
}

export interface GatewayLogEntry {
  id: string;
  requestId: string;
  endpointId: string;
  endpointName: string;
  method: string;
  path: string;
  outcome: CallOutcome;
  statusCode: number;
  latencyMs: number;
  actor: string;
  calledAt: string;
}

export interface GatewayLogResponse {
  count: number;
  entries: GatewayLogEntry[];
}

export type HealthMetricStatus = 'OK' | 'DEGRADED' | 'DOWN';

export interface GatewayHealthMetric {
  service: string;
  status: HealthMetricStatus;
  latencyMs: number;
  errorRate: number;
  availability: number;
  checkedAt: string;
}

export interface GatewayHealthResponse {
  overall: HealthMetricStatus;
  metrics: GatewayHealthMetric[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ENDPOINTS: EcosystemEndpoint[] = [
  {
    id: 'ep-identity',
    name: 'Identity Service',
    domain: 'global-ecosystem',
    path: '/identity/v1/verify',
    method: 'POST',
    status: 'AVAILABLE',
    latencyMs: 38,
    description: 'Verifies creator identity tokens against the Global Ecosystem identity registry.',
    requiresAuth: true,
    version: 'v1',
  },
  {
    id: 'ep-security',
    name: 'Security Gateway',
    domain: 'global-ecosystem',
    path: '/security/v1/audit',
    method: 'POST',
    status: 'AVAILABLE',
    latencyMs: 22,
    description: 'Submits security audit events to the Global Ecosystem security log.',
    requiresAuth: true,
    version: 'v1',
  },
  {
    id: 'ep-ai-core',
    name: 'AI Core',
    domain: 'global-ecosystem',
    path: '/ai/v2/inference',
    method: 'POST',
    status: 'AVAILABLE',
    latencyMs: 210,
    description: 'Runs inference requests on the Global Ecosystem AI Core (GPT-4o backed).',
    requiresAuth: true,
    version: 'v2',
  },
  {
    id: 'ep-wallet',
    name: 'Wallet Service',
    domain: 'global-ecosystem',
    path: '/wallet/v1/balance',
    method: 'GET',
    status: 'AVAILABLE',
    latencyMs: 45,
    description: 'Retrieves the creator wallet balance from the Global Ecosystem ledger.',
    requiresAuth: true,
    version: 'v1',
  },
  {
    id: 'ep-payment',
    name: 'Payment Processor',
    domain: 'global-ecosystem',
    path: '/payments/v1/initiate',
    method: 'POST',
    status: 'DEGRADED',
    latencyMs: 680,
    description: 'Initiates a payment transaction through the Global Ecosystem payment rails.',
    requiresAuth: true,
    version: 'v1',
  },
  {
    id: 'ep-notifications',
    name: 'Notification Bus',
    domain: 'global-ecosystem',
    path: '/notifications/v1/publish',
    method: 'POST',
    status: 'AVAILABLE',
    latencyMs: 18,
    description: 'Publishes events to the Global Ecosystem notification bus.',
    requiresAuth: false,
    version: 'v1',
  },
  {
    id: 'ep-governance',
    name: 'Governance Registry',
    domain: 'global-ecosystem',
    path: '/governance/v1/policies',
    method: 'GET',
    status: 'AVAILABLE',
    latencyMs: 55,
    description: 'Fetches active governance policies from the Global Ecosystem registry.',
    requiresAuth: true,
    version: 'v1',
  },
];

function generateLogEntry(i: number): GatewayLogEntry {
  const endpoints = MOCK_ENDPOINTS;
  const ep = endpoints[i % endpoints.length] as EcosystemEndpoint;
  const outcomes: CallOutcome[] = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'ERROR', 'TIMEOUT'];
  const outcome = outcomes[i % outcomes.length] as CallOutcome;
  const base = new Date('2026-08-09T09:00:00Z');
  base.setMinutes(base.getMinutes() - i * 3);
  return {
    id: `log-${String(i + 1).padStart(3, '0')}`,
    requestId: `req-${String(i + 1).padStart(6, '0')}`,
    endpointId: ep.id,
    endpointName: ep.name,
    method: ep.method,
    path: ep.path,
    outcome,
    statusCode: outcome === 'SUCCESS' ? 200 : outcome === 'TIMEOUT' ? 504 : 500,
    latencyMs: ep.latencyMs + Math.round(Math.sin(i) * 20),
    actor: i % 3 === 0 ? 'admin-1' : 'creator-1',
    calledAt: base.toISOString(),
  };
}

const MOCK_LOGS: GatewayLogEntry[] = Array.from({ length: 52 }, (_, i) => generateLogEntry(i));

const MOCK_HEALTH_METRICS: GatewayHealthMetric[] = [
  { service: 'Identity Service', status: 'OK', latencyMs: 38, errorRate: 0.2, availability: 99.97, checkedAt: new Date().toISOString() },
  { service: 'Security Gateway', status: 'OK', latencyMs: 22, errorRate: 0.1, availability: 99.99, checkedAt: new Date().toISOString() },
  { service: 'AI Core', status: 'OK', latencyMs: 210, errorRate: 0.8, availability: 99.91, checkedAt: new Date().toISOString() },
  { service: 'Wallet Service', status: 'OK', latencyMs: 45, errorRate: 0.3, availability: 99.95, checkedAt: new Date().toISOString() },
  { service: 'Payment Processor', status: 'DEGRADED', latencyMs: 680, errorRate: 3.4, availability: 97.80, checkedAt: new Date().toISOString() },
  { service: 'Notification Bus', status: 'OK', latencyMs: 18, errorRate: 0.0, availability: 100.0, checkedAt: new Date().toISOString() },
];

let callCounter = 1000;

// ─── Service functions ────────────────────────────────────────────────────────

export async function getGatewayStatus(): Promise<GatewayStatusResponse> {
  return {
    status: 'ACTIVE',
    version: '1.4.2',
    uptime: '14d 6h 22m',
    activeConnections: 7,
    circuitBreaker: 'CLOSED',
    rateLimitRemaining: 4872,
    checkedAt: new Date().toISOString(),
  };
}

export async function listEndpoints(): Promise<EndpointListResponse> {
  return { count: MOCK_ENDPOINTS.length, endpoints: MOCK_ENDPOINTS };
}

export async function callEndpoint(endpointId: string, _payload: GatewayCallRequest): Promise<GatewayCallResponse | null> {
  const endpoint = MOCK_ENDPOINTS.find((e) => e.id === endpointId);
  if (!endpoint) return null;

  callCounter++;
  const isPayment = endpoint.status === 'DEGRADED';
  const outcome: CallOutcome = isPayment ? 'TIMEOUT' : 'SUCCESS';

  const entry: GatewayLogEntry = {
    id: `log-live-${callCounter}`,
    requestId: `req-${callCounter}`,
    endpointId: endpoint.id,
    endpointName: endpoint.name,
    method: endpoint.method,
    path: endpoint.path,
    outcome,
    statusCode: outcome === 'SUCCESS' ? 200 : 504,
    latencyMs: endpoint.latencyMs + Math.round(Math.random() * 30),
    actor: 'creator-1',
    calledAt: new Date().toISOString(),
  };
  MOCK_LOGS.unshift(entry);

  return {
    endpointId: endpoint.id,
    outcome,
    statusCode: entry.statusCode,
    latencyMs: entry.latencyMs,
    requestId: entry.requestId,
    calledAt: entry.calledAt,
    response: outcome === 'SUCCESS'
      ? { ok: true, message: `Mock response from ${endpoint.name}`, data: { timestamp: entry.calledAt } }
      : { ok: false, error: 'Gateway timeout — upstream service did not respond in time.' },
  };
}

export async function getGatewayLogs(): Promise<GatewayLogResponse> {
  const entries = MOCK_LOGS.slice(0, 50);
  return { count: entries.length, entries };
}

export async function getGatewayHealth(): Promise<GatewayHealthResponse> {
  const overall: HealthMetricStatus = MOCK_HEALTH_METRICS.some((m) => m.status === 'DOWN')
    ? 'DOWN'
    : MOCK_HEALTH_METRICS.some((m) => m.status === 'DEGRADED')
    ? 'DEGRADED'
    : 'OK';
  return { overall, metrics: MOCK_HEALTH_METRICS };
=======
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
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
