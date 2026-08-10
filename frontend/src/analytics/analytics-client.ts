import type {
  AnalyticsBundle,
  AnalyticsClient,
  AnalyticsPerformance,
  AnalyticsSummary,
  AnalyticsTrends,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export class HttpAnalyticsClient implements AnalyticsClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Analytics API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  async loadBundle(signal?: AbortSignal): Promise<AnalyticsBundle> {
    const [summary, trends, performance] = await Promise.all([
      this.get<AnalyticsSummary>('/analytics/summary', signal),
      this.get<AnalyticsTrends>('/analytics/trends', signal),
      this.get<AnalyticsPerformance>('/analytics/performance', signal),
    ]);
    return { summary, trends, performance };
  }
}

export type { AnalyticsClient } from './types';

export function createAnalyticsClient(): AnalyticsClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpAnalyticsClient(configuredBaseUrl || '/api/v1', 'mock-creator-token');
}