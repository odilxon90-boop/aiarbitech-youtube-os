import type { ChatMessage } from '../../../ai/types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: readonly ChatMessage[];
  typing: boolean;
}

function TypingIndicator() {
  return (
    <div
      className="message-bubble message-bubble--assistant message-bubble--typing"
      aria-label="Assistant is typing"
      data-testid="typing-indicator"
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}

export function MessageList({ messages, typing }: MessageListProps) {
  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.length === 0 && (
        <p className="message-list__empty">Ask the AI Assistant anything about your channel.</p>
      )}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {typing && <TypingIndicator />}
    </div>
  );
}