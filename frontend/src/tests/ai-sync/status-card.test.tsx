import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StatusCard } from '../../components/ai-sync/StatusCard';
import type { SyncStatusResponse } from '../../ai-sync/types';

const status: SyncStatusResponse = {
  status: 'ACTIVE',
  lastSyncAt: '2026-08-09T12:00:00.000Z',
  localVersion: 'v0.1',
  globalVersion: 'v1.0',
  message: 'Healthy.',
};

describe('StatusCard', () => {
  it('renders sync status and versions', () => {
    const markup = renderToStaticMarkup(<StatusCard status={status} />);
    for (const expected of ['Sync Status', 'ACTIVE', 'v0.1', 'v1.0', 'Healthy.']) {
      expect(markup).toContain(expected);
    }
  });
});
