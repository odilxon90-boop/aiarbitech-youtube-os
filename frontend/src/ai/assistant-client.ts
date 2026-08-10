import type { ChatSession, SendResult } from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface AssistantClient {
  send(prompt: string, sessionId?: string, signal?: AbortSignal): Promise<SendResult>;
  history(signal?: AbortSignal): Promise<{ sessions: ChatSession[] }>;
  session(sessionId: string, signal?: AbortSignal): Promise<{ session: ChatSession }>;
}

export class HttpAssistantClient implements AssistantClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-creator-token',
  ) {}

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: { ...this.headers(), ...(init?.headers ?? {}) },
    });
    if (!response.ok) throw new Error(`AI Assistant API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  send(prompt: string, sessionId?: string, signal?: AbortSignal): Promise<SendResult> {
    const payload: Record<string, string> = { prompt };
    if (sessionId) payload.sessionId = sessionId;
    return this.request<SendResult>('/ai/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      ...(signal ? { signal } : {}),
    });
  }

  history(signal?: AbortSignal): Promise<{ sessions: ChatSession[] }> {
    return this.request<{ sessions: ChatSession[] }>('/ai/chat/history', {
      method: 'GET',
      ...(signal ? { signal } : {}),
    });
  }

  session(sessionId: string, signal?: AbortSignal): Promise<{ session: ChatSession }> {
    return this.request<{ session: ChatSession }>(`/ai/chat/${encodeURIComponent(sessionId)}`, {
      method: 'GET',
      ...(signal ? { signal } : {}),
    });
  }
}

export function createAssistantClient(): AssistantClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpAssistantClient(configuredBaseUrl || '/api/v1');
}