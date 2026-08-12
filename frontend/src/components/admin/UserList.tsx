import type { AdminUser } from '../../admin/types';

type LegacyAdminUser = Pick<AdminUser, 'id' | 'name' | 'status'> & {
  role: AdminUser['role'] | Lowercase<AdminUser['role']>;
  email?: string;
};

export function UserList({ users }: { users: readonly LegacyAdminUser[] }) {
  return (
    <section className="card admin-card" aria-labelledby="admin-users-title">
      <p className="section-kicker">{users.length} users registered</p>
      <h2 id="admin-users-title">User Management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="admin-list">
          {users.map((user) => (
            <li key={user.id}>
              <span>{user.name}{user.email ? ` · ${user.email}` : ''}</span>
              <small>{user.role.toUpperCase()} · {user.status}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
