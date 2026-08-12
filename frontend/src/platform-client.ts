export interface CreatorStats {
  kpis?: Array<{ label: string; value: string; delta: number }>;
  [key: string]: unknown;
}

export interface CreatorRevenue {
  points: Array<{ date: string; value: number }>;
}

export interface CreatorVideo {
  id: string;
  title: string;
  views: number;
  ctr: number;
}

export interface CreatorVideos {
  count: number;
  videos: CreatorVideo[];
}

export interface VideoPlan {
  status: string;
  plan: { hook: string; scenes: string[]; nextAction: string };
}

export interface YouTubeStatus {
  status: 'CONFIGURED' | 'DEGRADED';
  mode: 'API_KEY' | 'OAUTH' | 'MOCK_FALLBACK';
  readConfigured: boolean;
  uploadConfigured: boolean;
  fallbackEnabled: boolean;
  checkedAt: string;
}

export interface PlatformApiClient {
  getUsers(signal?: AbortSignal): Promise<unknown>;
  getPlatforms(signal?: AbortSignal): Promise<unknown>;
  getLogs(signal?: AbortSignal): Promise<unknown>;
  getCreatorStats(signal?: AbortSignal): Promise<CreatorStats>;
  getRevenue(signal?: AbortSignal): Promise<CreatorRevenue>;
  getVideos(signal?: AbortSignal): Promise<CreatorVideos>;
  createVideoPlan(prompt: string, signal?: AbortSignal): Promise<VideoPlan>;
  getYouTubeStatus(signal?: AbortSignal): Promise<YouTubeStatus>;
}

interface ApiEnvelope<T> {
  data: T;
}

export class HttpPlatformApiClient implements PlatformApiClient {
  constructor(
    private readonly baseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim() || '/api/v1',
    private readonly token =
      import.meta.env.VITE_PLATFORM_API_TOKEN?.trim() ||
      (typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') ?? '' : ''),
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

  private async post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Platform API returned ${response.status} for ${path}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
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

  getCreatorStats(signal?: AbortSignal): Promise<CreatorStats> {
    return this.get('/creator/stats', signal);
  }

  getRevenue(signal?: AbortSignal): Promise<CreatorRevenue> {
    return this.get('/creator/revenue', signal);
  }

  getVideos(signal?: AbortSignal): Promise<CreatorVideos> {
    return this.get('/creator/videos', signal);
  }

  createVideoPlan(prompt: string, signal?: AbortSignal): Promise<VideoPlan> {
    return this.post('/creator/plan', { prompt }, signal);
  }

  getYouTubeStatus(signal?: AbortSignal): Promise<YouTubeStatus> {
    return this.get('/youtube/status', signal);
  }
}

export function createPlatformApiClient(): PlatformApiClient {
  return new HttpPlatformApiClient();
}
