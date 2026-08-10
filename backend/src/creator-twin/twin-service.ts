export type TwinStatus = 'INACTIVE' | 'LEARNING' | 'ACTIVE' | 'ERROR';
export interface TwinDecision { id: string; timestamp: string; decision: string; outcome: 'SUCCESS' | 'REVIEW' | 'FAILED'; performanceNote: string; }
export interface TwinLearningEntry { id: string; timestamp: string; source: string; summary: string; }
export interface TwinRecommendation { id: string; idea: string; confidencePercent: number; rationale: string; }
const decisions: readonly TwinDecision[] = Array.from({ length: 10 }, (_, index) => ({ id: `decision-${String(index + 1).padStart(2, '0')}`, timestamp: `2026-08-09T${String(12 - Math.floor(index / 2)).padStart(2, '0')}:${String(index * 6).padStart(2, '0')}:00.000Z`, decision: `Mock decision ${index + 1}: prioritize creator style alignment.`, outcome: (['SUCCESS', 'REVIEW', 'SUCCESS', 'SUCCESS', 'FAILED'][index % 5]!) as TwinDecision['outcome'], performanceNote: 'Mock decision performance recorded.' }));
const learningEntries: TwinLearningEntry[] = Array.from({ length: 5 }, (_, index) => ({ id: `learning-${index + 1}`, timestamp: `2026-08-0${index + 1}T12:00:00.000Z`, source: 'Mock creator preference', summary: `Mock learning entry ${index + 1}.` }));
const recommendations: readonly TwinRecommendation[] = Array.from({ length: 5 }, (_, index) => ({ id: `recommendation-${index + 1}`, idea: `Mock content idea ${index + 1}`, confidencePercent: 92 - index * 4, rationale: 'Based on mock creator style and past mock decisions.' }));
export class TwinService {
  private status: TwinStatus = 'LEARNING';
  statusInfo() { return { status: this.status, autonomyEnabled: this.status === 'ACTIVE', networkRequestPerformed: false }; }
  activate() { this.status = 'ACTIVE'; return this.statusInfo(); }
  deactivate() { this.status = 'INACTIVE'; return this.statusInfo(); }
  decisions(): readonly TwinDecision[] { return decisions; }
  learn(source: string, summary: string): TwinLearningEntry { const entry = { id: `learning-${learningEntries.length + 1}`, timestamp: new Date().toISOString(), source, summary }; learningEntries.unshift(entry); this.status = 'LEARNING'; return entry; }
  recommendations(): readonly TwinRecommendation[] { return recommendations; }
}
