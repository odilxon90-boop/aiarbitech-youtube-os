import type {
  PresidentDashboard,
  HealthMetric,
  RevenueOverview,
  ChannelStat,
  AIStatus,
  RiskAlert,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface PresidentClient {
  loadDashboard(signal?: AbortSignal): Promise<PresidentDashboard>;
  loadHealth(signal?: AbortSignal): Promise<{ health: HealthMetric[] }>;
  loadRevenue(signal?: AbortSignal): Promise<RevenueOverview>;
  loadChannels(signal?: AbortSignal): Promise<{ channels: ChannelStat[] }>;
  loadAiStatus(signal?: AbortSignal): Promise<{ aiStatus: AIStatus[] }>;
  loadRisks(signal?: AbortSignal): Promise<{ risks: RiskAlert[] }>;
}

export class HttpPresidentClient implements PresidentClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-president-token',
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`President API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadDashboard(signal?: AbortSignal): Promise<PresidentDashboard> {
    return this.get<PresidentDashboard>('/president/dashboard', signal);
  }

  loadHealth(signal?: AbortSignal): Promise<{ health: HealthMetric[] }> {
    return this.get<{ health: HealthMetric[] }>('/president/health', signal);
  }

  loadRevenue(signal?: AbortSignal): Promise<RevenueOverview> {
    return this.get<RevenueOverview>('/president/revenue', signal);
  }

  loadChannels(signal?: AbortSignal): Promise<{ channels: ChannelStat[] }> {
    return this.get<{ channels: ChannelStat[] }>('/president/channels', signal);
  }

  loadAiStatus(signal?: AbortSignal): Promise<{ aiStatus: AIStatus[] }> {
    return this.get<{ aiStatus: AIStatus[] }>('/president/ai-status', signal);
  }

  loadRisks(signal?: AbortSignal): Promise<{ risks: RiskAlert[] }> {
    return this.get<{ risks: RiskAlert[] }>('/president/risks', signal);
  }
}

export function createPresidentClient(): PresidentClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpPresidentClient(configuredBaseUrl || '/api/v1');
}
