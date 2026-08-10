import type { Metric } from '../models/index.js';
import { BaseRepository } from './base-repository.js';
export type CreateMetric = Omit<Metric, 'id'>; export type UpdateMetric = Partial<Pick<Metric, 'date' | 'views' | 'subscribers' | 'revenue'>>;
export class MetricRepository extends BaseRepository<Metric, CreateMetric, UpdateMetric> {
  protected readonly table = 'metrics';
  protected map(row: Record<string, unknown>): Metric { return { id: String(row.id), channelId: String(row.channel_id), date: String(row.date), views: Number(row.views), subscribers: Number(row.subscribers), revenue: Number(row.revenue) }; }
  protected createColumns(data: CreateMetric) { return { channel_id: data.channelId, date: data.date, views: data.views, subscribers: data.subscribers, revenue: data.revenue }; }
  protected updateColumns(data: UpdateMetric) { return { ...(data.date === undefined ? {} : { date: data.date }), ...(data.views === undefined ? {} : { views: data.views }), ...(data.subscribers === undefined ? {} : { subscribers: data.subscribers }), ...(data.revenue === undefined ? {} : { revenue: data.revenue }) }; }
}
