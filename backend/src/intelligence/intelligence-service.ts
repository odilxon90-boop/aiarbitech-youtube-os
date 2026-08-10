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

const MOCK_PROFILE: CreatorProfile = {
  name: 'Alex Creator',
  level: 'Intermediate',
  experience: '2 years',
  niche: 'AI Automations & Productivity',
};

const MOCK_SKILLS: SkillAssessment[] = [
  { name: 'Thumbnail Design', score: 82 },
  { name: 'Audience Retention', score: 74 },
  { name: 'SEO & Discovery', score: 68 },
  { name: 'Video Editing', score: 88 },
  { name: 'Community Engagement', score: 56 },
];

const MOCK_STRENGTHS: Strength[] = [
  { id: 's-1', title: 'High production quality', description: 'Consistent cinematic style with strong editing.' },
  { id: 's-2', title: 'Clear explanations', description: 'Complex topics are broken into simple steps.' },
  { id: 's-3', title: 'Niche authority', description: 'Deep knowledge of AI automation workflows.' },
];

const MOCK_WEAKNESSES: Weakness[] = [
  { id: 'w-1', title: 'Low community engagement', description: 'Comments and community posts are underutilized.' },
  { id: 'w-2', title: 'Inconsistent upload schedule', description: 'Gaps between uploads reduce algorithm momentum.' },
  { id: 'w-3', title: 'Weak end screens', description: 'End screens and cards do not drive enough session time.' },
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'r-1', priority: 'HIGH', title: 'Post on a fixed schedule', description: 'Increase upload frequency to 2x per week.' },
  { id: 'r-2', priority: 'HIGH', title: 'Reply to top comments', description: 'Boost engagement by replying within 24 hours.' },
  { id: 'r-3', priority: 'MEDIUM', title: 'Add end screen links', description: 'Link to related videos to improve session watch time.' },
  { id: 'r-4', priority: 'MEDIUM', title: 'Optimize titles for CTR', description: 'Use power words and numbers in titles.' },
  { id: 'r-5', priority: 'LOW', title: 'Test Shorts + long-form pairing', description: 'Cross-promote Shorts to drive long-form views.' },
];

export async function getProfile(): Promise<ProfileResponse> {
  return { profile: MOCK_PROFILE };
}

export async function getSkills(): Promise<SkillsResponse> {
  return { skills: MOCK_SKILLS };
}

export async function getStrengths(): Promise<StrengthsResponse> {
  return { strengths: MOCK_STRENGTHS };
}

export async function getWeaknesses(): Promise<WeaknessesResponse> {
  return { weaknesses: MOCK_WEAKNESSES };
}

export async function getRecommendations(): Promise<RecommendationsResponse> {
  return { recommendations: MOCK_RECOMMENDATIONS };
}
