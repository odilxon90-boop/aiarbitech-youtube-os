import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PlatformRegistrationPage } from '../platform/PlatformRegistrationPage';
import type { RegistrationSummary } from '../platform/types';

const registration: RegistrationSummary = {
  status: 'BLOCKED',
  readiness: {
    ready: false,
    status: 'BLOCKED',
    blockingItems: ['GLOBAL_ECOSYSTEM_COMPATIBILITY_NOT_VERIFIED'],
    evidence: { status: 'VERIFIED', confidence: 'HIGH', origin: ['platform.manifest.json'] },
  },
  metadata: {
    platformId: 'PLATFORM_YOUTUBE_OS',
    platformName: 'AIArbiTech YouTube OS',
    platformVersion: '0.1.0',
    currentGate: 'GATE_0B',
    currentSprint: 'AAT-YTOS-SPRINT0.0.1',
    currentPhase: 'Sprint 0.0.1',
    compatibilityStatus: 'NOT_VERIFIED',
    registrationMode: 'LOCAL_ONLY',
    evidence: { status: 'VERIFIED', confidence: 'HIGH', origin: ['platform.manifest.json'] },
  },
};

describe('PlatformRegistrationPage', () => {
  it('renders all registration fields and no write action', () => {
    const markup = renderToStaticMarkup(<PlatformRegistrationPage registration={registration} />);
    for (const expected of [
      'PLATFORM_YOUTUBE_OS', 'AIArbiTech YouTube OS', '0.1.0', 'BLOCKED', 'GATE_0B',
      'AAT-YTOS-SPRINT0.0.1', 'Sprint 0.0.1', 'NOT_VERIFIED',
      'GLOBAL_ECOSYSTEM_COMPATIBILITY_NOT_VERIFIED', 'LOCAL_ONLY',
    ]) expect(markup).toContain(expected);
    expect(markup).not.toContain('<button');
    expect(markup).not.toContain('<form');
  });
});