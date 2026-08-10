export interface VideoIdea {
  id: string;
  title: string;
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
}
