import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MessageList } from '../../components/ai/chat/MessageList';
import type { ChatMessage } from '../../ai/types';

const messages: ChatMessage[] = [
  { id: 'm1', role: 'user', content: 'hello', createdAt: '2026-08-09T00:00:00.000Z' },
];

describe('MessageList', () => {
  it('renders messages and an empty state when there are none', () => {
    const empty = renderToStaticMarkup(<MessageList messages={[]} typing={false} />);
    expect(empty).toContain('Ask the AI Assistant anything about your channel.');

    const populated = renderToStaticMarkup(<MessageList messages={messages} typing={false} />);
    expect(populated).toContain('hello');
  });

  it('renders a typing indicator when typing is true', () => {
    const markup = renderToStaticMarkup(<MessageList messages={messages} typing />);
    expect(markup).toContain('data-testid="typing-indicator"');
  });
});