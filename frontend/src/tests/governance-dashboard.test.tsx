import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { GovernanceCard } from '../platform/GovernanceCard';

describe('Gate 0B governance UI', () => {
  it('renders read-only evidence status and gate values', () => {
    const markup = renderToStaticMarkup(<GovernanceCard title="Platform Passport" summary="Read-only" highlights={['currentGate','currentSprint']} artifact={{artifactType:'PLATFORM_PASSPORT',artifactVersion:'1.0.0',schemaVersion:'1.0.0',currentGate:'GATE_0B',currentSprint:'NOT_ASSIGNED',evidence:{status:'VERIFIED',confidence:'HIGH',origin:['governance/platform-passport.v1.json'],decisionClassification:'REPOSITORY_EVIDENCE'}}}/>);
    expect(markup).toContain('Platform Passport'); expect(markup).toContain('GATE_0B'); expect(markup).toContain('NOT_ASSIGNED'); expect(markup).toContain('HIGH confidence');
  });
});
