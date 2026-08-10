import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ScriptViewer } from '../../components/video/ScriptViewer';
import type { VideoScript } from '../../video/types';

const script: VideoScript = {
  id: 'script-1',
  topic: 'AI Tools',
  style: 'Listicle',
  length: '8-10 min',
  outline: ['Intro', 'Tool A', 'Tool B', 'Conclusion'],
};

describe('ScriptViewer', () => {
  it('renders script metadata and outline', () => {
    const markup = renderToStaticMarkup(<ScriptViewer script={script} />);
    for (const expected of ['Script', 'AI Tools', 'Listicle', '8-10 min', 'Intro', 'Tool A', 'Conclusion']) {
      expect(markup).toContain(expected);
    }
  });
});
