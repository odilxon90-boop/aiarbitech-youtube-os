import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PerformanceChart } from '../../components/prompts/PerformanceChart';
import { PromptDetail } from '../../components/prompts/PromptDetail';
import { PromptForm } from '../../components/prompts/PromptForm';
import { PromptList } from '../../components/prompts/PromptList';
describe('Prompt Registry components', () => {
  it('renders prompt list and detail', () => { expect(renderToStaticMarkup(<PromptList prompts={[{ id: 'p1', name: 'Writer', model: 'gpt-4' }]} />)).toContain('Writer'); expect(renderToStaticMarkup(<PromptDetail prompt={{ name: 'Writer', content: 'Mock', model: 'gpt-4', versionCount: 3 }} />)).toContain('3 versions'); });
  it('renders form and performance metrics', () => { expect(renderToStaticMarkup(<PromptForm />)).toContain('Save mock prompt'); expect(renderToStaticMarkup(<PerformanceChart items={[{ id: 'p1', name: 'Writer', successRatePercent: 95 }]} />)).toContain('95%'); });
});
