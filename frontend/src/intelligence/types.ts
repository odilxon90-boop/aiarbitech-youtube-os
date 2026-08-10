export interface CreatorProfile {
  name: string;
  level: string;
  experience: string;
  niche: string;
}

export interface SkillAssessment {
  name: string;
  score: number;
}

export interface Strength {
  id: string;
  title: string;
  description: string;
}

export interface Weakness {
  id: string;
  title: string;
  description: string;
}

export interface Recommendation {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
}

export interface ProfileResponse {
  profile: CreatorProfile;
}

export interface SkillsResponse {
  skills: SkillAssessment[];
}

export interface StrengthsResponse {
  strengths: Strength[];
}

export interface WeaknessesResponse {
  weaknesses: Weakness[];
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export interface IntelligenceSummary {
  profile: CreatorProfile;
  skills: SkillAssessment[];
  strengths: Strength[];
  weaknesses: Weakness[];
  recommendations: Recommendation[];
}
