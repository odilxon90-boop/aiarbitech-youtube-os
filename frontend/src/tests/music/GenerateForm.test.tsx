import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GenerateForm } from '../../components/music/GenerateForm';

describe('GenerateForm', () => it('renders a searchable music brief form', () => {
  const markup = renderToStaticMarkup(<GenerateForm onGenerate={() => undefined} />);
  expect(markup).toContain('Describe a mood, genre, or creator use case'); expect(markup).toContain('Find tracks');
}));
