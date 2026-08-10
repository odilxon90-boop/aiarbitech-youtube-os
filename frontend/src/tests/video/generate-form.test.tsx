import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GenerateForm } from '../../components/video/GenerateForm';

const mockGenerate = vi.fn(async () => {});

describe('GenerateForm', () => {
  it('renders topic, style, length controls', () => {
    const markup = renderToStaticMarkup(<GenerateForm onGenerate={mockGenerate} />);
    for (const expected of ['Generate Video', 'Topic', 'Style', 'Length', 'Generate Script']) {
      expect(markup).toContain(expected);
    }
  });

  it('disables submit when topic is empty', () => {
    const markup = renderToStaticMarkup(<GenerateForm onGenerate={mockGenerate} />);
    expect(markup).toContain('disabled');
  });
});
