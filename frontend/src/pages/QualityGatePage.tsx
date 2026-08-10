import { Checklist, type ChecklistEntry } from '../components/quality/Checklist';
import { ReadinessBadge } from '../components/quality/ReadinessBadge';
import { RetentionChart } from '../components/quality/RetentionChart';
import { ScoreCard } from '../components/quality/ScoreCard';

const checklist: readonly ChecklistEntry[] = [
  { id: 'hook', label: 'Opening hook is present', status: 'PASS' },
  { id: 'audio', label: 'Audio clarity', status: 'PASS' },
  { id: 'visual', label: 'Visual clarity', status: 'PASS' },
  { id: 'title', label: 'Title is descriptive', status: 'PASS' },
  { id: 'thumbnail', label: 'Thumbnail is available', status: 'PASS' },
  { id: 'captions', label: 'Captions are available', status: 'PASS' },
  { id: 'brand-safety', label: 'Brand safety review', status: 'PASS' },
  { id: 'copyright', label: 'Copyright review', status: 'PASS' },
  { id: 'cta', label: 'Call to action', status: 'PASS' },
  { id: 'pacing', label: 'Content pacing', status: 'PASS' },
  { id: 'metadata', label: 'Metadata completeness', status: 'PASS' },
];

export function QualityGatePage() {
  return (
    <section className="quality-gate" aria-labelledby="quality-gate-title">
      <div className="quality-gate__header">
        <div><p className="eyebrow">Mock data only</p><h2 id="quality-gate-title">AI Video Quality Gate</h2></div>
        <ReadinessBadge status="PASS" />
      </div>
      <div className="quality-grid">
        <ScoreCard score={91} />
        <RetentionChart
          confidence={89}
          points={[
            { timestampSeconds: 0, retentionPercent: 100 },
            { timestampSeconds: 30, retentionPercent: 88 },
            { timestampSeconds: 60, retentionPercent: 79 },
            { timestampSeconds: 120, retentionPercent: 68 },
          ]}
        />
        <Checklist items={checklist} />
      </div>
    </section>
  );
}
