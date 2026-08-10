import { HistoryList } from '../components/workflow/HistoryList';
import { StageProgress } from '../components/workflow/StageProgress';
import { WorkflowList } from '../components/workflow/WorkflowList';
import { WorkflowStatus } from '../components/workflow/WorkflowStatus';
const workflowSeeds: readonly [string, string, number][] = [['Aurora launch story', 'RUNNING', 58], ['Creator soundtrack', 'PAUSED', 29], ['Channel trailer', 'COMPLETED', 100], ['Product explainer', 'FAILED', 82], ['Weekly roundup', 'CANCELLED', 14]];
const workflows = workflowSeeds.map(([title, status, progress], index) => ({ id: `workflow-${index}`, title, status, progress }));
const entries = Array.from({ length: 12 }, (_, index) => ({ id: `history-${index}`, timestamp: `2026-08-09T12:${String(index).padStart(2, '0')}:00Z`, event: index % 2 ? 'STAGE_COMPLETED' : 'WORKFLOW_STARTED', detail: 'Mock workflow event.' }));
export function WorkflowPage() { return <section className="workflow-page" aria-labelledby="workflow-page-title"><div className="workflow-header"><div><p className="eyebrow">Mock data only</p><h2 id="workflow-page-title">AI Workflow Engine</h2></div><button type="button">Start mock workflow</button></div><div className="workflow-grid"><WorkflowStatus status="RUNNING" currentStage="VIDEO" /><StageProgress progress={58} stage="VIDEO" /><WorkflowList workflows={workflows} /><HistoryList entries={entries} /></div></section>; }
