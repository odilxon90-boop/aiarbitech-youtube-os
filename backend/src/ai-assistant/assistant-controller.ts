import type { AssistantService, ChatSession, SendResult } from './assistant-service.js';

export interface AssistantController {
  send(userId: string, prompt: string, sessionId?: string): Promise<SendResult>;
  history(userId: string): ChatSession[];
  session(userId: string, sessionId: string): ChatSession;
}

export function createAssistantController(service: AssistantService): AssistantController {
  return {
    send: (userId, prompt, sessionId) => service.sendMessage(userId, prompt, sessionId),
    history: (userId) => service.listSessions(userId),
    session: (userId, sessionId) => service.getSession(userId, sessionId),
  };
}