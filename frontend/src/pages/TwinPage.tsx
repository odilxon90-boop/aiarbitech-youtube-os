import { useState } from 'react';
import { DecisionHistory } from '../components/twin/DecisionHistory';
import { LearningForm } from '../components/twin/LearningForm';
import { RecommendationList } from '../components/twin/RecommendationList';
import { StatusCard } from '../components/twin/StatusCard';
const decisions = Array.from({ length: 10 }, (_, index) => ({ id: `decision-${index}`, decision: `Mock decision ${index + 1}`, outcome: index % 3 ? 'SUCCESS' : 'REVIEW' }));
const recommendations = Array.from({ length: 5 }, (_, index) => ({ id: `recommendation-${index}`, idea: `Mock content idea ${index + 1}`, confidencePercent: 92 - index * 4 }));
export function TwinPage() { const [status, setStatus] = useState('LEARNING'); return <section className="twin-page" aria-labelledby="twin-page-title"><div className="twin-header"><div><p className="eyebrow">Mock data only</p><h2 id="twin-page-title">Creator Twin</h2></div><div><button type="button" onClick={() => setStatus('ACTIVE')}>Activate</button><button type="button" onClick={() => setStatus('INACTIVE')}>Deactivate</button></div></div><div className="twin-grid"><StatusCard status={status} /><LearningForm /><DecisionHistory decisions={decisions} /><RecommendationList recommendations={recommendations} /></div></section>; }
