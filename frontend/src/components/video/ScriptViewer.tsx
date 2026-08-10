import type { VideoScript } from '../../video/types';

export interface ScriptViewerProps {
  script: VideoScript;
}

export function ScriptViewer({ script }: ScriptViewerProps) {
  return (
    <section className="card" aria-label="Script Viewer">
      <h3 className="card-title">Script</h3>
      <div className="script-meta">
        <span><strong>Topic:</strong> {script.topic}</span>
        <span><strong>Style:</strong> {script.style}</span>
        <span><strong>Length:</strong> {script.length}</span>
      </div>
      <ol className="script-outline">
        {script.outline.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
