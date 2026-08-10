import { describe, expect, it } from 'vitest';
import { EnvironmentValidationError, isGlobalEcosystemConfigured, loadEnvironment } from '../config/environment.js';

const validEnvironment = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://local:local@localhost:5433/youtube_os',
};

describe('environment configuration', () => {
  it('loads safe defaults with integration disabled', () => {
    const config = loadEnvironment(validEnvironment);
    expect(config.PORT).toBe(3100);
    expect(isGlobalEcosystemConfigured(config)).toBe(false);
  });

  it('falls back to a local postgres url when DATABASE_URL is missing', () => {
    const config = loadEnvironment({ NODE_ENV: 'test' });
    expect(config.DATABASE_URL).toBe('postgresql://localhost:5432/youtube_os');
  });

  it('rejects non-PostgreSQL platform databases', () => {
    expect(() => loadEnvironment({ ...validEnvironment, DATABASE_URL: 'mysql://localhost/db' })).toThrow(
      EnvironmentValidationError,
    );
  });

  it('requires service credentials as a pair', () => {
    expect(() =>
      loadEnvironment({
        ...validEnvironment,
        GLOBAL_ECOSYSTEM_CLIENT_ID: 'client',
      }),
    ).toThrow(EnvironmentValidationError);
  });
});
