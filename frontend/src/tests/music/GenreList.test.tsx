import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GenreList } from '../../components/music/GenreList';

describe('GenreList', () => it('displays genres and selected state', () => {
  const markup = renderToStaticMarkup(<GenreList genres={['Electronic', 'Acoustic']} selectedGenre="Electronic" onSelect={() => undefined} />);
  expect(markup).toContain('All genres'); expect(markup).toContain('Electronic'); expect(markup).toContain('Acoustic'); expect(markup).toContain('aria-pressed="true"');
}));
