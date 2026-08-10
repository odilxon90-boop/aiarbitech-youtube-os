import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpAssistantClient } from '../../ai/assistant-client';

describe('HttpAssistantClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a message and unwraps the envelope', async () => {
    let seen: { url: string; auth: string | undefined; body: string | undefined } = {
      url: '',
      auth: undefined,
      body: undefined,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: unknown, init?: RequestInit) => {
        const headers = (init?.headers ?? {}) as Record<string, string>;
        seen = {
          url: String(url),
          auth: headers.Authorization,
          body: init?.body ? String(init?.body) : undefined,
        };
        return {
          ok: true,
          json: async () => ({
            data: { session: { id: 's1', messages: [] }, newSession: true },
            meta: { correlationId: 'c-1', timestamp: '2026-08-09T00:00:00.000Z' },
          }),
        } as Response;
      }),
    );

    const client = new HttpAssistantClient('/api/v1', 'mock-creator-token');
    const result = await client.send('hello', 's0');
    expect(result.newSession).toBe(true);
    expect(seen.url).toBe('/api/v1/ai/chat/send');
    expect(seen.auth).toBe('Bearer mock-creator-token');
    expect(JSON.parse(seen.body ?? '{}')).toEqual({ prompt: 'hello', sessionId: 's0' });
  });

  it('fetches history and a single session', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: unknown) => {
        const path = String(url);
        if (path.endsWith('/ai/chat/history')) {
          return { ok: true, json: async () => ({ data: { sessions: [{ id: 's1', messages: [] }] }, meta: {} }) } as Response;
        }
        return { ok: true, json: async () => ({ data: { session: { id: 's1', messages: [] } }, meta: {} }) } as Response;
      }),
    );
    const client = new HttpAssistantClient('/api/v1');
    const history = await client.history();
    expect(history.sessions).toHaveLength(1);
    const one = await client.session('s1');
    expect(one.session.id).toBe('s1');
  });

  it('throws for a non-ok response (error handling)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 403 }) as Response),
    );
    const client = new HttpAssistantClient('/api/v1');
    await expect(client.send('hi')).rejects.toThrow('AI Assistant API returned 403');
  });
});