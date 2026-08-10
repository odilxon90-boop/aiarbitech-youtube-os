export type Confidence = number;

export interface StylePreference {
  id: string;
  category: string;
  value: string;
  confidence: Confidence;
}

export interface ContentPreference {
  id: string;
  topic: string;
  format: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  note: string;
}

export interface DecisionRecord {
  id: string;
  date: string;
  title: string;
  outcome: 'ACCEPTED' | 'REJECTED';
  impact: string;
}

export interface LearningEntry {
  id: string;
  date: string;
  event: string;
  result: string;
}

export interface MemorySummary {
  stylePreferences: StylePreference[];
  contentPreferences: ContentPreference[];
  recentDecisions: DecisionRecord[];
  learningHistory: LearningEntry[];
}

export interface PreferencesPayload {
  stylePreferences: StylePreference[];
  contentPreferences: ContentPreference[];
}

export interface DecisionHistoryResponse {
  items: DecisionRecord[];
}

export interface LearningHistoryResponse {
  items: LearningEntry[];
}
