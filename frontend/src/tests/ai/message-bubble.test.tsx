import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MessageBubble } from '../../components/ai/chat/MessageBubble';
import type { ChatMessage } from '../../ai/types';

describe('MessageBubble', () => {
  it('renders a user message with user styling', () => {
    const message: ChatMessage = {
      id: 'm1',
      role: 'user',
      content: 'What should I publish next?',
      createdAt: '2026-08-09T00:00:00.000Z',
    };
    const markup = renderToStaticMarkup(<MessageBubble message={message} />);
    expect(markup).toContain('message-bubble--user');
    expect(markup).toContain('What should I publish next?');
  });

  it('renders an assistant response with type and items', () => {
    const message: ChatMessage = {
      id: 'm2',
      role: 'assistant',
      content: 'Here are a few recommendations:',
      type: 'recommendations',
      items: ['Publish 3 shorts this week', 'Add end screens'],
      createdAt: '2026-08-09T00:00:00.000Z',
    };
    const markup = renderToStaticMarkup(<MessageBubble message={message} />);
    expect(markup).toContain('message-bubble--assistant');
    expect(markup).toContain('recommendations');
    expect(markup).toContain('Publish 3 shorts this week');
    expect(markup).toContain('Add end screens');
  });
});