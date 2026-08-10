import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChannelHealthCard } from '../../components/dashboard/ChannelHealthCard';
import type { ChannelHealth } from '../../dashboard/types';

const health: ChannelHealth = {
  score: 84,
  label: 'Healthy',
  details: [
    'Upload consistency: 4.2/5',
    'Audience retention: 62%',
    'No copyright strikes',
  ],
};

describe('ChannelHealthCard', () => {
  it('renders score, label and health details', () => {
    const markup = renderToStaticMarkup(<ChannelHealthCard health={health} />);
    expect(markup).toContain('Channel Health');
    expect(markup).toContain('84/100');
    expect(markup).toContain('Healthy');
    expect(markup).toContain('Upload consistency: 4.2/5');
    expect(markup).toContain('No copyright strikes');
  });
});
