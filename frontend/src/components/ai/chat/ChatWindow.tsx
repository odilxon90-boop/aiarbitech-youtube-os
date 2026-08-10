import type { ChatMessage } from '../../../ai/types';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';

interface ChatWindowProps {
  messages: readonly ChatMessage[];
  typing: boolean;
  onSend: (prompt: string) => void;
  disabled?: boolean;
}

export function ChatWindow({ messages, typing, onSend, disabled = false }: ChatWindowProps) {
  return (
    <section className="chat-window" aria-label="Chat">
      <MessageList messages={messages} typing={typing} />
      <ChatInput onSend={onSend} disabled={disabled} />
    </section>
  );
}