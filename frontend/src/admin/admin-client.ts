import type {
  UserListResponse,
  ChannelListResponse,
  AiConfig,
  AuditLogResponse,
  AdminHealthResponse,
  AdminSummary,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface AdminClient {
  loadUsers(signal?: AbortSignal): Promise<UserListResponse>;
  loadChannels(signal?: AbortSignal): Promise<ChannelListResponse>;
  loadAiConfig(signal?: AbortSignal): Promise<AiConfig>;
  updateAiConfig(patch: Partial<AiConfig>, signal?: AbortSignal): Promise<AiConfig>;
  loadAuditLogs(signal?: AbortSignal): Promise<AuditLogResponse>;
  loadHealth(signal?: AbortSignal): Promise<AdminHealthResponse>;
  loadSummary(signal?: AbortSignal): Promise<AdminSummary>;
}

export class HttpAdminClient implements AdminClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-admin-token',
  ) {}

  private async request<T>(path: string, method: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', Authorization: `Bearer ${this.token}` };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Admin API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadUsers(signal?: AbortSignal): Promise<UserListResponse> {
    return this.request<UserListResponse>('/admin/users', 'GET', undefined, signal);
  }

  loadChannels(signal?: AbortSignal): Promise<ChannelListResponse> {
    return this.request<ChannelListResponse>('/admin/channels', 'GET', undefined, signal);
  }

  loadAiConfig(signal?: AbortSignal): Promise<AiConfig> {
    return this.request<AiConfig>('/admin/ai-config', 'GET', undefined, signal);
  }

  updateAiConfig(patch: Partial<AiConfig>, signal?: AbortSignal): Promise<AiConfig> {
    return this.request<AiConfig>('/admin/ai-config', 'PUT', patch, signal);
  }

  loadAuditLogs(signal?: AbortSignal): Promise<AuditLogResponse> {
    return this.request<AuditLogResponse>('/admin/audit-logs', 'GET', undefined, signal);
  }

  loadHealth(signal?: AbortSignal): Promise<AdminHealthResponse> {
    return this.request<AdminHealthResponse>('/admin/health', 'GET', undefined, signal);
  }

  async loadSummary(signal?: AbortSignal): Promise<AdminSummary> {
    const [usersRes, channelsRes, aiConfig, auditRes, health] = await Promise.all([
      this.loadUsers(signal),
      this.loadChannels(signal),
      this.loadAiConfig(signal),
      this.loadAuditLogs(signal),
      this.loadHealth(signal),
    ]);
    return {
      users: usersRes.users,
      channels: channelsRes.channels,
      aiConfig,
      auditLogs: auditRes.entries,
      health,
    };
  }
}

export function createAdminClient(): AdminClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpAdminClient(configuredBaseUrl || '/api/v1');
}
