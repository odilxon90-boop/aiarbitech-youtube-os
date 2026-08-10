import type { ChatSession } from '../../../ai/types';

interface HistorySidebarProps {
  sessions: readonly ChatSession[];
  activeSessionId?: string;
  onSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export function HistorySidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNewChat,
}: HistorySidebarProps) {
  return (
    <aside className="history-sidebar" aria-label="Conversation history">
      <button type="button" className="history-sidebar__new" onClick={onNewChat} data-testid="new-chat">
        + New chat
      </button>
      {sessions.length === 0 ? (
        <p className="history-sidebar__empty">No conversations yet.</p>
      ) : (
        <ul className="history-sidebar__list">
          {sessions.map((session) => (
            <li key={session.id}>
              <button
                type="button"
                className={`history-item ${session.id === activeSessionId ? 'history-item--active' : ''}`}
                onClick={() => onSelect(session.id)}
              >
                <span className="history-item__title">{session.title}</span>
                <span className="history-item__meta">{session.messages.length} messages</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}