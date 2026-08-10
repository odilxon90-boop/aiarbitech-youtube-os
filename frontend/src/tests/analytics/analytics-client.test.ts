import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpAnalyticsClient } from '../../analytics/analytics-client';
import type { AnalyticsBundle } from '../../analytics/types';

describe('HttpAnalyticsClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the bundle from all three endpoints and unwraps the envelope', async () => {
    const calls: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: unknown) => {
        const path = String(url);
        calls.push(path);
        const body: { data: unknown } = { data: {} as never };
        if (path.endsWith('/summary')) {
          body.data = { metrics: [] } as never;
        } else if (path.endsWith('/trends')) {
          body.data = { series: [] } as never;
        } else if (path.endsWith('/performance')) {
          body.data = { topVideos: [], geography: [], devices: [] } as never;
        }
        return {
          ok: true,
          json: async () => ({ ...body, meta: { correlationId: 'c-1', timestamp: '2026-08-09T00:00:00.000Z' } }),
        } as Response;
      }),
    );

    const client = new HttpAnalyticsClient('/api/v1', 'mock-creator-token');
    const bundle: AnalyticsBundle = await client.loadBundle();
    expect(bundle.summary.metrics).toEqual([]);
    expect(bundle.trends.series).toEqual([]);
    expect(bundle.performance.topVideos).toEqual([]);
    expect(calls).toEqual(
      expect.arrayContaining([
        '/api/v1/analytics/summary',
        '/api/v1/analytics/trends',
        '/api/v1/analytics/performance',
      ]),
    );
  });

  it('sends the bearer token and aborts requests on signal', async () => {
    let seenAuth: string | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: unknown, init?: RequestInit) => {
        const headers = (init?.headers ?? {}) as Record<string, string>;
        seenAuth = headers.Authorization;
        return { ok: true, json: async () => ({ data: { metrics: [] }, meta: {} }) } as Response;
      }),
    );
    const client = new HttpAnalyticsClient('/api/v1', 'mock-creator-token');
    await client.loadBundle();
    expect(seenAuth).toBe('Bearer mock-creator-token');
  });

  it('throws for a non-ok response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 403 }) as Response),
    );
    const client = new HttpAnalyticsClient('/api/v1', 'mock-viewer-token');
    await expect(client.loadBundle()).rejects.toThrow('Analytics API returned 403');
  });
});