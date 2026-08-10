import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { VideoStudioPage } from '../../pages/VideoStudioPage';
import type { VideoProject, VideoScript } from '../../video/types';

const ideas = { ideas: [{ id: 'idea-1', title: 'AI Tools', description: 'Top tools.', confidence: 0.9, trend: 'AI' }] };
const projects = { projects: [{ id: 'proj-1', title: 'AI Tools Video', status: 'PUBLISHED', createdAt: '2026-07-01', updatedAt: '2026-07-05', metadata: {} }] as VideoProject[] };
const script: VideoScript = { id: 'script-1', topic: 'AI', style: 'Tutorial', length: '8 min', outline: ['Intro'] };

describe('VideoStudioPage', () => {
  it('renders tabs and ideas section from initial data', () => {
    const markup = renderToStaticMarkup(<VideoStudioPage initialData={{ ideas, projects, script }} />);
    for (const expected of ['AI Video Studio', 'Ideas', 'Generate', 'Projects', 'AI Tools']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders loading states when no initial data', () => {
    const markup = renderToStaticMarkup(<VideoStudioPage />);
    expect(markup).toContain('Loading');
  });
});
