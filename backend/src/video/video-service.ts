export interface VideoIdea {
  id: string;
  title: string;
  genre: string;
  confidence: number;
  format: 'LONG_FORM' | 'SHORT';
  hook: string;
  estimatedDurationSeconds: number;
}

export interface VideoScript {
  id: string;
  topic: string;
  style: string;
  length: string;
  outline: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  status: 'DRAFT' | 'PRODUCTION' | 'PUBLISHED';
}

const videoIdeas: readonly VideoIdea[] = [
  { id: 'idea-aurora', title: 'I tried an AI content system for seven days', genre: 'Technology', confidence: 91, format: 'LONG_FORM', hook: 'Show the before-and-after publishing workflow in the first 15 seconds.', estimatedDurationSeconds: 540 },
  { id: 'idea-studio', title: 'Three creator workflows that save an hour', genre: 'Education', confidence: 82, format: 'SHORT', hook: 'Start with the most surprising time-saving automation.', estimatedDurationSeconds: 50 },
  { id: 'idea-sound', title: 'Build a copyright-safe creator soundtrack', genre: 'Music', confidence: 78, format: 'LONG_FORM', hook: 'Compare licensed and unlicensed audio outcomes.', estimatedDurationSeconds: 420 },
  { id: 'idea-travel', title: 'A cinematic city guide with a phone', genre: 'Travel', confidence: 73, format: 'SHORT', hook: 'Open on the final cinematic frame before explaining the setup.', estimatedDurationSeconds: 58 },
  { id: 'idea-1', title: 'Top 10 AI Tools for Creators', genre: 'Technology', confidence: 95, format: 'LONG_FORM', hook: 'Open with the tool that saved the most time.', estimatedDurationSeconds: 600 },
  { id: 'idea-2', title: 'Automate Thumbnail Variants in 15 Minutes', genre: 'Technology', confidence: 88, format: 'SHORT', hook: 'Show three thumbnails instantly.', estimatedDurationSeconds: 45 },
  { id: 'idea-3', title: 'Creator Studio Morning Routine', genre: 'Lifestyle', confidence: 69, format: 'SHORT', hook: 'Start with the finished desk setup.', estimatedDurationSeconds: 40 },
  { id: 'idea-4', title: 'My Weekly Editing Pipeline', genre: 'Education', confidence: 84, format: 'LONG_FORM', hook: 'Break down every tool on screen.', estimatedDurationSeconds: 480 },
  { id: 'idea-5', title: 'How I Research Viral Topics', genre: 'Technology', confidence: 93, format: 'LONG_FORM', hook: 'Show the spreadsheet before the explanation.', estimatedDurationSeconds: 520 },
  { id: 'idea-6', title: 'Audio Fixes Every Creator Needs', genre: 'Music', confidence: 76, format: 'SHORT', hook: 'Play the bad and good versions back-to-back.', estimatedDurationSeconds: 55 },
  { id: 'idea-7', title: 'Batch Recording Setup', genre: 'Education', confidence: 81, format: 'LONG_FORM', hook: 'Reveal the full set in one shot.', estimatedDurationSeconds: 430 },
  { id: 'idea-8', title: 'Three Retention Tricks That Work', genre: 'Technology', confidence: 90, format: 'SHORT', hook: 'Lead with the retention graph.', estimatedDurationSeconds: 50 },
];

const scripts: VideoScript[] = [
  { id: 'script-1', topic: 'Top 10 AI Tools for Creators', style: 'Listicle', length: '12 min', outline: ['Hook', 'Tool 1-3', 'Tool 4-7', 'Tool 8-10', 'CTA'] },
  { id: 'script-2', topic: 'Batch Recording Setup', style: 'Tutorial', length: '8 min', outline: ['Intro', 'Gear', 'Workflow', 'Wrap-up'] },
];

const projects: VideoProject[] = [
  { id: 'project-1', title: 'AI Tools Breakdown', status: 'DRAFT' },
  { id: 'project-2', title: 'Thumbnail Testing', status: 'PRODUCTION' },
  { id: 'project-3', title: 'Workflow Automation', status: 'PUBLISHED' },
  { id: 'project-4', title: 'Creator Finance Guide', status: 'DRAFT' },
  { id: 'project-5', title: 'Shorts Growth Experiments', status: 'PRODUCTION' },
];

export class VideoService {
  ideas(genre?: string): readonly VideoIdea[] {
    const normalizedGenre = genre?.trim().toLowerCase();
    return normalizedGenre
      ? videoIdeas.filter((idea) => idea.genre.toLowerCase() === normalizedGenre)
      : videoIdeas;
  }

  getScript(scriptId: string): VideoScript | undefined {
    return scripts.find((script) => script.id === scriptId);
  }

  generateScript(topic: string, style: string, length: string): VideoScript {
    return {
      id: `script-${Date.now()}`,
      topic,
      style,
      length,
      outline: ['Hook', 'Problem', 'Solution', 'Examples', 'CTA'],
    };
  }

  listProjects(): readonly VideoProject[] {
    return projects;
  }

  getProject(projectId: string): VideoProject | undefined {
    return projects.find((project) => project.id === projectId);
  }
}
