import type {
  IntelligenceSummary,
  ProfileResponse,
  SkillsResponse,
  StrengthsResponse,
  WeaknessesResponse,
  RecommendationsResponse,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface IntelligenceClient {
  loadProfile(signal?: AbortSignal): Promise<ProfileResponse>;
  loadSkills(signal?: AbortSignal): Promise<SkillsResponse>;
  loadStrengths(signal?: AbortSignal): Promise<StrengthsResponse>;
  loadWeaknesses(signal?: AbortSignal): Promise<WeaknessesResponse>;
  loadRecommendations(signal?: AbortSignal): Promise<RecommendationsResponse>;
  loadSummary(signal?: AbortSignal): Promise<IntelligenceSummary>;
}

export class HttpIntelligenceClient implements IntelligenceClient {
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
    if (!response.ok) throw new Error(`Intelligence API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadProfile(signal?: AbortSignal): Promise<ProfileResponse> {
    return this.get<ProfileResponse>('/intelligence/profile', signal);
  }

  loadSkills(signal?: AbortSignal): Promise<SkillsResponse> {
    return this.get<SkillsResponse>('/intelligence/skills', signal);
  }

  loadStrengths(signal?: AbortSignal): Promise<StrengthsResponse> {
    return this.get<StrengthsResponse>('/intelligence/strengths', signal);
  }

  loadWeaknesses(signal?: AbortSignal): Promise<WeaknessesResponse> {
    return this.get<WeaknessesResponse>('/intelligence/weaknesses', signal);
  }

  loadRecommendations(signal?: AbortSignal): Promise<RecommendationsResponse> {
    return this.get<RecommendationsResponse>('/intelligence/recommendations', signal);
  }

  async loadSummary(signal?: AbortSignal): Promise<IntelligenceSummary> {
    const [profile, skills, strengths, weaknesses, recommendations] = await Promise.all([
      this.loadProfile(signal),
      this.loadSkills(signal),
      this.loadStrengths(signal),
      this.loadWeaknesses(signal),
      this.loadRecommendations(signal),
    ]);
    return {
      profile: profile.profile,
      skills: skills.skills,
      strengths: strengths.strengths,
      weaknesses: weaknesses.weaknesses,
      recommendations: recommendations.recommendations,
    };
  }
}

export function createIntelligenceClient(): IntelligenceClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpIntelligenceClient(configuredBaseUrl || '/api/v1');
}
