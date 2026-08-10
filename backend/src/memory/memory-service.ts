export interface StylePreference {
  id: string;
  category: string;
  value: string;
  confidence: number;
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

const nowIso = (): string => new Date().toISOString();

const MOCK_STYLE_PREFERENCES: StylePreference[] = [
  { id: 'sp-1', category: 'Tone', value: 'Casual, conversational', confidence: 0.92 },
  { id: 'sp-2', category: 'Visual style', value: 'Dark cinematic', confidence: 0.85 },
  { id: 'sp-3', category: 'Keywords', value: 'automation, AI, workflow', confidence: 0.78 },
];

const MOCK_CONTENT_PREFERENCES: ContentPreference[] = [
  { id: 'cp-1', topic: 'AI Automations', format: 'Tutorial + demo', priority: 'HIGH', note: 'Highest CTR topic.' },
  { id: 'cp-2', topic: 'Tool reviews', format: 'Top 5 list', priority: 'MEDIUM', note: 'Good for affiliate links.' },
  { id: 'cp-3', topic: 'Case studies', format: 'Long-form story', priority: 'LOW', note: 'Audience retention is lower.' },
];

const MOCK_DECISIONS: DecisionRecord[] = [
  { id: 'd-1', date: '2026-07-12', title: 'Publish shorts every Monday', outcome: 'ACCEPTED', impact: 'Subscriber growth +8%' },
  { id: 'd-2', date: '2026-07-10', title: 'Drop Saturday uploads', outcome: 'REJECTED', impact: 'No significant change' },
  { id: 'd-3', date: '2026-07-08', title: 'Add AI voiceover', outcome: 'ACCEPTED', impact: 'Production time -15%' },
  { id: 'd-4', date: '2026-07-05', title: 'Switch thumbnail style', outcome: 'ACCEPTED', impact: 'CTR +1.2%' },
  { id: 'd-5', date: '2026-07-01', title: 'Remove end screens', outcome: 'REJECTED', impact: 'Sessions dropped 4%' },
];

const MOCK_LEARNING: LearningEntry[] = [
  { id: 'l-1', date: '2026-07-12', event: 'AI recommended weekly shorts cadence', result: 'Adopted; subscriber growth improved.' },
  { id: 'l-2', date: '2026-07-10', event: 'AI recommended removing end screens', result: 'Rejected; sessions dropped after removal.' },
  { id: 'l-3', date: '2026-07-08', event: 'AI suggested AI voiceover', result: 'Adopted; faster production and consistent tone.' },
  { id: 'l-4', date: '2026-07-05', event: 'AI recommended darker thumbnails', result: 'Adopted; CTR improved.' },
  { id: 'l-5', date: '2026-07-01', event: 'AI recommended 2-hour livestreams', result: 'Rejected; preparation burden too high.' },
];

export async function getMemorySummary(): Promise<MemorySummary> {
  return {
    stylePreferences: MOCK_STYLE_PREFERENCES,
    contentPreferences: MOCK_CONTENT_PREFERENCES,
    recentDecisions: MOCK_DECISIONS,
    learningHistory: MOCK_LEARNING,
  };
}

export async function getPreferences(): Promise<PreferencesPayload> {
  return {
    stylePreferences: MOCK_STYLE_PREFERENCES,
    contentPreferences: MOCK_CONTENT_PREFERENCES,
  };
}

export async function replacePreferences(payload: PreferencesPayload): Promise<PreferencesPayload> {
  return payload;
}

export async function getDecisions(): Promise<DecisionHistoryResponse> {
  return { items: MOCK_DECISIONS };
}

export async function addLearningEntry(entry: { event: string; result: string }): Promise<LearningHistoryResponse> {
  const created: LearningEntry = {
    id: `l-${Date.now()}`,
    date: nowIso().slice(0, 10),
    event: entry.event,
    result: entry.result,
  };
  MOCK_LEARNING.unshift(created);
  return { items: MOCK_LEARNING };
}
