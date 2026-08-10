import { randomUUID } from 'node:crypto';
import { PlatformError } from '../shared/errors.js';

// Creator AI Assistant service. Uses an in-memory, per-user conversation store and a
// mock AI reply generator. No real AI API, no persistence, no business runtime.

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

export interface MockAiReply {
  type: AssistantReplyType;
  content: string;
  items?: readonly string[];
  delayMs: number;
}

export interface SendResult {
  session: ChatSession;
  newSession: boolean;
  userMessage: ChatMessage;
  reply: ChatMessage;
}

export interface AssistantServiceOptions {
  /** Fixed delay override for deterministic/tests. Default: random 500-1500ms (small in test env). */
  fixedDelayMs?: number;
}

const TEXT_RESPONSES = [
  'Here’s a quick take: tightening your upload cadence to a consistent twice-weekly slot tends to grow average views within a few weeks.',
  'Based on the pattern, the strongest lever right now is audience retention — focus on a faster cold open.',
  'The data suggests your best-performing niche is AI automation tutorials; leaning into that should lift watch time.',
];

const RECOMMENDATION_ITEMS = [
  'Publish 3 shorts this week — shorts are driving most new subscribers.',
  'Refresh the first 15 seconds of upcoming videos to hold early retention.',
  'Add end screens to your 10 most-viewed older uploads.',
];

const ACTION_ITEMS = [
  'Draft a new video titled around “AI Automations for Beginners”.',
  'Schedule the next upload for Friday at 14:00.',
  'Generate a fresh set of thumbnail variants for review.',
];

function sample<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  const item = items[index];
  return item !== undefined ? item : items[0]!;
}

const nowIso = (): string => new Date().toISOString();

export class AssistantService {
  private readonly store = new Map<string, ChatSession[]>();

  constructor(private readonly options: AssistantServiceOptions = {}) {}

  private async simulateDelay(): Promise<number> {
    const fixed = this.options.fixedDelayMs;
    const delay =
      fixed ??
      (process.env.NODE_ENV === 'test' ? 3 : Math.floor(500 + Math.random() * 1001));
    await new Promise((resolve) => setTimeout(resolve, delay));
    return delay;
  }

  async generateReply(prompt: string): Promise<MockAiReply> {
    const delayMs = await this.simulateDelay();
    const lower = prompt.toLowerCase();
    if (lower.includes('fail')) {
      throw new PlatformError(500, 'AI_SERVICE_ERROR', 'The mock AI service failed.');
    }
    if (lower.includes('timeout')) {
      throw new PlatformError(504, 'AI_TIMEOUT', 'The mock AI service timed out.');
    }

    const type: AssistantReplyType =
      lower.includes('recommend') || lower.includes('recommendation')
        ? 'recommendations'
        : lower.includes('do') || lower.includes('action')
          ? 'actions'
          : 'text';

    if (type === 'recommendations') {
      return { type, content: 'Here are a few recommendations:', items: RECOMMENDATION_ITEMS, delayMs };
    }
    if (type === 'actions') {
      return { type, content: 'I can take these actions on your behalf:', items: ACTION_ITEMS, delayMs };
    }
    return { type, content: sample(TEXT_RESPONSES), delayMs };
  }

  listSessions(userId: string): ChatSession[] {
    return [...(this.store.get(userId) ?? [])].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  getSession(userId: string, sessionId: string): ChatSession {
    const session = (this.store.get(userId) ?? []).find((candidate) => candidate.id === sessionId);
    if (!session) {
      throw new PlatformError(404, 'SESSION_NOT_FOUND', 'Chat session not found.');
    }
    return session;
  }

  createSession(userId: string): ChatSession {
    const timestamp = nowIso();
    const session: ChatSession = {
      id: randomUUID(),
      userId,
      title: 'New chat',
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [],
    };
    const list = this.store.get(userId) ?? [];
    list.push(session);
    this.store.set(userId, list);
    return session;
  }

  async sendMessage(
    userId: string,
    prompt: string,
    sessionId?: string,
  ): Promise<SendResult> {
    const existing = sessionId ? this.getSession(userId, sessionId) : undefined;
    const newSession = !existing;
    const session = existing ?? this.createSession(userId);

    const userMessage: ChatMessage = {
      id: randomUUID(),
      role: 'user',
      content: prompt,
      createdAt: nowIso(),
    };
    session.messages.push(userMessage);

    const replySignal = await this.generateReply(prompt);
    const reply: ChatMessage = {
      id: randomUUID(),
      role: 'assistant',
      content: replySignal.content,
      type: replySignal.type,
      createdAt: nowIso(),
      ...(replySignal.items ? { items: replySignal.items } : {}),
    };
    session.messages.push(reply);
    session.updatedAt = nowIso();

    return { session, newSession, userMessage, reply };
  }
}