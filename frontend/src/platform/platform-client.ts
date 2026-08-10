import type {
  GlobalEcosystemConnectionStatus,
  HealthStatus,
  PlatformFoundationStatus,
  PlatformManifest,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: {
    correlationId: string;
    timestamp: string;
  };
}

interface ReadyResponse {
  status: 'READY';
  checks: {
    environment: 'VALID';
    platformManifest: 'AVAILABLE';
    globalEcosystem: 'NOT_CONFIGURED' | 'NOT_VERIFIED';
  };
}

interface LiveResponse {
  status: 'ALIVE';
}

export interface PlatformFoundationClient {
  loadFoundationStatus(signal?: AbortSignal): Promise<PlatformFoundationStatus>;
}

export class HttpPlatformFoundationClient implements PlatformFoundationClient {
  constructor(private readonly baseUrl: string) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Platform API returned ${response.status}`);
    const envelope = (await response.json()) as ApiEnvelope<T>;
    return envelope.data;
  }

  async loadFoundationStatus(signal?: AbortSignal): Promise<PlatformFoundationStatus> {
    const [manifest, live, ready, connection] = await Promise.all([
      this.get<PlatformManifest>('/platform/manifest', signal),
      this.get<LiveResponse>('/health/live', signal),
      this.get<ReadyResponse>('/health/ready', signal),
      this.get<GlobalEcosystemConnectionStatus>('/platform/compatibility', signal),
    ]);

    const health: HealthStatus = {
      live: live.status,
      ready: ready.status,
      environment: ready.checks.environment,
    };
    return { manifest, health, connection };
  }
}

export function createPlatformFoundationClient(): PlatformFoundationClient {
  const configuredBaseUrl =
    import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim() ||
    'https://aiarbitech-youtube-os-production.up.railway.app/api/v1';
  return new HttpPlatformFoundationClient(configuredBaseUrl || '/api/v1');
}
