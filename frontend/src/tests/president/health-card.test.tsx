import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HealthCard } from '../../components/president/HealthCard';
import type { HealthMetric } from '../../president/types';

const metrics: readonly HealthMetric[] = [
  { id: 'h-1', name: 'API', status: 'HEALTHY', message: 'All good.' },
  { id: 'h-2', name: 'DB', status: 'DEGRADED', message: 'Slow queries.' },
  { id: 'h-3', name: 'AI Core', status: 'CRITICAL', message: 'Down.' },
];

describe('HealthCard', () => {
  it('renders health metrics and summary counts', () => {
    const markup = renderToStaticMarkup(<HealthCard metrics={metrics} />);
    for (const expected of ['Platform Health', 'API', 'DB', 'AI Core', 'HEALTHY', 'DEGRADED', 'CRITICAL', '1 healthy', '1 degraded', '1 critical']) {
      expect(markup).toContain(expected);
    }
  });
});
