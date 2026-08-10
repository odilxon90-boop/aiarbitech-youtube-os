import { useState } from 'react';
import type { GenerateRequest } from '../../video/types';

export interface GenerateFormProps {
  onGenerate: (request: GenerateRequest) => Promise<void>;
}

export function GenerateForm({ onGenerate }: GenerateFormProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Tutorial');
  const [length, setLength] = useState('8-10 min');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    await onGenerate({ topic: topic.trim(), style, length });
    setLoading(false);
  };

  return (
    <section className="card" aria-label="Generate Video">
      <h3 className="card-title">Generate Video</h3>
      <form className="generate-form" onSubmit={handleSubmit}>
        <label>
          <span>Topic</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. AI Tools for Creators"
            required
          />
        </label>
        <label>
          <span>Style</span>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="Tutorial">Tutorial</option>
            <option value="Listicle">Listicle</option>
            <option value="Comparison">Comparison</option>
            <option value="Strategy">Strategy</option>
            <option value="Guide">Guide</option>
          </select>
        </label>
        <label>
          <span>Length</span>
          <select value={length} onChange={(e) => setLength(e.target.value)}>
            <option value="3-5 min">3-5 min</option>
            <option value="8-10 min">8-10 min</option>
            <option value="12-15 min">12-15 min</option>
          </select>
        </label>
        <button type="submit" disabled={loading || !topic.trim()}>
          {loading ? 'Generating…' : 'Generate Script'}
        </button>
      </form>
    </section>
  );
}
