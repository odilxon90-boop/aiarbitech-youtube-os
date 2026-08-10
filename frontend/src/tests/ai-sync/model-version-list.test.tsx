import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ModelVersionList } from '../../components/ai-sync/ModelVersionList';
import type { ModelVersion } from '../../ai-sync/types';

const models: readonly ModelVersion[] = [
  { id: 'm-1', name: 'Engine', version: 'v1.0', active: true, deployedAt: '2026-08-01T00:00:00.000Z', metadata: { region: 'global', accuracy: '94.2%' } },
  { id: 'm-2', name: 'Classifier', version: 'v2.0', active: false, deployedAt: '2026-07-01T00:00:00.000Z', metadata: { region: 'deprecated', accuracy: '91.5%' } },
];

describe('ModelVersionList', () => {
  it('renders model versions', () => {
    const markup = renderToStaticMarkup(<ModelVersionList models={models} />);
    for (const expected of ['Model Versions (2)', 'Engine', 'Classifier', 'v1.0', 'v2.0', 'Active', 'Inactive', 'region', 'accuracy']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<ModelVersionList models={[]} />);
    expect(markup).toContain('No model versions found.');
  });
});
