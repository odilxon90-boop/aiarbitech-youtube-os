import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HistoryList } from '../../components/workflow/HistoryList';
import { StageProgress } from '../../components/workflow/StageProgress';
import { WorkflowList } from '../../components/workflow/WorkflowList';
import { WorkflowStatus } from '../../components/workflow/WorkflowStatus';
describe('Workflow components', () => {
  it('renders workflow status and stage progress', () => { expect(renderToStaticMarkup(<WorkflowStatus status="RUNNING" currentStage="VIDEO" />)).toContain('RUNNING'); expect(renderToStaticMarkup(<StageProgress progress={58} stage="VIDEO" />)).toContain('58%'); });
  it('renders workflow list and history', () => { expect(renderToStaticMarkup(<WorkflowList workflows={[{ id: 'w1', title: 'Launch', status: 'RUNNING', progress: 1 }]} />)).toContain('Launch'); expect(renderToStaticMarkup(<HistoryList entries={[{ id: 'h1', timestamp: 'now', event: 'STARTED', detail: 'Mock' }]} />)).toContain('STARTED'); });
});
