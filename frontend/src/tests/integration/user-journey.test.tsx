import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AIAssistantPage } from '../../pages/AIAssistantPage';
import { AnalyticsPage } from '../../pages/AnalyticsPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ErrorState } from '../../shared/components/AsyncStates';
describe('mock creator user journey', () => {
  it('renders dashboard KPI cards, AI assistant, analytics, and navigation targets', () => { const dashboard = renderToStaticMarkup(<DashboardPage />); const assistant = renderToStaticMarkup(<AIAssistantPage />); const analytics = renderToStaticMarkup(<AnalyticsPage />); expect(dashboard).toContain('Success score'); expect(assistant).toContain('Send message'); expect(analytics).toContain('Mock views chart'); });
  it('renders an error state', () => expect(renderToStaticMarkup(<ErrorState message="Mock API unavailable" />)).toContain('Mock API unavailable'));
});
