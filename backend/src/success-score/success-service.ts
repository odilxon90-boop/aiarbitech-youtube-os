export interface ScoreCategory { id: string; name: string; score: number; weight: number; detail: string; }
export interface ScoreHistoryPoint { date: string; score: number; }
export interface ImprovementSuggestion { id: string; priority: 'HIGH' | 'MEDIUM' | 'LOW'; suggestion: string; expectedImpact: string; }
const categorySeeds: readonly [string, string, number, number, string][] = [
  ['ai-usage', 'AI usage', 78, 15, 'Mock AI tool adoption is strong.'],
  ['content-quality', 'Content quality', 81, 20, 'Mock Quality Gate results are above target.'],
  ['growth', 'Growth', 68, 15, 'Mock audience growth is steady.'],
  ['revenue', 'Revenue', 64, 15, 'Mock revenue diversification can improve.'],
  ['monetization', 'Monetization readiness', 70, 10, 'Mock monetization requirements are nearly met.'],
  ['consistency', 'Consistency', 75, 15, 'Mock publishing cadence is consistent.'],
  ['kpi', 'KPI achievement', 69, 10, 'Mock KPI progress is on track.'],
];
const categories: readonly ScoreCategory[] = categorySeeds.map(([id, name, score, weight, detail]) => ({ id, name, score, weight, detail }));
const history: readonly ScoreHistoryPoint[] = Array.from({ length: 30 }, (_, index) => ({ date: `2026-08-${String(index + 1).padStart(2, '0')}`, score: 64 + Math.min(index, 8) + (index % 3) }));
const improvements: readonly ImprovementSuggestion[] = [
  ['improve-01', 'HIGH', 'Use AI Director for every new content brief.', '+5 AI usage points'],
  ['improve-02', 'HIGH', 'Improve thumbnails before quality review.', '+4 content quality points'],
  ['improve-03', 'MEDIUM', 'Maintain a three-post weekly mock cadence.', '+3 consistency points'],
  ['improve-04', 'MEDIUM', 'Create a mock monetization readiness checklist.', '+3 monetization points'],
  ['improve-05', 'LOW', 'Review mock growth KPIs every week.', '+2 growth points'],
].map(([id, priority, suggestion, expectedImpact]) => ({ id: id!, priority: priority as ImprovementSuggestion['priority'], suggestion: suggestion!, expectedImpact: expectedImpact! }));
export class SuccessService {
  current() { return { overallScore: 72, evaluatedAt: '2026-08-09T12:00:00.000Z', classification: 'GROWING' as const }; }
  history(): readonly ScoreHistoryPoint[] { return history; }
  breakdown(): readonly ScoreCategory[] { return categories; }
  improvements(): readonly ImprovementSuggestion[] { return improvements; }
}
