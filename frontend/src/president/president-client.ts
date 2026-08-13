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
  loadHealth(signal?: AbortSignal): Promise<HealthMetric[]>;
  loadRevenue(signal?: AbortSignal): Promise<RevenueOverview>;
  loadChannels(signal?: AbortSignal): Promise<ChannelStat[]>;
  loadAiStatus(signal?: AbortSignal): Promise<AIStatus[]>;
  loadRisks(signal?: AbortSignal): Promise<RiskAlert[]>;
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

  loadHealth(signal?: AbortSignal): Promise<HealthMetric[]> {
    return this.get<HealthMetric[]>('/president/health', signal);
  }

  loadRevenue(signal?: AbortSignal): Promise<RevenueOverview> {
    return this.get<RevenueOverview>('/president/revenue', signal);
  }

  loadChannels(signal?: AbortSignal): Promise<ChannelStat[]> {
    return this.get<ChannelStat[]>('/president/channels', signal);
  }

  loadAiStatus(signal?: AbortSignal): Promise<AIStatus[]> {
    return this.get<AIStatus[]>('/president/ai-status', signal);
  }

  loadRisks(signal?: AbortSignal): Promise<RiskAlert[]> {
    return this.get<RiskAlert[]>('/president/risks', signal);
  }
}

export function createPresidentClient(): PresidentClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpPresidentClient(configuredBaseUrl || '/api/v1');
}
