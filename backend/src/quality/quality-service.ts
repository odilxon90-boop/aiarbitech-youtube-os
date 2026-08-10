export type PublishReadiness = 'PASS' | 'REVIEW' | 'FAIL';
export type ChecklistStatus = 'PASS' | 'FAIL';

export interface QualityScore {
  videoId: string;
  score: number;
  evaluatedAt: string;
}

export interface RetentionPrediction {
  videoId: string;
  estimatedRetentionPercent: number;
  confidencePercent: number;
  curve: ReadonlyArray<{ timestampSeconds: number; retentionPercent: number }>;
}

export interface QualityChecklistItem {
  id: string;
  label: string;
  status: ChecklistStatus;
  detail: string;
}

export interface PublishReadinessResult {
  videoId: string;
  status: PublishReadiness;
  reason: string;
}

const qualityScores: Readonly<Record<string, QualityScore>> = {
  'video-aurora': { videoId: 'video-aurora', score: 91, evaluatedAt: '2026-08-09T12:00:00.000Z' },
  'video-horizon': { videoId: 'video-horizon', score: 74, evaluatedAt: '2026-08-09T12:00:00.000Z' },
  'video-draft': { videoId: 'video-draft', score: 42, evaluatedAt: '2026-08-09T12:00:00.000Z' },
};

const retentionPredictions: Readonly<Record<string, RetentionPrediction>> = {
  'video-aurora': {
    videoId: 'video-aurora',
    estimatedRetentionPercent: 68,
    confidencePercent: 89,
    curve: [
      { timestampSeconds: 0, retentionPercent: 100 },
      { timestampSeconds: 30, retentionPercent: 88 },
      { timestampSeconds: 60, retentionPercent: 79 },
      { timestampSeconds: 120, retentionPercent: 68 },
    ],
  },
  'video-horizon': {
    videoId: 'video-horizon',
    estimatedRetentionPercent: 51,
    confidencePercent: 76,
    curve: [
      { timestampSeconds: 0, retentionPercent: 100 },
      { timestampSeconds: 30, retentionPercent: 70 },
      { timestampSeconds: 60, retentionPercent: 59 },
      { timestampSeconds: 120, retentionPercent: 51 },
    ],
  },
  'video-draft': {
    videoId: 'video-draft',
    estimatedRetentionPercent: 28,
    confidencePercent: 71,
    curve: [
      { timestampSeconds: 0, retentionPercent: 100 },
      { timestampSeconds: 30, retentionPercent: 52 },
      { timestampSeconds: 60, retentionPercent: 35 },
      { timestampSeconds: 120, retentionPercent: 28 },
    ],
  },
};

const readiness: Readonly<Record<string, PublishReadinessResult>> = {
  'video-aurora': { videoId: 'video-aurora', status: 'PASS', reason: 'All quality thresholds are satisfied.' },
  'video-horizon': { videoId: 'video-horizon', status: 'REVIEW', reason: 'Retention prediction needs editorial review.' },
  'video-draft': { videoId: 'video-draft', status: 'FAIL', reason: 'Critical quality checks have failed.' },
};

const checklist: ReadonlyArray<QualityChecklistItem> = [
  { id: 'hook', label: 'Opening hook is present', status: 'PASS', detail: 'Viewer value appears in the first 15 seconds.' },
  { id: 'audio', label: 'Audio clarity', status: 'PASS', detail: 'No mock audio-quality warnings.' },
  { id: 'visual', label: 'Visual clarity', status: 'PASS', detail: 'Mock visual score exceeds threshold.' },
  { id: 'title', label: 'Title is descriptive', status: 'PASS', detail: 'Title matches the mock video topic.' },
  { id: 'thumbnail', label: 'Thumbnail is available', status: 'PASS', detail: 'Thumbnail asset is attached.' },
  { id: 'captions', label: 'Captions are available', status: 'PASS', detail: 'Captions pass mock completeness checks.' },
  { id: 'brand-safety', label: 'Brand safety review', status: 'PASS', detail: 'No mock brand-safety flags.' },
  { id: 'copyright', label: 'Copyright review', status: 'PASS', detail: 'No mock copyright flags.' },
  { id: 'cta', label: 'Call to action', status: 'PASS', detail: 'A clear call to action is present.' },
  { id: 'pacing', label: 'Content pacing', status: 'PASS', detail: 'Pacing meets the mock retention threshold.' },
  { id: 'metadata', label: 'Metadata completeness', status: 'PASS', detail: 'Description and tags are populated.' },
];

export class QualityService {
  getScore(videoId: string): QualityScore {
    return this.requireVideo(qualityScores, videoId);
  }

  getRetention(videoId: string): RetentionPrediction {
    return this.requireVideo(retentionPredictions, videoId);
  }

  getReadiness(videoId: string): PublishReadinessResult {
    return this.requireVideo(readiness, videoId);
  }

  getChecklist(videoId: string): ReadonlyArray<QualityChecklistItem> {
    const result = this.getReadiness(videoId);
    if (result.status === 'PASS') return checklist;
    if (result.status === 'REVIEW') {
      return checklist.map((item) =>
        item.id === 'pacing' ? { ...item, status: 'FAIL', detail: 'Retention requires editorial review.' } : item,
      );
    }
    return checklist.map((item) =>
      ['audio', 'pacing', 'metadata'].includes(item.id)
        ? { ...item, status: 'FAIL', detail: 'Mock draft quality check failed.' }
        : item,
    );
  }

  private requireVideo<T>(records: Readonly<Record<string, T>>, videoId: string): T {
    const result = records[videoId];
    if (!result) throw new PlatformError(404, 'VIDEO_NOT_FOUND', `Video ${videoId} was not found.`);
    return result;
  }
}
import { PlatformError } from '../shared/errors.js';
