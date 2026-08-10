// Integration Gateway frontend types. Mirrors the backend gateway service DTOs.

export type GatewayStatus = 'ACTIVE' | 'DEGRADED' | 'DOWN';
export type EndpointStatus = 'AVAILABLE' | 'DEGRADED' | 'UNAVAILABLE';
export type CallOutcome = 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'CIRCUIT_OPEN';
export type HealthMetricStatus = 'OK' | 'DEGRADED' | 'DOWN';

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

export interface GatewaySummary {
  status: GatewayStatusResponse;
  endpoints: EcosystemEndpoint[];
  logs: GatewayLogEntry[];
  health: GatewayHealthResponse;
}
