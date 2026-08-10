import { ConflictList } from '../components/ai-sync/ConflictList';
import { ModelVersionList } from '../components/ai-sync/ModelVersionList';
import { StatusCard } from '../components/ai-sync/StatusCard';
import { SyncHistory } from '../components/ai-sync/SyncHistory';

const history = Array.from({ length: 20 }, (_, index) => ({ id: `sync-${index}`, timestamp: `2026-08-09T12:${String(index).padStart(2, '0')}:00Z`, status: index % 5 === 0 ? 'WARNING' : 'SUCCESS', detail: 'Mock recommendation synchronized.' }));
const conflicts = [
  { id: 'c1', subject: 'video-aurora', localDecision: 'Publish now', globalRecommendation: 'Schedule for 18:00', resolution: 'UNRESOLVED' },
  { id: 'c2', subject: 'video-horizon', localDecision: 'Concise title', globalRecommendation: 'Keyword-first title', resolution: 'ACCEPT_GLOBAL' },
  { id: 'c3', subject: 'channel-byte-sized', localDecision: 'Daily', globalRecommendation: 'Three weekly', resolution: 'ACCEPT_LOCAL' },
  { id: 'c4', subject: 'video-draft', localDecision: 'Include CTA', globalRecommendation: 'Remove CTA', resolution: 'MANUAL_OVERRIDE' },
  { id: 'c5', subject: 'creator-lab', localDecision: '60%', globalRecommendation: '65%', resolution: 'UNRESOLVED' },
];
const models = [
  { id: 'm1', name: 'AIArbiTech Director', version: '1.4.0', scope: 'LOCAL_DIRECTOR', active: true },
  { id: 'm2', name: 'Global AI Core Recommendations', version: '3.2.1', scope: 'GLOBAL_AI_CORE', active: true },
  { id: 'm3', name: 'Global AI Core Safety', version: '2.8.0', scope: 'GLOBAL_AI_CORE', active: true },
];
export function AISyncPage() {
  return <section className="ai-sync-page" aria-labelledby="ai-sync-title"><div className="sync-header"><div><p className="eyebrow">Mock data only</p><h2 id="ai-sync-title">AI Director ↔ Global AI Core Sync</h2></div><button type="button">Force mock sync</button></div><div className="sync-grid"><StatusCard status="ACTIVE" lastSynchronizedAt="2026-08-09T12:00:00Z" /><ModelVersionList models={models} /><ConflictList conflicts={conflicts} /><SyncHistory events={history} /></div></section>;
}
