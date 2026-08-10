export interface PromptVersion {
  version: number;
  content: string;
  createdAt: string;
}
export interface PromptPerformance {
  successRatePercent: number;
  averageTokens: number;
  averageLatencyMs: number;
}
export interface Prompt {
  id: string;
  name: string;
  content: string;
  model: 'gpt-4' | 'gpt-3.5' | 'claude';
  temperature: number;
  maxTokens: number;
  versions: readonly PromptVersion[];
  performance: PromptPerformance;
}
export interface PromptInput {
  name: string;
  content: string;
  model: Prompt['model'];
  temperature: number;
  maxTokens: number;
}
const promptNames = ['Video idea planner', 'Script writer', 'Music brief', 'Video storyboard', 'Thumbnail concept', 'Quality reviewer', 'Publish metadata', 'Retention analyst', 'Channel strategy', 'Comment responder'];
const prompts: Prompt[] = promptNames.map((name, index) => {
  const versions = [1, 2, 3].map((version) => ({ version, content: `Mock ${name.toLowerCase()} prompt version ${version}.`, createdAt: `2026-0${version}-01T00:00:00.000Z` }));
  return {
    id: `prompt-${String(index + 1).padStart(2, '0')}`, name, content: versions[2]!.content,
    model: (['gpt-4', 'claude', 'gpt-3.5'][index % 3]!) as Prompt['model'],
    temperature: 0.4 + (index % 4) / 10, maxTokens: 1024 + index * 128, versions,
    performance: { successRatePercent: 84 + index, averageTokens: 650 + index * 25, averageLatencyMs: 420 + index * 30 },
  };
});
export class PromptService {
  private counter = prompts.length;
  list(): readonly Prompt[] { return prompts; }
  get(id: string): Prompt { return this.find(id); }
  create(input: PromptInput): Prompt {
    this.counter += 1;
    const prompt: Prompt = { id: `prompt-${String(this.counter).padStart(2, '0')}`, ...input, versions: [{ version: 1, content: input.content, createdAt: new Date().toISOString() }], performance: { successRatePercent: 0, averageTokens: 0, averageLatencyMs: 0 } };
    prompts.unshift(prompt);
    return prompt;
  }
  update(id: string, input: PromptInput): Prompt {
    const prompt = this.find(id);
    const version = prompt.versions.length + 1;
    Object.assign(prompt, input, { versions: [...prompt.versions, { version, content: input.content, createdAt: new Date().toISOString() }] });
    return prompt;
  }
  delete(id: string): { id: string; deleted: true } {
    const index = prompts.findIndex((item) => item.id === id);
    if (index < 0) throw new Error(`Prompt ${id} was not found.`);
    prompts.splice(index, 1);
    return { id, deleted: true };
  }
  performance(): readonly Pick<Prompt, 'id' | 'name' | 'performance'>[] { return prompts.map(({ id, name, performance }) => ({ id, name, performance })); }
  private find(id: string): Prompt { const prompt = prompts.find((item) => item.id === id); if (!prompt) throw new Error(`Prompt ${id} was not found.`); return prompt; }
}
