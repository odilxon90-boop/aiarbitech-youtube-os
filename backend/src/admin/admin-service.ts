export type UserRole = 'creator' | 'admin' | 'viewer';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';
export type ModerationStatus = 'APPROVED' | 'PENDING_REVIEW' | 'RESTRICTED';
export type HealthStatus = 'GREEN' | 'YELLOW' | 'RED';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface AdminChannel {
  id: string;
  name: string;
  ownerId: string;
  status: ModerationStatus;
  availableActions: readonly ('APPROVE' | 'RESTRICT' | 'REQUEST_CHANGES')[];
}

export interface AIConfiguration {
  model: string;
  temperature: number;
  maxTokens: number;
  dailyVideoLimit: number;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  category: 'USER' | 'CHANNEL' | 'SYSTEM';
}

export interface SystemHealthMetric {
  name: 'API' | 'Database' | 'AI Core' | 'YouTube';
  status: HealthStatus;
  detail: string;
}

const users: AdminUser[] = [
  ['user-01', 'Amina Karimova', 'amina@example.test', 'creator', 'ACTIVE'],
  ['user-02', 'Bob Davis', 'bob@example.test', 'viewer', 'ACTIVE'],
  ['user-03', 'Chloe Martin', 'chloe@example.test', 'admin', 'ACTIVE'],
  ['user-04', 'Diyor Tursunov', 'diyor@example.test', 'creator', 'PENDING'],
  ['user-05', 'Elena Ruiz', 'elena@example.test', 'viewer', 'SUSPENDED'],
  ['user-06', 'Farid Ahmed', 'farid@example.test', 'creator', 'ACTIVE'],
  ['user-07', 'Grace Kim', 'grace@example.test', 'viewer', 'ACTIVE'],
  ['user-08', 'Hasan Aliyev', 'hasan@example.test', 'creator', 'ACTIVE'],
  ['user-09', 'Iris Chen', 'iris@example.test', 'admin', 'ACTIVE'],
  ['user-10', 'Jasur Mirzaev', 'jasur@example.test', 'viewer', 'PENDING'],
].map(([id, name, email, role, status]) => ({
  id: id!,
  name: name!,
  email: email!,
  role: role as UserRole,
  status: status as UserStatus,
}));

const channels: AdminChannel[] = [
  ['channel-01', 'Aurora Stories', 'user-01', 'APPROVED'],
  ['channel-02', 'Byte Sized', 'user-04', 'PENDING_REVIEW'],
  ['channel-03', 'Creator Lab', 'user-06', 'APPROVED'],
  ['channel-04', 'Daily Focus', 'user-08', 'RESTRICTED'],
  ['channel-05', 'Explore Atlas', 'user-01', 'APPROVED'],
  ['channel-06', 'Future Frame', 'user-04', 'PENDING_REVIEW'],
  ['channel-07', 'Game Craft', 'user-06', 'APPROVED'],
  ['channel-08', 'Home Studio', 'user-08', 'RESTRICTED'],
  ['channel-09', 'Insight Loop', 'user-01', 'APPROVED'],
  ['channel-10', 'Journey Notes', 'user-06', 'PENDING_REVIEW'],
].map(([id, name, ownerId, status]) => ({
  id: id!,
  name: name!,
  ownerId: ownerId!,
  status: status as ModerationStatus,
  availableActions: ['APPROVE', 'RESTRICT', 'REQUEST_CHANGES'],
}));

const auditLogs: readonly AdminAuditLog[] = Array.from({ length: 15 }, (_, index) => ({
  id: `audit-${String(index + 1).padStart(2, '0')}`,
  timestamp: `2026-08-09T${String(12 - Math.floor(index / 3)).padStart(2, '0')}:${String(index * 3).padStart(2, '0')}:00.000Z`,
  actor: index % 3 === 0 ? 'admin.chloe' : 'system',
  action: ['USER_STATUS_UPDATED', 'CHANNEL_REVIEWED', 'AI_CONFIG_VIEWED'][index % 3]!,
  target: index % 3 === 0 ? `user-${String(index + 1).padStart(2, '0')}` : `channel-${String(index + 1).padStart(2, '0')}`,
  category: ['USER', 'CHANNEL', 'SYSTEM'][index % 3] as AdminAuditLog['category'],
}));

export class AdminService {
  private aiConfiguration: AIConfiguration = {
    model: 'aiarbitech-director-mock-v1',
    temperature: 0.7,
    maxTokens: 2_048,
    dailyVideoLimit: 12,
  };

  listUsers(): readonly AdminUser[] {
    return users;
  }

  updateUserStatus(id: string, status: UserStatus): AdminUser {
    const user = users.find((item) => item.id === id);
    if (!user) throw new Error(`User ${id} was not found.`);
    user.status = status;
    return user;
  }

  listChannels(): readonly AdminChannel[] {
    return channels;
  }

  moderateChannel(id: string, status: ModerationStatus): AdminChannel {
    const channel = channels.find((item) => item.id === id);
    if (!channel) throw new Error(`Channel ${id} was not found.`);
    channel.status = status;
    return channel;
  }

  getAIConfiguration(): AIConfiguration {
    return this.aiConfiguration;
  }

  updateAIConfiguration(configuration: AIConfiguration): AIConfiguration {
    this.aiConfiguration = configuration;
    return this.aiConfiguration;
  }

  listAuditLogs(): readonly AdminAuditLog[] {
    return auditLogs;
  }

  getHealth(): readonly SystemHealthMetric[] {
    return [
      { name: 'API', status: 'GREEN', detail: 'Mock API latency: 42ms' },
      { name: 'Database', status: 'GREEN', detail: 'Mock connection pool healthy' },
      { name: 'AI Core', status: 'YELLOW', detail: 'Mock queue utilization: 74%' },
      { name: 'YouTube', status: 'RED', detail: 'Mock external publishing connection unavailable' },
    ];
  }
}
