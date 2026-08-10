import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { UserList } from '../../components/admin/UserList';
import { ChannelModeration } from '../../components/admin/ChannelModeration';
import type { AdminUser, AdminChannel } from '../../admin/types';

const users: AdminUser[] = [
  { id: 'usr-1', name: 'Alex Creator', email: 'alex@aiarbitech.io', role: 'CREATOR', status: 'ACTIVE', joinedAt: '2025-01-15T09:00:00Z', lastActiveAt: '2026-08-09T09:00:00Z', channelCount: 2 },
  { id: 'usr-2', name: 'Sam Admin', email: 'sam@aiarbitech.io', role: 'ADMIN', status: 'ACTIVE', joinedAt: '2024-12-01T08:00:00Z', lastActiveAt: '2026-08-09T09:00:00Z', channelCount: 0 },
  { id: 'usr-3', name: 'Casey Content', email: 'casey@aiarbitech.io', role: 'CREATOR', status: 'SUSPENDED', joinedAt: '2025-06-01T09:00:00Z', lastActiveAt: '2026-06-15T09:00:00Z', channelCount: 3 },
];

const channels: AdminChannel[] = [
  { id: 'chn-1', title: 'AIArbiTech Actions', ownerId: 'usr-1', ownerName: 'Alex Creator', subscriberCount: '18,240', videoCount: 42, moderationStatus: 'APPROVED', flags: [], createdAt: '2025-01-20T09:00:00Z' },
  { id: 'chn-2', title: 'Casey Viral Zone', ownerId: 'usr-3', ownerName: 'Casey Content', subscriberCount: '62,000', videoCount: 110, moderationStatus: 'SUSPENDED', flags: ['spam', 'misleading-titles'], createdAt: '2025-07-15T08:00:00Z' },
  { id: 'chn-3', title: 'Taylor AI', ownerId: 'usr-4', ownerName: 'Taylor AI', subscriberCount: '3,990', videoCount: 14, moderationStatus: 'UNDER_REVIEW', flags: ['copyright-query'], createdAt: '2026-02-10T09:00:00Z' },
];

describe('UserList', () => {
  it('renders all users with names, roles, and statuses', () => {
    const markup = renderToStaticMarkup(<UserList users={users} />);
    expect(markup).toContain('User Management');
    expect(markup).toContain('Alex Creator');
    expect(markup).toContain('Sam Admin');
    expect(markup).toContain('Casey Content');
    expect(markup).toContain('ACTIVE');
    expect(markup).toContain('SUSPENDED');
    expect(markup).toContain('alex@aiarbitech.io');
  });

  it('shows empty state when no users', () => {
    const markup = renderToStaticMarkup(<UserList users={[]} />);
    expect(markup).toContain('No users found.');
  });

  it('shows user count', () => {
    const markup = renderToStaticMarkup(<UserList users={users} />);
    expect(markup).toContain('3 users registered');
  });
});

describe('ChannelModeration', () => {
  it('renders channels with moderation status and flags', () => {
    const markup = renderToStaticMarkup(<ChannelModeration channels={channels} />);
    expect(markup).toContain('Channel Moderation');
    expect(markup).toContain('AIArbiTech Actions');
    expect(markup).toContain('Casey Viral Zone');
    expect(markup).toContain('APPROVED');
    expect(markup).toContain('SUSPENDED');
    expect(markup).toContain('UNDER REVIEW');
    expect(markup).toContain('spam');
    expect(markup).toContain('misleading-titles');
  });

  it('shows count and flagged channels count', () => {
    const markup = renderToStaticMarkup(<ChannelModeration channels={channels} />);
    expect(markup).toContain('3 channels');
    expect(markup).toContain('2 requiring attention');
  });

  it('shows empty state when no channels', () => {
    const markup = renderToStaticMarkup(<ChannelModeration channels={[]} />);
    expect(markup).toContain('No channels found.');
  });
});
