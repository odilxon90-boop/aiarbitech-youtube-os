import type { User } from '../models/index.js';
import { BaseRepository } from './base-repository.js';
export type CreateUser = Pick<User, 'email' | 'role'>; export type UpdateUser = Partial<Pick<User, 'email' | 'role'>>;
export class UserRepository extends BaseRepository<User, CreateUser, UpdateUser> {
  protected readonly table = 'users';
  protected map(row: Record<string, unknown>): User { return { id: String(row.id), email: String(row.email), role: String(row.role), createdAt: new Date(String(row.created_at)) }; }
  protected createColumns(data: CreateUser) { return { email: data.email, role: data.role }; }
  protected updateColumns(data: UpdateUser) { return { ...(data.email === undefined ? {} : { email: data.email }), ...(data.role === undefined ? {} : { role: data.role }) }; }
}
