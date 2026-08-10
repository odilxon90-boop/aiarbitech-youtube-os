// Creator AI Assistant types. Mirrors the backend assistant service DTOs.

export type ChatRole = 'user' | 'assistant';
export type AssistantReplyType = 'text' | 'recommendations' | 'actions';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  type?: AssistantReplyType;
  items?: readonly string[];
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface SendResult {
  session: ChatSession;
  newSession: boolean;
  userMessage: ChatMessage;
  reply: ChatMessage;
}