import type { WorkflowRecord } from '../models/index.js';
import { BaseRepository } from './base-repository.js';
export type CreateWorkflowRecord = Omit<WorkflowRecord, 'id'>; export type UpdateWorkflowRecord = Partial<Pick<WorkflowRecord, 'status' | 'stage' | 'progress'>>;
export class WorkflowRepository extends BaseRepository<WorkflowRecord, CreateWorkflowRecord, UpdateWorkflowRecord> {
  protected readonly table = 'workflows';
  protected map(row: Record<string, unknown>): WorkflowRecord { return { id: String(row.id), userId: String(row.user_id), status: String(row.status), stage: String(row.stage), progress: Number(row.progress) }; }
  protected createColumns(data: CreateWorkflowRecord) { return { user_id: data.userId, status: data.status, stage: data.stage, progress: data.progress }; }
  protected updateColumns(data: UpdateWorkflowRecord) { return { ...(data.status === undefined ? {} : { status: data.status }), ...(data.stage === undefined ? {} : { stage: data.stage }), ...(data.progress === undefined ? {} : { progress: data.progress }) }; }
}
