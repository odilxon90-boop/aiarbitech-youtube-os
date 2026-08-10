import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AIAssistantPage } from '../../pages/AIAssistantPage';
import type { ChatSession } from '../../ai/types';

const session: ChatSession = {
  id: 's1',
  userId: 'creator-1',
  title: 'New chat',
  createdAt: '2026-08-09T00:00:00.000Z',
  updatedAt: '2026-08-09T00:00:00.000Z',
  messages: [
    { id: 'm1', role: 'user', content: 'recommend something', createdAt: '2026-08-09T00:00:00.000Z' },
  ],
};

describe('AIAssistantPage', () => {
  it('renders the shell, history sidebar and empty chat from initial sessions', () => {
    const markup = renderToStaticMarkup(<AIAssistantPage initialSessions={[session]} />);
    expect(markup).toContain('AI Assistant');
    expect(markup).toContain('Creator Experience');
    expect(markup).toContain('New chat');
    expect(markup).toContain('Ask the AI Assistant anything about your channel.');
  });

  it('renders content without initial sessions as a loading history', () => {
    const markup = renderToStaticMarkup(<AIAssistantPage />);
    expect(markup).toContain('AI Assistant');
    expect(markup).toContain('Loading conversations…');
  });
});