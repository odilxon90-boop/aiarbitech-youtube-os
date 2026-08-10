import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AIStatusList } from '../../components/heir/AIStatusList';
import type { AIStatus } from '../../heir/types';

const aiStatus: readonly AIStatus[] = [
  { id: 'ai-1', name: 'Director', state: 'ACTIVE', lastActive: '2026-08-09T12:00:00.000Z', message: 'Running.' },
  { id: 'ai-2', name: 'Writer', state: 'IDLE', lastActive: '2026-08-09T10:00:00.000Z', message: 'Idle.' },
  { id: 'ai-3', name: 'Moderator', state: 'ERROR', lastActive: '2026-08-09T09:00:00.000Z', message: 'Failed.' },
];

describe('AIStatusList', () => {
  it('renders AI statuses with state badges', () => {
    const markup = renderToStaticMarkup(<AIStatusList aiStatus={aiStatus} />);
    for (const expected of ['AI Director Status', 'Director', 'ACTIVE', 'Writer', 'IDLE', 'Moderator', 'ERROR', 'Running.', 'Idle.', 'Failed.']) {
      expect(markup).toContain(expected);
    }
  });
});
