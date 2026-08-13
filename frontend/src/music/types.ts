export type MusicLicense = 'ROYALTY_FREE' | 'ATTRIBUTION_REQUIRED' | 'PREMIUM';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  durationSeconds: number;
  license: MusicLicense;
  tags: readonly string[];
}

export interface MusicClient {
  browse(genre?: string, signal?: AbortSignal): Promise<MusicTrack[]>;
  search(query: string, signal?: AbortSignal): Promise<MusicTrack[]>;
}
