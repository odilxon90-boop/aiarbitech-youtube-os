import { useState } from 'react';
import type { AiConfig } from '../../admin/types';

export interface AIConfigFormProps {
  config: AiConfig;
  onSave?: (patch: Partial<AiConfig>) => void;
}

export function AIConfigForm({ config, onSave }: AIConfigFormProps) {
  const [temperature, setTemperature] = useState(config.temperature);
  const [maxTokens, setMaxTokens] = useState(config.maxTokens);
  const [recommendationsPerDay, setRecommendationsPerDay] = useState(config.recommendationsPerDay);
  const [enabled, setEnabled] = useState(config.enabled);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave?.({ temperature, maxTokens, recommendationsPerDay, enabled });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="card" aria-label="AI Director Configuration">
      <h3 className="card-title">AI Director Configuration</h3>
      <div className="ai-config-meta">
        <span>Model: <strong>{config.model}</strong></span>
        <span>Topic Weighting: <strong>{config.topicWeighting}</strong></span>
        <span className="muted">Last updated: {config.updatedAt.slice(0, 10)}</span>
      </div>
      <form className="ai-config-form" onSubmit={handleSubmit} aria-label="AI config form">
        <label>
          Temperature ({temperature.toFixed(1)})
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            aria-label="Temperature"
          />
        </label>
        <label>
          Max Tokens
          <input
            type="number"
            min={256}
            max={8192}
            step={256}
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
            aria-label="Max tokens"
          />
        </label>
        <label>
          Recommendations Per Day
          <input
            type="number"
            min={1}
            max={20}
            value={recommendationsPerDay}
            onChange={(e) => setRecommendationsPerDay(parseInt(e.target.value, 10))}
            aria-label="Recommendations per day"
          />
        </label>
        <label className="ai-config-toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            aria-label="AI Director enabled"
          />
          AI Director Enabled
        </label>
        <button type="submit" className="btn-primary">
          {saved ? 'Saved ✓' : 'Save Configuration'}
        </button>
      </form>
    </section>
  );
}
