import type {
  SyncStatusResponse,
  SyncHistoryEntry,
  Conflict,
  ConflictResolution,
  ModelVersion,
  ForceSyncResponse,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface AISyncClient {
  loadStatus(signal?: AbortSignal): Promise<SyncStatusResponse>;
  loadHistory(signal?: AbortSignal): Promise<{ history: SyncHistoryEntry[] }>;
  forceSync(signal?: AbortSignal): Promise<ForceSyncResponse>;
  loadConflicts(signal?: AbortSignal): Promise<{ conflicts: Conflict[] }>;
  resolveConflict(conflictId: string, resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL', signal?: AbortSignal): Promise<ConflictResolution>;
  loadModels(signal?: AbortSignal): Promise<{ models: ModelVersion[] }>;
}

export class HttpAISyncClient implements AISyncClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-ai-sync-token',
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`AI Sync API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  private async post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`AI Sync API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadStatus(signal?: AbortSignal): Promise<SyncStatusResponse> {
    return this.get<SyncStatusResponse>('/ai-sync/status', signal);
  }

  loadHistory(signal?: AbortSignal): Promise<{ history: SyncHistoryEntry[] }> {
    return this.get<{ history: SyncHistoryEntry[] }>('/ai-sync/history', signal);
  }

  forceSync(signal?: AbortSignal): Promise<ForceSyncResponse> {
    return this.post<ForceSyncResponse>('/ai-sync/force-sync', {}, signal);
  }

  loadConflicts(signal?: AbortSignal): Promise<{ conflicts: Conflict[] }> {
    return this.get<{ conflicts: Conflict[] }>('/ai-sync/conflicts', signal);
  }

  resolveConflict(conflictId: string, resolution: 'LOCAL' | 'GLOBAL' | 'MANUAL', signal?: AbortSignal): Promise<ConflictResolution> {
    return this.post<ConflictResolution>(`/ai-sync/resolve/${conflictId}`, { resolution }, signal);
  }

  loadModels(signal?: AbortSignal): Promise<{ models: ModelVersion[] }> {
    return this.get<{ models: ModelVersion[] }>('/ai-sync/models', signal);
  }
}

export function createAISyncClient(): AISyncClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpAISyncClient(configuredBaseUrl || '/api/v1');
}
