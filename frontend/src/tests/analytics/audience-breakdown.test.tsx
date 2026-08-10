import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AudienceBreakdown } from '../../components/analytics/AudienceBreakdown';
import type { DeviceBreakdown, RegionBreakdown } from '../../analytics/types';

const geography: RegionBreakdown[] = [
  { country: 'United States', share: 34, viewers: 44800 },
  { country: 'India', share: 21, viewers: 27700 },
];
const devices: DeviceBreakdown[] = [
  { device: 'Mobile', share: 58, viewers: 76500 },
  { device: 'Desktop', share: 27, viewers: 35600 },
];

describe('AudienceBreakdown', () => {
  it('renders geography and device rows with shares', () => {
    const markup = renderToStaticMarkup(<AudienceBreakdown geography={geography} devices={devices} />);
    expect(markup).toContain('data-testid="audience-breakdown"');
    expect(markup).toContain('United States');
    expect(markup).toContain('India');
    expect(markup).toContain('Mobile');
    expect(markup).toContain('Desktop');
    expect(markup).toContain('34%');
    expect(markup).toContain('58%');
  });

  it('shows an empty state when both lists are empty', () => {
    const markup = renderToStaticMarkup(<AudienceBreakdown geography={[]} devices={[]} />);
    expect(markup).toContain('No audience data yet.');
  });
});