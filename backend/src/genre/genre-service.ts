interface TrendPoint {
  date: string;
  value: number;
}

interface TrendGenre {
  id: string;
  name: string;
  currentScore: number;
  points: TrendPoint[];
}

interface RecommendedGenre {
  id: string;
  name: string;
  confidence: number;
  reason: string;
  tags: string[];
}

interface PopularityGenre {
  id: string;
  name: string;
  score: number;
  rank: number;
  change: 'UP' | 'DOWN' | 'STABLE';
}

interface GenreDetails {
  id: string;
  name: string;
  styleKeywords: string[];
  trendingArtists: string[];
  trendDirection: 'RISING' | 'STABLE' | 'DECLINING';
}

const baseGenres = [
  'Lofi', 'Synthwave', 'Afrobeats', 'Drill', 'Amapiano', 'Jazzhop', 'EDM', 'Ambient', 'Indie Pop', 'Cinematic',
];

const genreDetails = new Map<string, GenreDetails>([
  ['genre-lofi', { id: 'genre-lofi', name: 'Lofi', styleKeywords: ['chill', 'study', 'beats'], trendingArtists: ['Artist One', 'Artist Two'], trendDirection: 'RISING' }],
  ['genre-synthwave', { id: 'genre-synthwave', name: 'Synthwave', styleKeywords: ['retro', 'neon', '80s'], trendingArtists: ['Night Driver', 'Solar Grid'], trendDirection: 'STABLE' }],
  ['genre-afrobeats', { id: 'genre-afrobeats', name: 'Afrobeats', styleKeywords: ['dance', 'global', 'summer'], trendingArtists: ['Luna Vox', 'Kairo Pulse'], trendDirection: 'RISING' }],
]);

function pointsFor(offset: number): TrendPoint[] {
  return Array.from({ length: 30 }, (_, index) => ({
    date: `2026-07-${String(index + 1).padStart(2, '0')}`,
    value: 50 + offset + (index % 7),
  }));
}

export class GenreService {
  private readonly recommendationCache = new Map<string, { channelId: string; recommendations: RecommendedGenre[]; generatedAt: string }>();

  getTrends(): { genres: TrendGenre[] } {
    return {
      genres: baseGenres.map((name, index) => ({
        id: `genre-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        currentScore: 60 + index * 3,
        points: pointsFor(index),
      })),
    };
  }

  getRecommendations(): { count: number; items: RecommendedGenre[] } {
    const items = baseGenres.slice(0, 6).map((name, index) => ({
      id: `rec-${index + 1}`,
      name,
      confidence: 95 - index * 6,
      reason: `${name} aligns with current creator momentum and audience signals.`,
      tags: ['momentum', 'audience-fit', 'growth'].slice(0, 2 + (index % 2)),
    }));
    return { count: items.length, items };
  }

  getLegacyRecommendations(channelId: string): { channelId: string; recommendations: RecommendedGenre[]; generatedAt: string; cacheHit: boolean } {
    const cacheKey = channelId.toLowerCase();
    const cached = this.recommendationCache.get(cacheKey);
    if (cached) {
      return { ...cached, cacheHit: true };
    }

    const recommendations = this.getRecommendations().items;
    const result = { channelId, recommendations, generatedAt: new Date().toISOString() };
    this.recommendationCache.set(cacheKey, result);
    return { ...result, cacheHit: false };
  }

  getPopularity(): { genres: PopularityGenre[] } {
    return {
      genres: baseGenres.map((name, index) => ({
        id: `genre-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        score: 100 - index * 4,
        rank: index + 1,
        change: index % 3 === 0 ? 'UP' : index % 3 === 1 ? 'STABLE' : 'DOWN',
      })),
    };
  }

  getDetails(genreId: string): GenreDetails | undefined {
    return genreDetails.get(genreId);
  }
}
