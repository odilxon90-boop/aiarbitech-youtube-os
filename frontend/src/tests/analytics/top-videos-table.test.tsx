import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TopVideosTable } from '../../components/analytics/TopVideosTable';
import type { TopVideo } from '../../analytics/types';

const videos: TopVideo[] = [
  { id: 'v1', title: 'Top 5 AI Automations', views: 48210, watchTimeHours: 12840, ctr: 8.4, revenue: 412.5 },
  { id: 'v2', title: 'Build a YouTube OS in a Day', views: 37120, watchTimeHours: 9940, ctr: 7.9, revenue: 356.8 },
];

describe('TopVideosTable', () => {
  it('renders the table header and each video row', () => {
    const markup = renderToStaticMarkup(<TopVideosTable videos={videos} />);
    expect(markup).toContain('data-testid="top-videos"');
    expect(markup).toContain('Views');
    expect(markup).toContain('Top 5 AI Automations');
    expect(markup).toContain('Build a YouTube OS in a Day');
    expect(markup).toContain('12840');
    expect(markup).toContain('8.4%');
  });

  it('shows an empty state when there are no videos', () => {
    const markup = renderToStaticMarkup(<TopVideosTable videos={[]} />);
    expect(markup).toContain('No video data yet.');
  });
});