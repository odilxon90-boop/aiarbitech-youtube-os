import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpDashboardClient } from '../../dashboard/dashboard-client';

describe('HttpDashboardClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a bearer token and unwraps the API envelope', async () => {
    let seenAuth: string | undefined;
    let seenPath: string | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: unknown, init?: RequestInit) => {
        seenPath = String(url);
        const headers = (init?.headers ?? {}) as Record<string, string>;
        seenAuth = headers.Authorization;
        return {
          ok: true,
          json: async () => ({
            data: { metrics: [] },
            meta: { correlationId: 'c-1', timestamp: '2026-08-09T00:00:00.000Z' },
          }),
        } as Response;
      }),
    );

    const client = new HttpDashboardClient('/api/v1', 'mock-creator-token');
    const result = await client.loadKpis();
    expect(result).toEqual({ metrics: [] });
    expect(seenPath).toBe('/api/v1/dashboard/kpi');
    expect(seenAuth).toBe('Bearer mock-creator-token');
  });

  it('throws for a non-ok response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 401 }) as Response),
    );
    const client = new HttpDashboardClient('/api/v1', 'mock-viewer-token');
    await expect(client.loadSummary()).rejects.toThrow('Dashboard API returned 401');
  });
});