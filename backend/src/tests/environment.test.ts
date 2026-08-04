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
