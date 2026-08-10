<<<<<<< HEAD
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createAssistantClient, type AssistantClient } from '../ai/assistant-client';
import type { ChatMessage, ChatSession } from '../ai/types';
import { ChatWindow } from '../components/ai/chat/ChatWindow';
import { HistorySidebar } from '../components/ai/chat/HistorySidebar';
import { ErrorState, LoadingState } from '../shared/components/AsyncStates';

interface AIAssistantPageProps {
  client?: AssistantClient;
  /** Optional pre-supplied history for synchronous/server rendering; skips loading. */
  initialSessions?: readonly ChatSession[];
}

function freshId(): string {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mergeSession(
  list: readonly ChatSession[],
  updated: ChatSession,
): readonly ChatSession[] {
  return [updated, ...list.filter((session) => session.id !== updated.id)].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function AIAssistantPage({ client, initialSessions }: AIAssistantPageProps) {
  const assistantClient = useMemo(() => client ?? createAssistantClient(), [client]);
  const [sessions, setSessions] = useState<readonly ChatSession[]>(initialSessions ?? []);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [historyState, setHistoryState] = useState<'loading' | 'ready' | 'error'>(
    initialSessions ? 'ready' : 'loading',
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const activeSessionIdRef = useRef<string | undefined>(undefined);
  activeSessionIdRef.current = activeSessionId;

  useEffect(() => {
    if (initialSessions) return;
    let cancelled = false;
    setHistoryState('loading');
    assistantClient
      .history()
      .then((result) => {
        if (cancelled) return;
        setSessions(result.sessions);
        setHistoryState('ready');
      })
      .catch(() => {
        if (!cancelled) setHistoryState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [assistantClient, initialSessions]);

  const openSession = useCallback(
    async (sessionId: string): Promise<void> => {
      try {
        const result = await assistantClient.session(sessionId);
        setActiveSessionId(result.session.id);
        setMessages(result.session.messages);
        setError(undefined);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Could not open the conversation.');
      }
    },
    [assistantClient],
  );

  const startNewChat = useCallback((): void => {
    setActiveSessionId(undefined);
    setMessages([]);
    setError(undefined);
  }, []);

  const send = useCallback(
    async (prompt: string): Promise<void> => {
      if (sending) return;
      const sessionId = activeSessionIdRef.current;
      const optimistic: ChatMessage = {
        id: freshId(),
        role: 'user',
        content: prompt,
        createdAt: new Date().toISOString(),
      };
      setMessages((current) => [...current, optimistic]);
      setSending(true);
      setTyping(true);
      setError(undefined);
      try {
        const result = await assistantClient.send(prompt, sessionId);
        setActiveSessionId(result.session.id);
        setMessages(result.session.messages);
        setSessions((current) => mergeSession(current, result.session));
      } catch (sendError) {
        setError(sendError instanceof Error ? sendError.message : 'The AI Assistant could not respond.');
      } finally {
        setSending(false);
        setTyping(false);
      }
    },
    [sending, assistantClient],
  );

  return (
    <section className="ai-assistant" aria-label="Creator AI Assistant">
      <header className="ai-assistant__header">
        <div>
          <p className="section-kicker">Creator Experience</p>
          <h2 className="dashboard-title">AI Assistant</h2>
        </div>
      </header>

      <div className="ai-assistant__layout">
        {historyState === 'loading' && <LoadingState message="Loading conversations…" />}
        {historyState === 'error' && <ErrorState message="Could not load conversation history." />}
        {historyState === 'ready' && (
          <HistorySidebar
            sessions={sessions}
            {...(activeSessionId ? { activeSessionId } : {})}
            onSelect={openSession}
            onNewChat={startNewChat}
          />
        )}
        <ChatWindow messages={messages} typing={typing} onSend={send} disabled={sending} />
      </div>

      {error && (
        <p className="ai-assistant__error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
=======
import { useState } from 'react';
export function AIAssistantPage() { const [response, setResponse] = useState(''); return <section className="card journey-page" aria-labelledby="assistant-title"><p className="section-kicker">Mock AI only</p><h2 id="assistant-title">AI Assistant</h2><form onSubmit={(event) => { event.preventDefault(); setResponse('Mock AI response: Start with a focused opening hook.'); }}><input aria-label="AI message" defaultValue="Help me plan a video" /><button type="submit">Send message</button></form>{response && <p role="status">{response}</p>}</section>; }
>>>>>>> 81fef7325c2bc9ed278736de444923623b49724f
