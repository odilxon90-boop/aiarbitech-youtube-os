import type { DashboardSummary, KpiSummary, RecommendationList } from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface DashboardClient {
  loadSummary(signal?: AbortSignal): Promise<DashboardSummary>;
  loadKpis(signal?: AbortSignal): Promise<KpiSummary>;
  loadRecommendations(signal?: AbortSignal): Promise<RecommendationList>;
}

export class HttpDashboardClient implements DashboardClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-creator-token',
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Dashboard API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadSummary(signal?: AbortSignal): Promise<DashboardSummary> {
    return this.get<DashboardSummary>('/dashboard/summary', signal);
  }

  loadKpis(signal?: AbortSignal): Promise<KpiSummary> {
    return this.get<KpiSummary>('/dashboard/kpi', signal);
  }

  loadRecommendations(signal?: AbortSignal): Promise<RecommendationList> {
    return this.get<RecommendationList>('/dashboard/recommendations', signal);
  }
}

export function createDashboardClient(): DashboardClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpDashboardClient(configuredBaseUrl || '/api/v1');
}