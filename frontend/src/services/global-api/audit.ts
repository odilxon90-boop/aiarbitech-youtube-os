import { GlobalApiClient } from './client';

export interface AuditLog {
  id: string;
  [key: string]: unknown;
}

export class GlobalAuditApi {
  constructor(private readonly client: GlobalApiClient) {}

  log(userId: string, action: string, resource: string, resourceId: string): Promise<AuditLog> {
    return this.client.post<AuditLog>('/audit/logs', { userId, action, resource, resourceId });
  }

  getLogs(userId: string, resource: string): Promise<AuditLog[]> {
    const query = new URLSearchParams({ userId, resource });
    return this.client.get<AuditLog[]>(`/audit/logs?${query.toString()}`);
  }

  exportLogs(userId: string, format: string): Promise<Blob> {
    const query = new URLSearchParams({ userId, format });
    return this.client.get<Blob>(`/audit/logs/export?${query.toString()}`);
  }
}
