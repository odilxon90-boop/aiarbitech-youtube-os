import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RiskList } from '../../components/heir/RiskList';
import type { RiskAlert } from '../../heir/types';

const risks: readonly RiskAlert[] = [
  { id: 'r-1', severity: 'HIGH', title: 'Revenue dependency', description: 'One channel.', category: 'Monetization' },
  { id: 'r-2', severity: 'CRITICAL', title: 'Copyright', description: 'Strike received.', category: 'Compliance' },
];

describe('RiskList', () => {
  it('renders risks with severity badges', () => {
    const markup = renderToStaticMarkup(<RiskList risks={risks} />);
    for (const expected of ['Risk Alerts', 'Revenue dependency', 'HIGH', 'Copyright', 'CRITICAL', 'One channel.', 'Strike received.', 'Monetization', 'Compliance']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<RiskList risks={[]} />);
    expect(markup).toContain('No risk alerts.');
  });
});
