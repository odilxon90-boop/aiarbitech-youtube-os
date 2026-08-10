export interface VideoIdea {
  id: string;
  title: string;
<<<<<<< HEAD
  description: string;
  confidence: number;
  trend: string;
}

export interface VideoScript {
  id: string;
  topic: string;
  style: string;
  length: string;
  outline: string[];
}

export interface GenerateRequest {
  topic: string;
  style: string;
  length: string;
}

export interface GenerateResponse {
  script: VideoScript;
}

export interface VideoProject {
  id: string;
  title: string;
  status: 'DRAFT' | 'SCRIPTED' | 'EDITING' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
  scriptId?: string;
  metadata: {
    duration?: string;
    format?: string;
    tags?: string[];
  };
}

export interface IdeasResponse {
  ideas: VideoIdea[];
}

export interface ProjectsResponse {
  projects: VideoProject[];
}

const MOCK_IDEAS: VideoIdea[] = [
  { id: 'idea-1', title: 'Top 10 AI Tools for Creators', description: 'A curated list of must-have AI tools.', confidence: 0.92, trend: 'AI Tools' },
  { id: 'idea-2', title: 'How to Automate YouTube with Python', description: 'Step-by-step automation guide.', confidence: 0.88, trend: 'Automation' },
  { id: 'idea-3', title: 'AI Thumbnail Generator Showdown', description: 'Compare top AI thumbnail generators.', confidence: 0.85, trend: 'AI Tools' },
  { id: 'idea-4', title: 'Short-Form Content Strategy 2026', description: 'How to dominate Shorts and Reels.', confidence: 0.91, trend: 'Strategy' },
  { id: 'idea-5', title: 'Build a Faceless YouTube Channel', description: 'Create content without showing your face.', confidence: 0.82, trend: 'Faceless' },
  { id: 'idea-6', title: 'AI Script Writing Workshop', description: 'Write viral scripts with AI assistance.', confidence: 0.87, trend: 'AI Writing' },
  { id: 'idea-7', title: 'YouTube SEO Secrets Revealed', description: 'Boost rankings with proven SEO tactics.', confidence: 0.9, trend: 'SEO' },
  { id: 'idea-8', title: 'Monetization Without Ads', description: 'Earn through affiliates and sponsorships.', confidence: 0.79, trend: 'Monetization' },
  { id: 'idea-9', title: 'Editing Workflow for 10x Speed', description: 'Speed up editing with AI and templates.', confidence: 0.86, trend: 'Editing' },
  { id: 'idea-10', title: 'Analyzing Top Creator Strategies', description: 'Deconstruct what makes top channels grow.', confidence: 0.84, trend: 'Analysis' },
  { id: 'idea-11', title: 'AI Voiceover Deep Dive', description: 'Best AI voice tools for narrations.', confidence: 0.8, trend: 'AI Tools' },
];

const MOCK_SCRIPTS: VideoScript[] = [
  { id: 'script-1', topic: 'Top 10 AI Tools for Creators', style: 'Listicle', length: '8-10 min', outline: ['Intro hook', 'Tool #1', 'Tool #2', 'Tool #3', 'Conclusion'] },
  { id: 'script-2', topic: 'How to Automate YouTube with Python', style: 'Tutorial', length: '12-15 min', outline: ['Setup', 'Code walkthrough', 'Demo', 'Next steps'] },
  { id: 'script-3', topic: 'AI Thumbnail Generator Showdown', style: 'Comparison', length: '10-12 min', outline: ['Intro', 'Tool A', 'Tool B', 'Tool C', 'Winner'] },
  { id: 'script-4', topic: 'Short-Form Content Strategy 2026', style: 'Strategy', length: '6-8 min', outline: ['Trends', 'Formats', 'Pacing', 'CTA'] },
  { id: 'script-5', topic: 'Build a Faceless YouTube Channel', style: 'Guide', length: '10-12 min', outline: ['Niche selection', 'Workflow', 'Tools', 'Scaling'] },
];

const MOCK_PROJECTS: VideoProject[] = [
  { id: 'proj-1', title: 'Top 10 AI Tools for Creators', status: 'PUBLISHED', createdAt: '2026-07-01', updatedAt: '2026-07-05', scriptId: 'script-1', metadata: { duration: '10:24', format: 'Long-form', tags: ['AI', 'Tools'] } },
  { id: 'proj-2', title: 'How to Automate YouTube with Python', status: 'EDITING', createdAt: '2026-07-10', updatedAt: '2026-07-12', scriptId: 'script-2', metadata: { duration: '14:02', format: 'Long-form', tags: ['Python', 'Automation'] } },
  { id: 'proj-3', title: 'AI Thumbnail Generator Showdown', status: 'SCRIPTED', createdAt: '2026-07-08', updatedAt: '2026-07-08', scriptId: 'script-3', metadata: { format: 'Long-form', tags: ['AI', 'Thumbnails'] } },
  { id: 'proj-4', title: 'Short-Form Content Strategy 2026', status: 'DRAFT', createdAt: '2026-07-12', updatedAt: '2026-07-12', metadata: { format: 'Short-form', tags: ['Strategy', 'Shorts'] } },
  { id: 'proj-5', title: 'Build a Faceless YouTube Channel', status: 'DRAFT', createdAt: '2026-07-11', updatedAt: '2026-07-11', metadata: { format: 'Long-form', tags: ['Faceless', 'Guide'] } },
];

export async function getVideoIdeas(): Promise<IdeasResponse> {
  return { ideas: MOCK_IDEAS };
}

export async function getScript(id: string): Promise<VideoScript | null> {
  return MOCK_SCRIPTS.find((s) => s.id === id) ?? null;
}

export async function generateVideo(request: GenerateRequest): Promise<GenerateResponse> {
  const script: VideoScript = {
    id: `script-${Date.now()}`,
    topic: request.topic,
    style: request.style,
    length: request.length,
    outline: ['Intro hook', 'Main content', 'Examples', 'Conclusion'],
  };
  MOCK_SCRIPTS.push(script);
  return { script };
}

export async function getProjects(): Promise<ProjectsResponse> {
  return { projects: MOCK_PROJECTS };
}

export async function getProject(id: string): Promise<VideoProject | null> {
  return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
=======
  genre: string;
  format: 'LONG_FORM' | 'SHORT';
  hook: string;
  estimatedDurationSeconds: number;
}

const videoIdeas: readonly VideoIdea[] = [
  { id: 'idea-aurora', title: 'I tried an AI content system for seven days', genre: 'Technology', format: 'LONG_FORM', hook: 'Show the before-and-after publishing workflow in the first 15 seconds.', estimatedDurationSeconds: 540 },
  { id: 'idea-studio', title: 'Three creator workflows that save an hour', genre: 'Education', format: 'SHORT', hook: 'Start with the most surprising time-saving automation.', estimatedDurationSeconds: 50 },
  { id: 'idea-sound', title: 'Build a copyright-safe creator soundtrack', genre: 'Music', format: 'LONG_FORM', hook: 'Compare licensed and unlicensed audio outcomes.', estimatedDurationSeconds: 420 },
  { id: 'idea-travel', title: 'A cinematic city guide with a phone', genre: 'Travel', format: 'SHORT', hook: 'Open on the final cinematic frame before explaining the setup.', estimatedDurationSeconds: 58 },
];

export class VideoService {
  ideas(genre?: string): readonly VideoIdea[] {
    const normalizedGenre = genre?.trim().toLowerCase();
    return normalizedGenre
      ? videoIdeas.filter((idea) => idea.genre.toLowerCase() === normalizedGenre)
      : videoIdeas;
  }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
