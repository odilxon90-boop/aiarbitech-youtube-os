import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChannelList } from '../../components/president/ChannelList';
import type { ChannelStat } from '../../president/types';

const channels: readonly ChannelStat[] = [
  { id: 'c-1', title: 'Channel 1', subscribers: '10,000', growth: 5.2, monetized: true },
  { id: 'c-2', title: 'Channel 2', subscribers: '5,000', growth: -2.1, monetized: false },
];

describe('ChannelList', () => {
  it('renders channels with monetization badges and growth', () => {
    const markup = renderToStaticMarkup(<ChannelList channels={channels} />);
    for (const expected of ['Channels (2)', 'Channel 1', 'Monetized', '10,000', '+5.2%', 'Channel 2', 'Not monetized', '-2.1%']) {
      expect(markup).toContain(expected);
    }
  });

  it('renders an empty state', () => {
    const markup = renderToStaticMarkup(<ChannelList channels={[]} />);
    expect(markup).toContain('No channels found.');
  });
});
