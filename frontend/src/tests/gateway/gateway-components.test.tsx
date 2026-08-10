import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { EndpointList } from '../../components/gateway/EndpointList';
import { HealthChart } from '../../components/gateway/HealthChart';
import { LogList } from '../../components/gateway/LogList';
import { StatusCard } from '../../components/gateway/StatusCard';
describe('Gateway components', () => {
  it('renders status and endpoints', () => { expect(renderToStaticMarkup(<StatusCard status="ACTIVE" />)).toContain('ACTIVE'); expect(renderToStaticMarkup(<EndpointList endpoints={[{ key: 'ai', name: 'AI Core', rateLimitPerMinute: 30 }]} />)).toContain('AI Core'); });
  it('renders logs and health', () => { expect(renderToStaticMarkup(<LogList logs={[{ id: 'l1', endpoint: 'ai', status: 'SUCCESS', latencyMs: 75 }]} />)).toContain('75ms'); expect(renderToStaticMarkup(<HealthChart metrics={[{ metric: 'Availability', value: '99%', status: 'HEALTHY' }]} />)).toContain('99%'); });
});
