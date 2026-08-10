<<<<<<< HEAD
import type { AdminUser } from '../../admin/types';

const STATUS_BADGE: Record<AdminUser['status'], string> = {
  ACTIVE: 'status-badge--active',
  SUSPENDED: 'status-badge--suspended',
  PENDING: 'status-badge--pending',
};

const ROLE_ICON: Record<AdminUser['role'], string> = {
  CREATOR: '🎬',
  ADMIN: '🛡️',
  VIEWER: '👁️',
};

export interface UserListProps {
  users: readonly AdminUser[];
}

export function UserList({ users }: UserListProps) {
  return (
    <section className="card" aria-label="User Management">
      <h3 className="card-title">User Management</h3>
      <p className="muted">{users.length} users registered</p>
      {users.length === 0 ? (
        <p className="muted">No users found.</p>
      ) : (
        <ul className="admin-user-list">
          {users.map((user) => (
            <li key={user.id} className="admin-user-item">
              <div className="admin-user-head">
                <span className="role-icon" title={user.role}>{ROLE_ICON[user.role]}</span>
                <strong>{user.name}</strong>
                <span className={`status-badge ${STATUS_BADGE[user.status]}`}>{user.status}</span>
              </div>
              <div className="admin-user-meta">
                <span>{user.email}</span>
                <span>{user.channelCount} channel{user.channelCount !== 1 ? 's' : ''}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
=======
export interface AdminUser { id: string; name: string; role: 'creator' | 'admin' | 'viewer'; status: string; }
export function UserList({ users }: { users: readonly AdminUser[] }) {
  return <section className="card admin-card" aria-labelledby="admin-users-title"><p className="section-kicker">Mock data</p><h2 id="admin-users-title">Users</h2><ul className="admin-list">{users.map((user) => <li key={user.id}><span>{user.name}</span><small>{user.role} · {user.status}</small></li>)}</ul></section>;
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
}
