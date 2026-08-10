// AI Music Genre Recommendation service. Returns mock/stub data only; no real
// music API, no persistence, no business runtime. Replace with data source after Gate 0.

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

// ─── Mock data ────────────────────────────────────────────────────────────────

function trendPoints(base: number, len = 30): GenreTrendPoint[] {
  return Array.from({ length: len }, (_, i) => {
    const date = new Date('2026-07-11');
    date.setUTCDate(date.getUTCDate() + i);
    const value = base + Math.sin(i * 0.4) * 6 + i * 0.3;
    return { date: date.toISOString().slice(0, 10), score: Number(value.toFixed(1)) };
  });
}

const GENRES: GenreDetails[] = [
  {
    id: 'genre-lofi',
    name: 'Lo-Fi Hip Hop',
    description: 'Relaxed, low-fidelity beats for studying and focus sessions.',
    popularityScore: 92,
    trendDirection: 'RISING',
    styleKeywords: ['chill', 'study', 'focus', 'jazz-infused', 'vinyl-crackle'],
    trendingArtists: [
      { name: 'Chillhop Music', subscribers: '4.2M' },
      { name: 'Lofi Girl', subscribers: '13.1M' },
    ],
    audienceAgeRange: '18–34',
    avgVideoLength: '1h 02m',
  },
  {
    id: 'genre-synthwave',
    name: 'Synthwave',
    description: 'Retro-futuristic electronic music inspired by 80s soundtracks.',
    popularityScore: 84,
    trendDirection: 'RISING',
    styleKeywords: ['retro', '80s', 'neon', 'cinematic', 'analog-synths'],
    trendingArtists: [
      { name: 'Kavinsky', subscribers: '890K' },
      { name: 'Gunship', subscribers: '710K' },
    ],
    audienceAgeRange: '25–44',
    avgVideoLength: '4m 22s',
  },
  {
    id: 'genre-phonk',
    name: 'Phonk',
    description: 'Dark, aggressive Memphis rap-influenced electronic music.',
    popularityScore: 78,
    trendDirection: 'RISING',
    styleKeywords: ['dark', 'drift', 'aggressive', 'trap-influenced', 'memphis'],
    trendingArtists: [
      { name: 'GHOSTEMANE', subscribers: '3.5M' },
      { name: 'Soudiere', subscribers: '1.2M' },
    ],
    audienceAgeRange: '16–28',
    avgVideoLength: '2m 48s',
  },
  {
    id: 'genre-hyperpop',
    name: 'Hyperpop',
    description: 'Maximalist pop with heavy digital distortion and exaggerated aesthetics.',
    popularityScore: 71,
    trendDirection: 'STABLE',
    styleKeywords: ['maximalist', 'glitchy', 'digital', 'distorted', 'chaotic'],
    trendingArtists: [
      { name: '100 gecs', subscribers: '1.8M' },
      { name: 'Charli XCX', subscribers: '9.4M' },
    ],
    audienceAgeRange: '15–26',
    avgVideoLength: '2m 31s',
  },
  {
    id: 'genre-ambient',
    name: 'Ambient',
    description: 'Atmospheric, texture-driven music for deep focus and meditation.',
    popularityScore: 68,
    trendDirection: 'STABLE',
    styleKeywords: ['atmospheric', 'meditative', 'texture', 'soundscape', 'calm'],
    trendingArtists: [
      { name: 'Brian Eno', subscribers: '620K' },
      { name: 'Stars of the Lid', subscribers: '290K' },
    ],
    audienceAgeRange: '22–45',
    avgVideoLength: '45m 10s',
  },
  {
    id: 'genre-afrobeats',
    name: 'Afrobeats',
    description: 'West African-influenced popular music with danceable rhythms.',
    popularityScore: 88,
    trendDirection: 'RISING',
    styleKeywords: ['danceable', 'upbeat', 'rhythmic', 'west-african', 'fusion'],
    trendingArtists: [
      { name: 'Burna Boy', subscribers: '5.7M' },
      { name: 'Wizkid', subscribers: '4.9M' },
    ],
    audienceAgeRange: '18–35',
    avgVideoLength: '3m 55s',
  },
  {
    id: 'genre-dark-academia',
    name: 'Dark Academia',
    description: 'Classical and neo-classical music suited for intellectual aesthetics.',
    popularityScore: 65,
    trendDirection: 'RISING',
    styleKeywords: ['classical', 'gothic', 'scholarly', 'orchestral', 'moody'],
    trendingArtists: [
      { name: 'Einaudi', subscribers: '2.1M' },
      { name: 'Johann Johannsson', subscribers: '480K' },
    ],
    audienceAgeRange: '17–32',
    avgVideoLength: '52m 00s',
  },
  {
    id: 'genre-city-pop',
    name: 'City Pop',
    description: 'Japanese 80s pop revival with smooth, urban grooves.',
    popularityScore: 76,
    trendDirection: 'RISING',
    styleKeywords: ['japanese', '80s', 'smooth', 'nostalgic', 'urban'],
    trendingArtists: [
      { name: 'Mariya Takeuchi', subscribers: '3.3M' },
      { name: 'Tatsuro Yamashita', subscribers: '1.6M' },
    ],
    audienceAgeRange: '20–38',
    avgVideoLength: '4m 12s',
  },
  {
    id: 'genre-drill',
    name: 'Drill',
    description: 'Hard-hitting trap subgenre originating from Chicago and UK.',
    popularityScore: 82,
    trendDirection: 'STABLE',
    styleKeywords: ['dark', 'trap', 'heavy-bass', 'uk-drill', 'chicago'],
    trendingArtists: [
      { name: 'Pop Smoke', subscribers: '12.3M' },
      { name: 'Central Cee', subscribers: '5.8M' },
    ],
    audienceAgeRange: '15–28',
    avgVideoLength: '3m 10s',
  },
  {
    id: 'genre-indie-folk',
    name: 'Indie Folk',
    description: 'Intimate acoustic-driven songwriting with indie sensibility.',
    popularityScore: 62,
    trendDirection: 'DECLINING',
    styleKeywords: ['acoustic', 'intimate', 'lyrical', 'organic', 'handcrafted'],
    trendingArtists: [
      { name: 'Bon Iver', subscribers: '3.9M' },
      { name: 'Fleet Foxes', subscribers: '2.1M' },
    ],
    audienceAgeRange: '22–40',
    avgVideoLength: '3m 48s',
  },
];

