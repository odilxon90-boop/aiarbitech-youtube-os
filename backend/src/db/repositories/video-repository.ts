import type { Video } from '../models/index.js';
import { BaseRepository } from './base-repository.js';
export type CreateVideo = Pick<Video, 'channelId' | 'title'> & Partial<Pick<Video, 'views' | 'likes' | 'comments'>>; export type UpdateVideo = Partial<Pick<Video, 'title' | 'views' | 'likes' | 'comments'>>;
export class VideoRepository extends BaseRepository<Video, CreateVideo, UpdateVideo> {
  protected readonly table = 'videos';
  protected map(row: Record<string, unknown>): Video { return { id: String(row.id), channelId: String(row.channel_id), title: String(row.title), views: Number(row.views), likes: Number(row.likes), comments: Number(row.comments) }; }
  protected createColumns(data: CreateVideo) { return { channel_id: data.channelId, title: data.title, views: data.views ?? 0, likes: data.likes ?? 0, comments: data.comments ?? 0 }; }
  protected updateColumns(data: UpdateVideo) { return { ...(data.title === undefined ? {} : { title: data.title }), ...(data.views === undefined ? {} : { views: data.views }), ...(data.likes === undefined ? {} : { likes: data.likes }), ...(data.comments === undefined ? {} : { comments: data.comments }) }; }
}
