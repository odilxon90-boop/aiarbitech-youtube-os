import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Checklist } from '../../components/quality/Checklist';
import { ReadinessBadge } from '../../components/quality/ReadinessBadge';
import { RetentionChart } from '../../components/quality/RetentionChart';
import { ScoreCard } from '../../components/quality/ScoreCard';

describe('Quality Gate components', () => {
  it('renders the score card', () => {
    expect(renderToStaticMarkup(<ScoreCard score={91} />)).toContain('91');
  });

  it('renders the retention chart', () => {
    expect(renderToStaticMarkup(<RetentionChart confidence={89} points={[{ timestampSeconds: 0, retentionPercent: 100 }]} />)).toContain('<svg');
  });

  it('renders the readiness badge', () => {
    expect(renderToStaticMarkup(<ReadinessBadge status="REVIEW" />)).toContain('REVIEW');
  });

  it('renders checklist entries', () => {
    const markup = renderToStaticMarkup(<Checklist items={[{ id: 'audio', label: 'Audio clarity', status: 'PASS' }]} />);
    expect(markup).toContain('Audio clarity');
    expect(markup).toContain('PASS');
  });
});
