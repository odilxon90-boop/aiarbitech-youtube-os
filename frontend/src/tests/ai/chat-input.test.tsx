import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChatInput } from '../../components/ai/chat/ChatInput';

describe('ChatInput', () => {
  it('renders a textarea with an accessible label and a send button', () => {
    const markup = renderToStaticMarkup(<ChatInput onSend={vi.fn()} />);
    expect(markup).toContain('aria-label="Message the AI Assistant"');
    expect(markup).toContain('>Send</button>');
  });

  it('renders a custom placeholder when provided', () => {
    const markup = renderToStaticMarkup(
      <ChatInput onSend={vi.fn()} placeholder="Ask about monetization" />,
    );
    expect(markup).toContain('placeholder="Ask about monetization"');
  });
});