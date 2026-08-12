import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { App } from '../app/App';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App routing', () => {
  it('renders the creator dashboard at the YouTube OS base path', () => {
    vi.stubGlobal('window', {
      location: { pathname: '/youtube-os/' },
      localStorage: { getItem: () => '{}' },
    });

    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('Creator Dashboard');
    expect(markup).not.toContain('Global Ecosystem');
  });
});
