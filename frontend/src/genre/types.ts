// AI Music Genre types. Mirrors the backend genre service DTOs.

export interface GenreTrendPoint {
  date: string;
  score: number;
}

export interface GenreTrend {
  id: string;
  name: string;
  currentScore: number;
  delta: number;
  points: GenreTrendPoint[];
}

export interface GenreTrendsResponse {
  genres: GenreTrend[];
}

export interface GenreRecommendation {
  id: string;
  name: string;
  confidence: number;
  reason: string;
  tags: string[];
}

export interface GenreRecommendationsResponse {
  count: number;
  items: GenreRecommendation[];
}

export interface GenrePopularity {
  id: string;
  name: string;
  score: number;
  rank: number;
  change: 'UP' | 'DOWN' | 'STABLE';
}

export interface GenrePopularityResponse {
  genres: GenrePopularity[];
}

export interface GenreArtist {
  name: string;
  subscribers: string;
}

export interface GenreDetails {
  id: string;
  name: string;
  description: string;
  popularityScore: number;
  trendDirection: 'RISING' | 'STABLE' | 'DECLINING';
  styleKeywords: string[];
  trendingArtists: GenreArtist[];
  audienceAgeRange: string;
  avgVideoLength: string;
}

export interface GenreDetailsResponse {
  genre: GenreDetails;
}

export interface GenreSummary {
  trends: GenreTrend[];
  recommendations: GenreRecommendation[];
  popularity: GenrePopularity[];
}
