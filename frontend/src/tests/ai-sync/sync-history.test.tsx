import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SyncHistory } from '../../components/ai-sync/SyncHistory';
import type { SyncHistoryEntry } from '../../ai-sync/types';

const entries: readonly SyncHistoryEntry[] = [
  { id: 's-1', timestamp: '2026-08-09T12:00:00.000Z', status: 'ACTIVE', details: 'OK', durationMs: 100 },
  { id: 's-2', timestamp: '2026-08-09T11:00:00.000Z', status: 'ERROR', details: 'Failed', durationMs: 200 },
];

describe('SyncHistory', () => {
  it('renders history entries', () => {
    const markup = renderToStaticMarkup(<SyncHistory entries={entries} />);
    for (const expected of ['Sync History (2)', 'ACTIVE', 'ERROR', 'OK', 'Failed', '100ms', '200ms']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<SyncHistory entries={[]} />);
    expect(markup).toContain('No sync history available.');
  });
});
