import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import type { ActivityItem } from '../../dashboard/types';

const items: readonly ActivityItem[] = [
  { id: 'act-1', at: '2h ago', message: 'Video scheduled for Friday.' },
  { id: 'act-2', at: '1d ago', message: 'New subscriber milestone reached.' },
];

describe('RecentActivityList', () => {
  it('renders activity items with timestamps', () => {
    const markup = renderToStaticMarkup(<RecentActivityList items={items} />);
    expect(markup).toContain('Recent Activity');
    expect(markup).toContain('Video scheduled for Friday.');
    expect(markup).toContain('2h ago');
    expect(markup).toContain('New subscriber milestone reached.');
  });

  it('renders an empty state when there are no items', () => {
    const markup = renderToStaticMarkup(<RecentActivityList items={[]} />);
    expect(markup).toContain('No recent activity.');
  });
});
