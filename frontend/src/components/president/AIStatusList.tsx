import type { AIStatus } from '../../president/types';

interface LegacyAIStatus { name: string; status: string; detail: string }
interface AIStatusListProps { statuses?: readonly LegacyAIStatus[]; aiStatus?: readonly AIStatus[]; }

export function AIStatusList({ statuses, aiStatus }: AIStatusListProps) {
  const items = aiStatus ?? statuses ?? [];
  return <article className="president-card"><h3>AI Director Status</h3>{items.map((item) => <p key={'id' in item ? item.id : item.name}><strong>{'state' in item ? item.state : item.status}</strong> {item.name}: {'message' in item ? item.message : item.detail}</p>)}</article>;
}
