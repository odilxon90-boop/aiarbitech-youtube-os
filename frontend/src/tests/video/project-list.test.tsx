import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProjectList } from '../../components/video/ProjectList';
import type { VideoProject } from '../../video/types';

const projects: readonly VideoProject[] = [
  { id: 'proj-1', title: 'AI Tools Video', status: 'PUBLISHED', createdAt: '2026-07-01', updatedAt: '2026-07-05', metadata: { format: 'Long-form' } },
  { id: 'proj-2', title: 'Automation Guide', status: 'EDITING', createdAt: '2026-07-10', updatedAt: '2026-07-12', metadata: { format: 'Long-form' } },
];

describe('ProjectList', () => {
  it('renders projects with status badges', () => {
    const onSelect = vi.fn();
    const markup = renderToStaticMarkup(<ProjectList projects={projects} onSelect={onSelect} />);
    for (const expected of ['Projects', 'AI Tools Video', 'PUBLISHED', 'Automation Guide', 'EDITING']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const onSelect = vi.fn();
    const markup = renderToStaticMarkup(<ProjectList projects={[]} onSelect={onSelect} />);
    expect(markup).toContain('No projects yet.');
  });
});
