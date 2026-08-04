import type { ReactNode } from 'react';

interface StatePanelProps {
  tone: 'neutral' | 'success' | 'warning' | 'danger';
  title: string;
  children: ReactNode;
}

function StatePanel({ tone, title, children }: StatePanelProps) {
  return (
    <div className={`state-panel state-panel--${tone}`} role="status">
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}

export function LoadingState({ message = 'Loading platform foundation status…' }: { message?: string }) {
  return <StatePanel tone="neutral" title="Loading">{message}</StatePanel>;
}

export function EmptyState({ message = 'No platform metadata is available.' }: { message?: string }) {
  return <StatePanel tone="warning" title="No data">{message}</StatePanel>;
}

export function ErrorState({ message }: { message: string }) {
  return <StatePanel tone="danger" title="Unable to load status">{message}</StatePanel>;
}
