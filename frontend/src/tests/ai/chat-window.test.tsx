import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChatWindow } from '../../components/ai/chat/ChatWindow';
import type { ChatMessage } from '../../ai/types';

describe('ChatWindow', () => {
  it('composes the message list and input, forwarding the send handler', () => {
    const messages: ChatMessage[] = [
      { id: 'm1', role: 'user', content: 'recommend something', createdAt: '2026-08-09T00:00:00.000Z' },
    ];
    const markup = renderToStaticMarkup(<ChatWindow messages={messages} typing={false} onSend={vi.fn()} />);
    expect(markup).toContain('recommend something');
    expect(markup).toContain('aria-label="Message the AI Assistant"');
  });

  it('passes the typing state through to the message list', () => {
    const markup = renderToStaticMarkup(<ChatWindow messages={[]} typing onSend={vi.fn()} />);
    expect(markup).toContain('data-testid="typing-indicator"');
  });
});