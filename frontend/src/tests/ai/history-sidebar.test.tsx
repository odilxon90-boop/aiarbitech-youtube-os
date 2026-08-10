import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { HistorySidebar } from '../../components/ai/chat/HistorySidebar';
import type { ChatSession } from '../../ai/types';

const session: ChatSession = {
  id: 's1',
  userId: 'creator-1',
  title: 'New chat',
  createdAt: '2026-08-09T00:00:00.000Z',
  updatedAt: '2026-08-09T00:00:00.000Z',
  messages: [
    { id: 'm1', role: 'user', content: 'hello', createdAt: '2026-08-09T00:00:00.000Z' },
    { id: 'm2', role: 'assistant', content: 'hi', createdAt: '2026-08-09T00:00:00.000Z' },
  ],
};

describe('HistorySidebar', () => {
  it('renders a new chat button and an empty state', () => {
    const markup = renderToStaticMarkup(
      <HistorySidebar sessions={[]} onSelect={vi.fn()} onNewChat={vi.fn()} />,
    );
    expect(markup).toContain('data-testid="new-chat"');
    expect(markup).toContain('No conversations yet.');
  });

  it('renders sessions and highlights the active one', () => {
    const markup = renderToStaticMarkup(
      <HistorySidebar sessions={[session]} activeSessionId="s1" onSelect={vi.fn()} onNewChat={vi.fn()} />,
    );
    expect(markup).toContain('New chat');
    expect(markup).toContain('history-item--active');
    expect(markup).toContain('2 messages');
  });
});