import type {
  ProfileResponse,
  SkillsResponse,
  StrengthsResponse,
  WeaknessesResponse,
  RecommendationsResponse,
} from './intelligence-service.js';
import {
  getProfile,
  getSkills,
  getStrengths,
  getWeaknesses,
  getRecommendations,
} from './intelligence-service.js';

export interface IntelligenceController {
  getProfile(): Promise<ProfileResponse>;
  getSkills(): Promise<SkillsResponse>;
  getStrengths(): Promise<StrengthsResponse>;
  getWeaknesses(): Promise<WeaknessesResponse>;
  getRecommendations(): Promise<RecommendationsResponse>;
}

export const intelligenceController: IntelligenceController = {
  getProfile: () => getProfile(),
  getSkills: () => getSkills(),
  getStrengths: () => getStrengths(),
  getWeaknesses: () => getWeaknesses(),
  getRecommendations: () => getRecommendations(),
};
