export type WorkflowStage = 'IDEA' | 'SCRIPT' | 'MUSIC' | 'VIDEO' | 'THUMBNAIL' | 'QUALITY' | 'PUBLISH';
export type StageStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED';
export type WorkflowStatus = 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export interface WorkflowStageState {
  stage: WorkflowStage;
  status: StageStatus;
  estimatedExecutionSeconds: 1 | 2 | 3;
}
export interface Workflow {
  id: string;
  userId: string;
  title: string;
  status: WorkflowStatus;
  currentStage: WorkflowStage;
  progress: number;
  stages: readonly WorkflowStageState[];
  logs: readonly string[];
  createdAt: string;
}
export interface WorkflowHistoryEntry {
  id: string;
  workflowId: string;
  timestamp: string;
  event: string;
  detail: string;
}

const stages: readonly WorkflowStage[] = ['IDEA', 'SCRIPT', 'MUSIC', 'VIDEO', 'THUMBNAIL', 'QUALITY', 'PUBLISH'];
function stageStates(currentStage: WorkflowStage, status: WorkflowStatus): readonly WorkflowStageState[] {
  const currentIndex = stages.indexOf(currentStage);
  return stages.map((stage, index) => ({
    stage,
    status: status === 'COMPLETED'
      ? 'COMPLETED'
      : status === 'FAILED' && index === currentIndex
        ? 'FAILED'
        : status === 'PAUSED' && index === currentIndex
          ? 'PAUSED'
          : status === 'CANCELLED' && index === currentIndex
            ? 'FAILED'
            : index < currentIndex ? 'COMPLETED' : index === currentIndex ? 'RUNNING' : 'PENDING',
    estimatedExecutionSeconds: ([1, 2, 3][index % 3]!) as 1 | 2 | 3,
  }));
}
const workflowSeeds: readonly [string, string, string, WorkflowStatus, WorkflowStage, number][] = [
  ['workflow-01', 'user-01', 'Aurora launch story', 'RUNNING', 'VIDEO', 58],
  ['workflow-02', 'user-01', 'Creator soundtrack', 'PAUSED', 'MUSIC', 29],
  ['workflow-03', 'user-04', 'Channel trailer', 'COMPLETED', 'PUBLISH', 100],
  ['workflow-04', 'user-06', 'Product explainer', 'FAILED', 'QUALITY', 82],
  ['workflow-05', 'user-08', 'Weekly roundup', 'CANCELLED', 'SCRIPT', 14],
];
const workflows: Workflow[] = workflowSeeds.map(([id, userId, title, status, currentStage, progress], index) => ({
  id, userId, title, status, currentStage, progress,
  stages: stageStates(currentStage, status),
  logs: [`Mock workflow initialized.`, `Mock ${currentStage!.toLowerCase()} stage status: ${status}.`],
  createdAt: `2026-08-09T${String(10 + index).padStart(2, '0')}:00:00.000Z`,
}));
const history: readonly WorkflowHistoryEntry[] = Array.from({ length: 12 }, (_, index) => ({
  id: `workflow-history-${String(index + 1).padStart(2, '0')}`,
  workflowId: workflows[index % workflows.length]!.id,
  timestamp: `2026-08-09T${String(18 - Math.floor(index / 2)).padStart(2, '0')}:${String(index * 5).padStart(2, '0')}:00.000Z`,
  event: ['STAGE_COMPLETED', 'WORKFLOW_PAUSED', 'WORKFLOW_RESUMED'][index % 3]!,
  detail: 'Mock workflow history event.',
}));

export class WorkflowService {
  private counter = workflows.length;
  start(userId: string, title: string): Workflow {
    this.counter += 1;
    const workflow: Workflow = {
      id: `workflow-${String(this.counter).padStart(2, '0')}`, userId, title, status: 'RUNNING', currentStage: 'IDEA', progress: 0,
      stages: stageStates('IDEA', 'RUNNING'),
      logs: ['Mock workflow started.', 'IDEA stage is running with a 1 second mock execution estimate.'],
      createdAt: new Date().toISOString(),
    };
    workflows.unshift(workflow);
    return workflow;
  }
  status(id: string): Workflow { return this.find(id); }
  historyForUser(userId?: string): readonly WorkflowHistoryEntry[] {
    return userId ? history.filter((entry) => this.find(entry.workflowId).userId === userId) : history;
  }
  pause(id: string): Workflow { return this.transition(id, 'PAUSED'); }
  resume(id: string): Workflow { return this.transition(id, 'RUNNING'); }
  cancel(id: string): Workflow { return this.transition(id, 'CANCELLED'); }
  private find(id: string): Workflow {
    const workflow = workflows.find((item) => item.id === id);
    if (!workflow) throw new Error(`Workflow ${id} was not found.`);
    return workflow;
  }
  private transition(id: string, status: WorkflowStatus): Workflow {
    const workflow = this.find(id);
    const allowedTransitions: Readonly<Record<WorkflowStatus, readonly WorkflowStatus[]>> = {
      RUNNING: ['PAUSED', 'CANCELLED'],
      PAUSED: ['RUNNING', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
      FAILED: [],
    };
    if (!allowedTransitions[workflow.status].includes(status)) {
      throw new PlatformError(409, 'INVALID_WORKFLOW_TRANSITION', `Workflow ${id} cannot transition from ${workflow.status} to ${status}.`);
    }
    workflow.status = status;
    workflow.stages = stageStates(workflow.currentStage, status);
    workflow.logs = [...workflow.logs, `Mock workflow ${status.toLowerCase()}.`];
    return workflow;
  }
}
import { PlatformError } from '../shared/errors.js';
