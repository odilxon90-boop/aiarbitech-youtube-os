// Admin Panel types. Mirrors the backend admin service DTOs.

export type UserRole = 'CREATOR' | 'ADMIN' | 'VIEWER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastActiveAt: string;
  channelCount: number;
}

export interface UserListResponse {
  count: number;
  users: AdminUser[];
}

export type ChannelModerationStatus = 'APPROVED' | 'UNDER_REVIEW' | 'SUSPENDED' | 'FLAGGED';

export interface AdminChannel {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  subscriberCount: string;
  videoCount: number;
  moderationStatus: ChannelModerationStatus;
  flags: string[];
  createdAt: string;
}

export interface ChannelListResponse {
  count: number;
  channels: AdminChannel[];
}

export interface AiConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topicWeighting: string;
  recommendationsPerDay: number;
  enabled: boolean;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  at: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  outcome: 'SUCCESS' | 'FAILURE';
  ip: string;
}

export interface AuditLogResponse {
  count: number;
  entries: AuditLogEntry[];
}

export type HealthStatus = 'OK' | 'DEGRADED' | 'DOWN';

export interface AdminHealthMetric {
  service: string;
  status: HealthStatus;
  latencyMs: number;
  detail: string;
  checkedAt: string;
}

export interface AdminHealthResponse {
  overall: HealthStatus;
  metrics: AdminHealthMetric[];
}

export interface AdminSummary {
  users: AdminUser[];
  channels: AdminChannel[];
  aiConfig: AiConfig;
  auditLogs: AuditLogEntry[];
  health: AdminHealthResponse;
}
