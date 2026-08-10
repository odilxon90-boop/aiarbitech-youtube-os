import type {
  GenreTrendsResponse,
  GenreRecommendationsResponse,
  GenrePopularityResponse,
  GenreDetailsResponse,
  GenreSummary,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface GenreClient {
  loadTrends(signal?: AbortSignal): Promise<GenreTrendsResponse>;
  loadRecommendations(signal?: AbortSignal): Promise<GenreRecommendationsResponse>;
  loadPopularity(signal?: AbortSignal): Promise<GenrePopularityResponse>;
  loadGenreDetails(id: string, signal?: AbortSignal): Promise<GenreDetailsResponse>;
  loadSummary(signal?: AbortSignal): Promise<GenreSummary>;
}

export class HttpGenreClient implements GenreClient {
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
    if (!response.ok) throw new Error(`Genre API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadTrends(signal?: AbortSignal): Promise<GenreTrendsResponse> {
    return this.get<GenreTrendsResponse>('/genre/trends', signal);
  }

  loadRecommendations(signal?: AbortSignal): Promise<GenreRecommendationsResponse> {
    return this.get<GenreRecommendationsResponse>('/genre/recommendations', signal);
  }

  loadPopularity(signal?: AbortSignal): Promise<GenrePopularityResponse> {
    return this.get<GenrePopularityResponse>('/genre/popularity', signal);
  }

  loadGenreDetails(id: string, signal?: AbortSignal): Promise<GenreDetailsResponse> {
    return this.get<GenreDetailsResponse>(`/genre/${id}/details`, signal);
  }

  async loadSummary(signal?: AbortSignal): Promise<GenreSummary> {
    const [trendsRes, recsRes, popRes] = await Promise.all([
      this.loadTrends(signal),
      this.loadRecommendations(signal),
      this.loadPopularity(signal),
    ]);
    return {
      trends: trendsRes.genres,
      recommendations: recsRes.items,
      popularity: popRes.genres,
    };
  }
}

export function createGenreClient(): GenreClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpGenreClient(configuredBaseUrl || '/api/v1');
}
