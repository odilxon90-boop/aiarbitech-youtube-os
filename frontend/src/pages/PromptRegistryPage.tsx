import { PerformanceChart } from '../components/prompts/PerformanceChart';
import { PromptDetail } from '../components/prompts/PromptDetail';
import { PromptForm } from '../components/prompts/PromptForm';
import { PromptList } from '../components/prompts/PromptList';
const promptNames = ['Video idea planner', 'Script writer', 'Music brief', 'Video storyboard', 'Thumbnail concept', 'Quality reviewer', 'Publish metadata', 'Retention analyst', 'Channel strategy', 'Comment responder'];
const prompts = promptNames.map((name, index) => ({ id: `prompt-${index}`, name, model: ['gpt-4', 'claude', 'gpt-3.5'][index % 3]! }));
const performance = promptNames.map((name, index) => ({ id: `performance-${index}`, name, successRatePercent: 84 + index }));
export function PromptRegistryPage() { return <section className="prompt-page" aria-labelledby="prompt-page-title"><div className="prompt-header"><div><p className="eyebrow">Mock data only</p><h2 id="prompt-page-title">AI Prompt Registry</h2></div><span className="foundation-badge">prompts:access</span></div><div className="prompt-grid"><PromptList prompts={prompts} /><PromptDetail prompt={{ name: 'Video idea planner', content: 'Generate platform-safe video concepts.', model: 'gpt-4', versionCount: 3 }} /><PromptForm /><PerformanceChart items={performance} /></div></section>; }
