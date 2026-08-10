export type ReadinessStatus = 'PASS' | 'REVIEW' | 'FAIL';

export function ReadinessBadge({ status }: { status: ReadinessStatus }) {
  return <span className={`readiness-badge readiness-badge--${status.toLowerCase()}`}>{status}</span>;
}
