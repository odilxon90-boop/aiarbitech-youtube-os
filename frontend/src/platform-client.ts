export interface PlatformApiClient {
  getUsers(signal?: AbortSignal): Promise<unknown>;
  getPlatforms(signal?: AbortSignal): Promise<unknown>;
  getLogs(signal?: AbortSignal): Promise<unknown>;
  getCreatorStats(signal?: AbortSignal): Promise<unknown>;
}

interface ApiEnvelope<T> {
  data: T;
}

export class HttpPlatformApiClient implements PlatformApiClient {
  constructor(
    private readonly baseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim() || '/api/v1',
    private readonly token = import.meta.env.VITE_PLATFORM_API_TOKEN?.trim() || '',
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        Accept: 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Platform API returned ${response.status} for ${path}`);
    const envelope = (await response.json()) as ApiEnvelope<T>;
    return envelope.data;
  }

  getUsers(signal?: AbortSignal) {
    return this.get('/admin/users', signal);
  }

  getPlatforms(signal?: AbortSignal) {
    return this.get('/admin/platforms', signal);
  }

  getLogs(signal?: AbortSignal) {
    return this.get('/admin/logs', signal);
  }

  getCreatorStats(signal?: AbortSignal) {
    return this.get('/creator/stats', signal);
  }
}

export function createPlatformApiClient(): PlatformApiClient {
  return new HttpPlatformApiClient();
}
