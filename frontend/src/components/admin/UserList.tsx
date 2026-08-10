export interface AdminUser { id: string; name: string; role: 'creator' | 'admin' | 'viewer'; status: string; }
export function UserList({ users }: { users: readonly AdminUser[] }) {
  return <section className="card admin-card" aria-labelledby="admin-users-title"><p className="section-kicker">Mock data</p><h2 id="admin-users-title">Users</h2><ul className="admin-list">{users.map((user) => <li key={user.id}><span>{user.name}</span><small>{user.role} · {user.status}</small></li>)}</ul></section>;
}
