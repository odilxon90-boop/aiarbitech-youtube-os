import type {
  GatewayStatusResponse,
  EndpointListResponse,
  GatewayCallResponse,
  GatewayLogResponse,
  GatewayHealthResponse,
  GatewaySummary,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface GatewayClient {
  loadStatus(signal?: AbortSignal): Promise<GatewayStatusResponse>;
  loadEndpoints(signal?: AbortSignal): Promise<EndpointListResponse>;
  callEndpoint(endpointId: string, payload?: Record<string, unknown>, signal?: AbortSignal): Promise<GatewayCallResponse>;
  loadLogs(signal?: AbortSignal): Promise<GatewayLogResponse>;
  loadHealth(signal?: AbortSignal): Promise<GatewayHealthResponse>;
  loadSummary(signal?: AbortSignal): Promise<GatewaySummary>;
}

export class HttpGatewayClient implements GatewayClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-admin-token',
  ) {}

  private async request<T>(path: string, method: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', Authorization: `Bearer ${this.token}` };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Gateway API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadStatus(signal?: AbortSignal): Promise<GatewayStatusResponse> {
    return this.request<GatewayStatusResponse>('/gateway/status', 'GET', undefined, signal);
  }

  loadEndpoints(signal?: AbortSignal): Promise<EndpointListResponse> {
    return this.request<EndpointListResponse>('/gateway/endpoints', 'GET', undefined, signal);
  }

  callEndpoint(endpointId: string, payload?: Record<string, unknown>, signal?: AbortSignal): Promise<GatewayCallResponse> {
    return this.request<GatewayCallResponse>(`/gateway/call/${endpointId}`, 'POST', { payload }, signal);
  }

  loadLogs(signal?: AbortSignal): Promise<GatewayLogResponse> {
    return this.request<GatewayLogResponse>('/gateway/logs', 'GET', undefined, signal);
  }

  loadHealth(signal?: AbortSignal): Promise<GatewayHealthResponse> {
    return this.request<GatewayHealthResponse>('/gateway/health', 'GET', undefined, signal);
  }

  async loadSummary(signal?: AbortSignal): Promise<GatewaySummary> {
    const [status, endpointsRes, logsRes, health] = await Promise.all([
      this.loadStatus(signal),
      this.loadEndpoints(signal),
      this.loadLogs(signal),
      this.loadHealth(signal),
    ]);
    return {
      status,
      endpoints: endpointsRes.endpoints,
      logs: logsRes.entries,
      health,
    };
  }
}

export function createGatewayClient(): GatewayClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpGatewayClient(configuredBaseUrl || '/api/v1');
}