const GENRE_TRENDS: GenreTrend[] = GENRES.map((g) => ({
  id: g.id,
  name: g.name,
  currentScore: g.popularityScore,
  delta: g.trendDirection === 'RISING' ? 4.2 : g.trendDirection === 'DECLINING' ? -2.1 : 0.3,
  points: trendPoints(g.popularityScore - 8),
}));

const GENRE_RECOMMENDATIONS: GenreRecommendation[] = [
  {
    id: 'grec-1',
    name: 'Lo-Fi Hip Hop',
    confidence: 96,
    reason: 'Highest viewer retention in the AI & Productivity niche. Watch time per session exceeds 58 minutes.',
    tags: ['study', 'focus', 'chill'],
  },
  {
    id: 'grec-2',
    name: 'Synthwave',
    confidence: 88,
    reason: 'Rising engagement from tech and gaming audiences; strong cross-niche appeal.',
    tags: ['retro', '80s', 'cinematic'],
  },
  {
    id: 'grec-3',
    name: 'Afrobeats',
    confidence: 82,
    reason: 'Global audience growth of 34% YoY; strong Shorts performance.',
    tags: ['danceable', 'trending', 'global'],
  },
  {
    id: 'grec-4',
    name: 'City Pop',
    confidence: 77,
    reason: 'Nostalgia-driven virality on Shorts; correlates with high comment engagement.',
    tags: ['nostalgic', 'japanese', 'viral'],
  },
  {
    id: 'grec-5',
    name: 'Phonk',
    confidence: 71,
    reason: 'Dominant in automotive and fitness niches; trending 28% above baseline.',
    tags: ['dark', 'aggressive', 'trending'],
  },
  {
    id: 'grec-6',
    name: 'Dark Academia',
    confidence: 65,
    reason: 'Emerging aesthetic trend with high playlist save rates and repeat listens.',
    tags: ['classical', 'gothic', 'emerging'],
  },
];

const GENRE_POPULARITY: GenrePopularity[] = GENRES.map((g, i) => ({
  id: g.id,
  name: g.name,
  score: g.popularityScore,
  rank: i + 1,
  change: (
    g.trendDirection === 'RISING' ? 'UP' : g.trendDirection === 'DECLINING' ? 'DOWN' : 'STABLE'
  ) as GenrePopularity['change'],
})).sort((a, b) => b.score - a.score).map((g, i) => ({ ...g, rank: i + 1 }));

// ─── Service functions ────────────────────────────────────────────────────────

export async function getGenreTrends(): Promise<GenreTrendsResponse> {
  return { genres: GENRE_TRENDS };
}

export async function getGenreRecommendations(): Promise<GenreRecommendationsResponse> {
  return { count: GENRE_RECOMMENDATIONS.length, items: GENRE_RECOMMENDATIONS };
}

export async function getGenrePopularity(): Promise<GenrePopularityResponse> {
  return { genres: GENRE_POPULARITY };
}

export async function getGenreById(id: string): Promise<GenreDetailsResponse | null> {
  const genre = GENRES.find((g) => g.id === id);
  if (!genre) return null;
  return { genre };
}
