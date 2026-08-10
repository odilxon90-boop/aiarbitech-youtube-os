// Admin Panel service. Returns mock/stub data only; no real database,
// no persistence, no business runtime. Replace with data source after Gate 0.

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

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

export interface UpdateUserStatusResponse {
  id: string;
  status: UserStatus;
  updatedAt: string;
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

export interface ModerateChannelRequest {
  status: ChannelModerationStatus;
  note: string;
}

export interface ModerateChannelResponse {
  id: string;
  moderationStatus: ChannelModerationStatus;
  note: string;
  updatedAt: string;
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

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOW = new Date().toISOString();

const MOCK_USERS: AdminUser[] = [
  { id: 'usr-1', name: 'Alex Creator', email: 'alex@aiarbitech.io', role: 'CREATOR', status: 'ACTIVE', joinedAt: '2025-01-15T09:00:00Z', lastActiveAt: NOW, channelCount: 2 },
  { id: 'usr-2', name: 'Jordan Smith', email: 'jordan@aiarbitech.io', role: 'CREATOR', status: 'ACTIVE', joinedAt: '2025-03-22T11:00:00Z', lastActiveAt: '2026-08-08T18:30:00Z', channelCount: 1 },
  { id: 'usr-3', name: 'Sam Admin', email: 'sam@aiarbitech.io', role: 'ADMIN', status: 'ACTIVE', joinedAt: '2024-12-01T08:00:00Z', lastActiveAt: NOW, channelCount: 0 },
  { id: 'usr-4', name: 'Riley Viewer', email: 'riley@aiarbitech.io', role: 'VIEWER', status: 'ACTIVE', joinedAt: '2026-02-10T14:00:00Z', lastActiveAt: '2026-07-20T10:00:00Z', channelCount: 0 },
  { id: 'usr-5', name: 'Casey Content', email: 'casey@aiarbitech.io', role: 'CREATOR', status: 'SUSPENDED', joinedAt: '2025-06-01T09:00:00Z', lastActiveAt: '2026-06-15T09:00:00Z', channelCount: 3 },
  { id: 'usr-6', name: 'Morgan Tech', email: 'morgan@aiarbitech.io', role: 'CREATOR', status: 'ACTIVE', joinedAt: '2025-09-11T10:00:00Z', lastActiveAt: '2026-08-07T20:00:00Z', channelCount: 1 },
  { id: 'usr-7', name: 'Dana Media', email: 'dana@aiarbitech.io', role: 'CREATOR', status: 'PENDING', joinedAt: '2026-08-01T12:00:00Z', lastActiveAt: '2026-08-01T12:00:00Z', channelCount: 0 },
  { id: 'usr-8', name: 'Chris Growth', email: 'chris@aiarbitech.io', role: 'CREATOR', status: 'ACTIVE', joinedAt: '2025-11-05T15:00:00Z', lastActiveAt: '2026-08-09T08:00:00Z', channelCount: 2 },
  { id: 'usr-9', name: 'Taylor AI', email: 'taylor@aiarbitech.io', role: 'CREATOR', status: 'ACTIVE', joinedAt: '2026-01-20T09:00:00Z', lastActiveAt: '2026-08-09T07:30:00Z', channelCount: 1 },
  { id: 'usr-10', name: 'Quinn Analytics', email: 'quinn@aiarbitech.io', role: 'VIEWER', status: 'ACTIVE', joinedAt: '2026-04-14T16:00:00Z', lastActiveAt: '2026-08-05T11:00:00Z', channelCount: 0 },
  { id: 'usr-11', name: 'Avery Platform', email: 'avery@aiarbitech.io', role: 'ADMIN', status: 'ACTIVE', joinedAt: '2024-11-01T08:00:00Z', lastActiveAt: NOW, channelCount: 0 },
];

const MOCK_CHANNELS: AdminChannel[] = [
  { id: 'chn-1', title: 'AIArbiTech Actions', ownerId: 'usr-1', ownerName: 'Alex Creator', subscriberCount: '18,240', videoCount: 42, moderationStatus: 'APPROVED', flags: [], createdAt: '2025-01-20T09:00:00Z' },
  { id: 'chn-2', title: 'AI Automation Lab', ownerId: 'usr-1', ownerName: 'Alex Creator', subscriberCount: '9,610', videoCount: 17, moderationStatus: 'APPROVED', flags: [], createdAt: '2025-04-10T11:00:00Z' },
  { id: 'chn-3', title: 'JordanAI Hub', ownerId: 'usr-2', ownerName: 'Jordan Smith', subscriberCount: '4,820', videoCount: 28, moderationStatus: 'APPROVED', flags: [], createdAt: '2025-05-01T09:00:00Z' },
  { id: 'chn-4', title: 'Casey Viral Zone', ownerId: 'usr-5', ownerName: 'Casey Content', subscriberCount: '62,000', videoCount: 110, moderationStatus: 'SUSPENDED', flags: ['spam', 'misleading-titles'], createdAt: '2025-07-15T08:00:00Z' },
  { id: 'chn-5', title: 'Casey Shorts Dump', ownerId: 'usr-5', ownerName: 'Casey Content', subscriberCount: '12,400', videoCount: 300, moderationStatus: 'FLAGGED', flags: ['excessive-uploads'], createdAt: '2025-09-01T10:00:00Z' },
  { id: 'chn-6', title: 'MorganTech Explained', ownerId: 'usr-6', ownerName: 'Morgan Tech', subscriberCount: '7,340', videoCount: 22, moderationStatus: 'APPROVED', flags: [], createdAt: '2025-10-14T12:00:00Z' },
  { id: 'chn-7', title: 'Chris Growth Lab', ownerId: 'usr-8', ownerName: 'Chris Growth', subscriberCount: '11,100', videoCount: 35, moderationStatus: 'APPROVED', flags: [], createdAt: '2025-12-01T14:00:00Z' },
  { id: 'chn-8', title: 'Taylor AI Automation', ownerId: 'usr-9', ownerName: 'Taylor AI', subscriberCount: '3,990', videoCount: 14, moderationStatus: 'UNDER_REVIEW', flags: ['copyright-query'], createdAt: '2026-02-10T09:00:00Z' },
  { id: 'chn-9', title: 'Chris Side Channel', ownerId: 'usr-8', ownerName: 'Chris Growth', subscriberCount: '1,800', videoCount: 9, moderationStatus: 'APPROVED', flags: [], createdAt: '2026-03-20T10:00:00Z' },
  { id: 'chn-10', title: 'Casey Clips', ownerId: 'usr-5', ownerName: 'Casey Content', subscriberCount: '5,200', videoCount: 85, moderationStatus: 'FLAGGED', flags: ['re-uploaded-content'], createdAt: '2026-01-05T11:00:00Z' },
];

let LIVE_AI_CONFIG: AiConfig = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 2048,
  topicWeighting: 'engagement',
  recommendationsPerDay: 5,
  enabled: true,
  updatedAt: '2026-08-01T08:00:00Z',
};

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-01', at: '2026-08-09T07:55:00Z', actor: 'Sam Admin', actorRole: 'ADMIN', action: 'UPDATE_USER_STATUS', resource: 'user', resourceId: 'usr-5', outcome: 'SUCCESS', ip: '10.0.0.1' },
  { id: 'log-02', at: '2026-08-09T07:50:00Z', actor: 'Sam Admin', actorRole: 'ADMIN', action: 'MODERATE_CHANNEL', resource: 'channel', resourceId: 'chn-4', outcome: 'SUCCESS', ip: '10.0.0.1' },
  { id: 'log-03', at: '2026-08-09T07:30:00Z', actor: 'Avery Platform', actorRole: 'ADMIN', action: 'UPDATE_AI_CONFIG', resource: 'ai-config', resourceId: 'global', outcome: 'SUCCESS', ip: '10.0.0.2' },
  { id: 'log-04', at: '2026-08-09T06:15:00Z', actor: 'Alex Creator', actorRole: 'CREATOR', action: 'UPLOAD_VIDEO', resource: 'video', resourceId: 'vid-123', outcome: 'SUCCESS', ip: '192.168.1.10' },
  { id: 'log-05', at: '2026-08-09T05:00:00Z', actor: 'Casey Content', actorRole: 'CREATOR', action: 'LOGIN', resource: 'auth', resourceId: 'usr-5', outcome: 'FAILURE', ip: '203.0.113.5' },
  { id: 'log-06', at: '2026-08-08T22:10:00Z', actor: 'Sam Admin', actorRole: 'ADMIN', action: 'MODERATE_CHANNEL', resource: 'channel', resourceId: 'chn-10', outcome: 'SUCCESS', ip: '10.0.0.1' },
  { id: 'log-07', at: '2026-08-08T20:00:00Z', actor: 'Jordan Smith', actorRole: 'CREATOR', action: 'PUBLISH_VIDEO', resource: 'video', resourceId: 'vid-118', outcome: 'SUCCESS', ip: '192.168.2.14' },
  { id: 'log-08', at: '2026-08-08T18:45:00Z', actor: 'Avery Platform', actorRole: 'ADMIN', action: 'CREATE_USER', resource: 'user', resourceId: 'usr-7', outcome: 'SUCCESS', ip: '10.0.0.2' },
  { id: 'log-09', at: '2026-08-08T17:00:00Z', actor: 'Taylor AI', actorRole: 'CREATOR', action: 'LOGIN', resource: 'auth', resourceId: 'usr-9', outcome: 'SUCCESS', ip: '172.16.0.5' },
  { id: 'log-10', at: '2026-08-08T15:30:00Z', actor: 'Chris Growth', actorRole: 'CREATOR', action: 'UPLOAD_VIDEO', resource: 'video', resourceId: 'vid-114', outcome: 'SUCCESS', ip: '192.168.3.20' },
  { id: 'log-11', at: '2026-08-08T14:00:00Z', actor: 'Sam Admin', actorRole: 'ADMIN', action: 'VIEW_AUDIT_LOGS', resource: 'audit-log', resourceId: 'global', outcome: 'SUCCESS', ip: '10.0.0.1' },
  { id: 'log-12', at: '2026-08-08T12:15:00Z', actor: 'Morgan Tech', actorRole: 'CREATOR', action: 'PUBLISH_VIDEO', resource: 'video', resourceId: 'vid-109', outcome: 'SUCCESS', ip: '192.168.4.30' },
  { id: 'log-13', at: '2026-08-08T10:00:00Z', actor: 'Avery Platform', actorRole: 'ADMIN', action: 'SUSPEND_CHANNEL', resource: 'channel', resourceId: 'chn-5', outcome: 'SUCCESS', ip: '10.0.0.2' },
  { id: 'log-14', at: '2026-08-08T08:30:00Z', actor: 'Riley Viewer', actorRole: 'VIEWER', action: 'LOGIN', resource: 'auth', resourceId: 'usr-4', outcome: 'SUCCESS', ip: '198.51.100.7' },
  { id: 'log-15', at: '2026-08-07T23:45:00Z', actor: 'Sam Admin', actorRole: 'ADMIN', action: 'UPDATE_AI_CONFIG', resource: 'ai-config', resourceId: 'global', outcome: 'SUCCESS', ip: '10.0.0.1' },
  { id: 'log-16', at: '2026-08-07T21:00:00Z', actor: 'Alex Creator', actorRole: 'CREATOR', action: 'SCHEDULE_VIDEO', resource: 'video', resourceId: 'vid-122', outcome: 'SUCCESS', ip: '192.168.1.10' },
];

