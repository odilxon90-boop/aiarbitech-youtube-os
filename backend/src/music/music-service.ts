import { PlatformError } from '../shared/errors.js';

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

export interface MusicUseAuthorization {
  trackId: string;
  licensed: true;
  license: Exclude<MusicLicense, 'PREMIUM'>;
  commercialUse: boolean;
  attribution: string | null;
}

const tracks: readonly MusicTrack[] = [
  { id: 'track-sunrise', title: 'Sunrise Circuit', artist: 'Ari Nova', genre: 'Electronic', durationSeconds: 184, license: 'ROYALTY_FREE', tags: ['upbeat', 'technology', 'intro'] },
  { id: 'track-acoustic', title: 'Open Notebook', artist: 'Mila Hart', genre: 'Acoustic', durationSeconds: 211, license: 'ATTRIBUTION_REQUIRED', tags: ['calm', 'education', 'vlog'] },
  { id: 'track-cinematic', title: 'Northern Horizon', artist: 'Kaito Sky', genre: 'Cinematic', durationSeconds: 236, license: 'PREMIUM', tags: ['dramatic', 'travel', 'trailer'] },
  { id: 'track-beat', title: 'Creator Beat', artist: 'Lumen', genre: 'Hip Hop', durationSeconds: 152, license: 'ROYALTY_FREE', tags: ['energetic', 'shorts', 'lifestyle'] },
];

export class MusicService {
  browse(genre?: string): readonly MusicTrack[] {
    const normalizedGenre = genre?.trim().toLowerCase();
    return normalizedGenre ? tracks.filter((track) => track.genre.toLowerCase() === normalizedGenre) : tracks;
  }

  search(query: string): readonly MusicTrack[] {
    const normalizedQuery = query.trim().toLowerCase();
    return tracks.filter((track) =>
      [track.title, track.artist, track.genre, ...track.tags].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }

  authorizeUse(id: string, commercialUse: boolean): MusicUseAuthorization {
    const track = this.find(id);
    if (track.license === 'PREMIUM') {
      throw new PlatformError(
        403,
        'MUSIC_LICENSE_RESTRICTED',
        `Track ${id} requires a premium license before it can be used.`,
      );
    }
    return {
      trackId: track.id,
      licensed: true,
      license: track.license,
      commercialUse,
      attribution: track.license === 'ATTRIBUTION_REQUIRED' ? `${track.artist} — ${track.title}` : null,
    };
  }

  private find(id: string): MusicTrack {
    const track = tracks.find((item) => item.id === id);
    if (!track) throw new PlatformError(404, 'MUSIC_TRACK_NOT_FOUND', `Music track ${id} was not found.`);
    return track;
  }
}
