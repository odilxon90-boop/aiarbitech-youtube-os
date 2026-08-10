import type {
  HeirDashboard,
  HealthMetric,
  RevenueOverview,
  ChannelStat,
  AIStatus,
  RiskAlert,
  TrainingProgress,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface HeirClient {
  loadDashboard(signal?: AbortSignal): Promise<HeirDashboard>;
  loadHealth(signal?: AbortSignal): Promise<{ health: HealthMetric[] }>;
  loadRevenue(signal?: AbortSignal): Promise<RevenueOverview>;
  loadChannels(signal?: AbortSignal): Promise<{ channels: ChannelStat[] }>;
  loadAiStatus(signal?: AbortSignal): Promise<{ aiStatus: AIStatus[] }>;
  loadRisks(signal?: AbortSignal): Promise<{ risks: RiskAlert[] }>;
  loadTraining(signal?: AbortSignal): Promise<TrainingProgress>;
}

export class HttpHeirClient implements HeirClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-heir-token',
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Heir API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadDashboard(signal?: AbortSignal): Promise<HeirDashboard> {
    return this.get<HeirDashboard>('/heir/dashboard', signal);
  }

  loadHealth(signal?: AbortSignal): Promise<{ health: HealthMetric[] }> {
    return this.get<{ health: HealthMetric[] }>('/heir/health', signal);
  }

  loadRevenue(signal?: AbortSignal): Promise<RevenueOverview> {
    return this.get<RevenueOverview>('/heir/revenue', signal);
  }

  loadChannels(signal?: AbortSignal): Promise<{ channels: ChannelStat[] }> {
    return this.get<{ channels: ChannelStat[] }>('/heir/channels', signal);
  }

  loadAiStatus(signal?: AbortSignal): Promise<{ aiStatus: AIStatus[] }> {
    return this.get<{ aiStatus: AIStatus[] }>('/heir/ai-status', signal);
  }

  loadRisks(signal?: AbortSignal): Promise<{ risks: RiskAlert[] }> {
    return this.get<{ risks: RiskAlert[] }>('/heir/risks', signal);
  }

  loadTraining(signal?: AbortSignal): Promise<TrainingProgress> {
    return this.get<TrainingProgress>('/heir/training', signal);
  }
}

export function createHeirClient(): HeirClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpHeirClient(configuredBaseUrl || '/api/v1');
}
