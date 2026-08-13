import type { MusicClient, MusicTrack } from './types';

interface ApiEnvelope<T> { data: T; }

export class HttpMusicClient implements MusicClient {
  constructor(private readonly baseUrl: string, private readonly token = 'mock-creator-token') {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, { headers: { Accept: 'application/json', Authorization: `Bearer ${this.token}` }, ...(signal ? { signal } : {}) });
    if (!response.ok) throw new Error(`Music API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  browse(genre?: string, signal?: AbortSignal): Promise<MusicTrack[]> {
    return this.get(`/music${genre ? `?genre=${encodeURIComponent(genre)}` : ''}`, signal);
  }

  search(query: string, signal?: AbortSignal): Promise<MusicTrack[]> {
    return this.get(`/music/search?q=${encodeURIComponent(query)}`, signal);
  }
}

export function createMusicClient(): MusicClient {
  return new HttpMusicClient(import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim() || '/api/v1');
}
