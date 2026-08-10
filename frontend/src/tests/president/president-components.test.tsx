import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PresidentPanelPage } from '../../pages/PresidentPanelPage';
describe('President Panel', () => { it('renders executive health, revenue, channels, AI status, and risks', () => { const markup = renderToStaticMarkup(<PresidentPanelPage />); expect(markup).toContain('President Panel'); expect(markup).toContain('Revenue'); expect(markup).toContain('Creator Channel 10'); expect(markup).toContain('Risk Alerts'); }); });
