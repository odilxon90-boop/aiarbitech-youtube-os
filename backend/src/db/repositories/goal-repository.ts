import type { Goal } from '../models/index.js';
import { BaseRepository } from './base-repository.js';
export type CreateGoal = Omit<Goal, 'id'>; export type UpdateGoal = Partial<Pick<Goal, 'title' | 'target' | 'current' | 'deadline' | 'status'>>;
export class GoalRepository extends BaseRepository<Goal, CreateGoal, UpdateGoal> {
  protected readonly table = 'goals';
  protected map(row: Record<string, unknown>): Goal { return { id: String(row.id), userId: String(row.user_id), title: String(row.title), target: Number(row.target), current: Number(row.current), deadline: row.deadline === null ? null : String(row.deadline), status: String(row.status) }; }
  protected createColumns(data: CreateGoal) { return { user_id: data.userId, title: data.title, target: data.target, current: data.current, deadline: data.deadline, status: data.status }; }
  protected updateColumns(data: UpdateGoal) { return { ...(data.title === undefined ? {} : { title: data.title }), ...(data.target === undefined ? {} : { target: data.target }), ...(data.current === undefined ? {} : { current: data.current }), ...(data.deadline === undefined ? {} : { deadline: data.deadline }), ...(data.status === undefined ? {} : { status: data.status }) }; }
}
