import type { ChatMessage } from '../../../ai/types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-bubble message-bubble--${isUser ? 'user' : 'assistant'}`}>
      <p className="message-bubble__content">{message.content}</p>
      {!isUser && message.type && <span className="message-bubble__type">{message.type}</span>}
      {!isUser && message.items && message.items.length > 0 && (
        <ul className="message-bubble__items">
          {message.items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}