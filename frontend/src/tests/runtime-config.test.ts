import { describe, expect, it } from 'vitest';
import { createYouTubeOAuthUrl, publicRuntimeConfig } from '../config/runtime';

describe('public runtime configuration', () => {
  it('uses safe defaults and never requires browser secrets', () => {
    expect(publicRuntimeConfig.apiBaseUrl).toBeTruthy();
    expect(publicRuntimeConfig.supportEmail).toContain('@');
    expect(createYouTubeOAuthUrl('state')).toBeUndefined();
  });
});
