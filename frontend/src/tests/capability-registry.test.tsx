import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CapabilityRegistryPage } from '../platform/CapabilityRegistryPage';
import type { CapabilityRegistry } from '../platform/types';

const capability = { capabilityId:'CHANNEL_MANAGEMENT', capabilityName:'Channel Management', capabilityDescription:'Future capability', capabilityCategory:'YOUTUBE_BUSINESS', capabilityOwner:'PLATFORM', platformId:'PLATFORM_YOUTUBE_OS', currentStatus:'NOT_VERIFIED', lifecycleStatus:'NOT_IMPLEMENTED', version:'1.0.0', evidenceStatus:'VERIFIED', confidenceLevel:'HIGH', origin:['governance'], dependencies:['NOT_VERIFIED'], requiredGlobalServices:['NOT_VERIFIED'], requiredContracts:['NOT_VERIFIED'], implementationStatus:'NOT_IMPLEMENTED', certificationStatus:'NOT_VERIFIED', lastUpdated:'2026-08-05' } as const;
const registry:CapabilityRegistry={schemaVersion:'1.0.0',artifactType:'CAPABILITY_REGISTRY',artifactVersion:'2.0.0',platformId:'PLATFORM_YOUTUBE_OS',capabilities:[capability]};
describe('capability registry UI',()=>{
 it('renders all required read-only capability fields without controls',()=>{const markup=renderToStaticMarkup(<CapabilityRegistryPage registry={registry}/>);for(const text of ['CHANNEL_MANAGEMENT','Channel Management','YOUTUBE_BUSINESS','NOT_IMPLEMENTED','VERIFIED','HIGH','Required Global Services','Dependencies','Required Contracts','Certification Status'])expect(markup).toContain(text);expect(markup).not.toContain('<button');expect(markup).not.toContain('<input');});
 it('renders the empty registry state',()=>{expect(renderToStaticMarkup(<CapabilityRegistryPage registry={{...registry,capabilities:[]}}/>)).toContain('No capabilities are registered.');});
});