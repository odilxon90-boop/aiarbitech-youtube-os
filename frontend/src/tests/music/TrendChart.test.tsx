import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { TrendChart } from '../../components/music/TrendChart';

describe('TrendChart', () => it('renders an accessible activity chart', () => {
  const markup = renderToStaticMarkup(<TrendChart points={[10, 20, 15]} />);
  expect(markup).toContain('Music trend activity'); expect(markup).toContain('Music trend chart'); expect(markup).toContain('height:50%');
}));
