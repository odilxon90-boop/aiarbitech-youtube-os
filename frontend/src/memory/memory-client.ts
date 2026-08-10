import type {
  MemorySummary,
  PreferencesPayload,
  DecisionHistoryResponse,
  LearningHistoryResponse,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface MemoryClient {
  loadSummary(signal?: AbortSignal): Promise<MemorySummary>;
  loadPreferences(signal?: AbortSignal): Promise<PreferencesPayload>;
  savePreferences(payload: PreferencesPayload, signal?: AbortSignal): Promise<PreferencesPayload>;
  loadDecisions(signal?: AbortSignal): Promise<DecisionHistoryResponse>;
  addLearning(entry: { event: string; result: string }, signal?: AbortSignal): Promise<LearningHistoryResponse>;
}

export class HttpMemoryClient implements MemoryClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-creator-token',
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Memory API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  private async post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Memory API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  private async put<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Memory API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadSummary(signal?: AbortSignal): Promise<MemorySummary> {
    return this.get<MemorySummary>('/memory/summary', signal);
  }

  loadPreferences(signal?: AbortSignal): Promise<PreferencesPayload> {
    return this.get<PreferencesPayload>('/memory/preferences', signal);
  }

  savePreferences(payload: PreferencesPayload, signal?: AbortSignal): Promise<PreferencesPayload> {
    return this.put<PreferencesPayload>('/memory/preferences', payload, signal);
  }

  loadDecisions(signal?: AbortSignal): Promise<DecisionHistoryResponse> {
    return this.get<DecisionHistoryResponse>('/memory/decisions', signal);
  }

  addLearning(entry: { event: string; result: string }, signal?: AbortSignal): Promise<LearningHistoryResponse> {
    return this.post<LearningHistoryResponse>('/memory/learn', entry, signal);
  }
}

export function createMemoryClient(): MemoryClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpMemoryClient(configuredBaseUrl || '/api/v1');
}
