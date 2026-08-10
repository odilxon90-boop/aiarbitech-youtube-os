import type { Channel } from '../models/index.js';
import { BaseRepository } from './base-repository.js';
export type CreateChannel = Pick<Channel, 'userId' | 'name'> & Partial<Pick<Channel, 'subscribers' | 'monetized'>>; export type UpdateChannel = Partial<Pick<Channel, 'name' | 'subscribers' | 'monetized'>>;
export class ChannelRepository extends BaseRepository<Channel, CreateChannel, UpdateChannel> {
  protected readonly table = 'channels';
  protected map(row: Record<string, unknown>): Channel { return { id: String(row.id), userId: String(row.user_id), name: String(row.name), subscribers: Number(row.subscribers), monetized: Boolean(row.monetized) }; }
  protected createColumns(data: CreateChannel) { return { user_id: data.userId, name: data.name, subscribers: data.subscribers ?? 0, monetized: data.monetized ?? false }; }
  protected updateColumns(data: UpdateChannel) { return { ...(data.name === undefined ? {} : { name: data.name }), ...(data.subscribers === undefined ? {} : { subscribers: data.subscribers }), ...(data.monetized === undefined ? {} : { monetized: data.monetized }) }; }
}
