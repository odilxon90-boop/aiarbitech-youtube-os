import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StatusCard, aiStatusSignal } from '../../components/dashboard/StatusCard';

describe('StatusCard', () => {
  it('maps AI status levels to signal emoji', () => {
    expect(aiStatusSignal('HEALTHY')).toBe('🟢');
    expect(aiStatusSignal('DEGRADED')).toBe('🟡');
    expect(aiStatusSignal('CRITICAL')).toBe('🔴');
  });

  it('renders the AI status level, signal, detail and timestamp', () => {
    const markup = renderToStaticMarkup(
      <StatusCard
        aiStatus={{
          level: 'DEGRADED',
          label: 'DEGRADED',
          detail: 'Retention dip detected on recent uploads.',
          updatedAt: '2026-08-09T00:00:00.000Z',
        }}
      />,
    );
    expect(markup).toContain('AI Status');
    expect(markup).toContain('🟡');
    expect(markup).toContain('Retention dip detected on recent uploads.');
    expect(markup).toContain('Updated 2026-08-09T00:00:00.000Z');
  });
});