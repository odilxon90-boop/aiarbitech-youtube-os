import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AISyncPage } from '../../pages/AISyncPage';
import type { SyncStatusResponse, SyncHistoryEntry, Conflict, ModelVersion } from '../../ai-sync/types';

const status: SyncStatusResponse = { status: 'ACTIVE', lastSyncAt: '2026-08-09T12:00:00.000Z', localVersion: 'v0.1', globalVersion: 'v1.0', message: 'Healthy.' };
const history: SyncHistoryEntry[] = [
  { id: 's-1', timestamp: '2026-08-09T12:00:00.000Z', status: 'ACTIVE', details: 'OK', durationMs: 100 },
];
const conflicts: Conflict[] = [
  { id: 'c-1', type: 'RECOMMENDATION', localValue: 'A', globalValue: 'B', detectedAt: '2026-08-09T12:00:00.000Z', status: 'OPEN' },
];
const models: ModelVersion[] = [
  { id: 'm-1', name: 'Engine', version: 'v1.0', active: true, deployedAt: '2026-08-01T00:00:00.000Z', metadata: {} },
];

describe('AISyncPage', () => {
  it('renders all sections from initial data', () => {
    const markup = renderToStaticMarkup(<AISyncPage initialStatus={status} initialHistory={history} initialConflicts={conflicts} initialModels={models} />);
    for (const expected of ['Global AI Core Sync', 'Sync Status', 'Sync History', 'Conflicts', 'Model Versions', 'Force Sync']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders a loading state when no initial data is provided', () => {
    const markup = renderToStaticMarkup(<AISyncPage />);
    expect(markup).toContain('Loading');
    expect(markup).toContain('Loading AI Sync status…');
  });
});
