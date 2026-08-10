export interface GenreRecommendation {
  genre: string;
  score: number;
  rationale: string;
}

export interface GenreRecommendationResult {
  channelId: string;
  recommendations: readonly GenreRecommendation[];
  generatedAt: string;
  cacheHit: boolean;
}

const recommendations: readonly GenreRecommendation[] = [
  { genre: 'Education', score: 94, rationale: 'High evergreen search demand and strong fit for structured creator content.' },
  { genre: 'Technology', score: 89, rationale: 'Matches the channel audience interest in creator tools and workflows.' },
  { genre: 'Music', score: 78, rationale: 'Supports soundtrack and audio-rights topics with repeatable formats.' },
];

export class GenreService {
  private readonly cache = new Map<string, Omit<GenreRecommendationResult, 'cacheHit'>>();

  recommendationsFor(channelId: string): GenreRecommendationResult {
    const cacheKey = channelId.trim().toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached) return { ...cached, cacheHit: true };

    const result = {
      channelId,
      recommendations,
      generatedAt: new Date().toISOString(),
    };
    this.cache.set(cacheKey, result);
    return { ...result, cacheHit: false };
  }
}