function nowIso(): string {
  return new Date().toISOString();
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function listUsers(): Promise<UserListResponse> {
  return { count: MOCK_USERS.length, users: MOCK_USERS };
}

export async function updateUserStatus(id: string, req: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse | null> {
  const user = MOCK_USERS.find((u) => u.id === id);
  if (!user) return null;
  user.status = req.status;
  return { id, status: req.status, updatedAt: nowIso() };
}

export async function listChannels(): Promise<ChannelListResponse> {
  return { count: MOCK_CHANNELS.length, channels: MOCK_CHANNELS };
}

export async function moderateChannel(id: string, req: ModerateChannelRequest): Promise<ModerateChannelResponse | null> {
  const channel = MOCK_CHANNELS.find((c) => c.id === id);
  if (!channel) return null;
  channel.moderationStatus = req.status;
  return { id, moderationStatus: req.status, note: req.note, updatedAt: nowIso() };
}

export async function getAiConfig(): Promise<AiConfig> {
  return LIVE_AI_CONFIG;
}

export async function updateAiConfig(patch: Partial<AiConfig>): Promise<AiConfig> {
  LIVE_AI_CONFIG = { ...LIVE_AI_CONFIG, ...patch, updatedAt: nowIso() };
  return LIVE_AI_CONFIG;
}

export async function getAuditLogs(): Promise<AuditLogResponse> {
  return { count: MOCK_AUDIT_LOGS.length, entries: MOCK_AUDIT_LOGS };
}

export async function getAdminHealth(): Promise<AdminHealthResponse> {
  const metrics: AdminHealthMetric[] = [
    { service: 'API Gateway', status: 'OK', latencyMs: 12, detail: 'All routes responding normally.', checkedAt: nowIso() },
    { service: 'Database', status: 'OK', latencyMs: 8, detail: 'Connection pool healthy (12/20 active).', checkedAt: nowIso() },
    { service: 'AI Core', status: 'OK', latencyMs: 142, detail: 'GPT-4o-mini responding within SLA.', checkedAt: nowIso() },
    { service: 'YouTube API', status: 'DEGRADED', latencyMs: 820, detail: 'Quota at 78%. Rate limit warnings active.', checkedAt: nowIso() },
    { service: 'Storage', status: 'OK', latencyMs: 22, detail: 'Bucket accessible. 18 GB used of 100 GB.', checkedAt: nowIso() },
  ];
  const overall: HealthStatus = metrics.some((m) => m.status === 'DOWN')
    ? 'DOWN'
    : metrics.some((m) => m.status === 'DEGRADED')
    ? 'DEGRADED'
    : 'OK';
  return { overall, metrics };
}
