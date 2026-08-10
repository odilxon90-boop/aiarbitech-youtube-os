import {
  type MemorySummary,
  type PreferencesPayload,
  type DecisionHistoryResponse,
  type LearningHistoryResponse,
  getMemorySummary,
  getPreferences,
  replacePreferences,
  getDecisions,
  addLearningEntry,
} from './memory-service.js';

export interface MemoryController {
  getSummary(): Promise<MemorySummary>;
  getPreferences(): Promise<PreferencesPayload>;
  updatePreferences(payload: PreferencesPayload): Promise<PreferencesPayload>;
  getDecisions(): Promise<DecisionHistoryResponse>;
  addLearning(entry: { event: string; result: string }): Promise<LearningHistoryResponse>;
}

export const memoryController: MemoryController = {
  getSummary: () => getMemorySummary(),
  getPreferences: () => getPreferences(),
  updatePreferences: (payload) => replacePreferences(payload),
  getDecisions: () => getDecisions(),
  addLearning: (entry) => addLearningEntry(entry),
};
