import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ConflictList } from '../../components/ai-sync/ConflictList';
import { ModelVersionList } from '../../components/ai-sync/ModelVersionList';
import { StatusCard } from '../../components/ai-sync/StatusCard';
import { SyncHistory } from '../../components/ai-sync/SyncHistory';

describe('AI Sync components', () => {
  it('renders status and history', () => {
    expect(renderToStaticMarkup(<StatusCard status="ACTIVE" lastSynchronizedAt="now" />)).toContain('ACTIVE');
    expect(renderToStaticMarkup(<SyncHistory events={[{ id: 's1', timestamp: 'now', status: 'SUCCESS', detail: 'Synced' }]} />)).toContain('Synced');
  });
  it('renders conflicts and models', () => {
    expect(renderToStaticMarkup(<ConflictList conflicts={[{ id: 'c1', subject: 'video', localDecision: 'Local', globalRecommendation: 'Global', resolution: 'UNRESOLVED' }]} />)).toContain('video');
    expect(renderToStaticMarkup(<ModelVersionList models={[{ id: 'm1', name: 'Director', version: '1.0', scope: 'LOCAL', active: true }]} />)).toContain('Director');
  });
});
