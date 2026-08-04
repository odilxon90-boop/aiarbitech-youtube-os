import { z } from 'zod';

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);

const optionalNonEmpty = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3100),
    HOST: z.string().min(1).default('0.0.0.0'),
    DATABASE_URL: z
      .string()
      .min(1)
      .refine((value) => /^postgres(?:ql)?:\/\//.test(value), 'DATABASE_URL must use PostgreSQL'),
    CORS_ORIGIN: z.string().min(1).default('http://localhost:5174'),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().max(120_000).default(10_000),
    GLOBAL_ECOSYSTEM_BASE_URL: optionalUrl,
    GLOBAL_ECOSYSTEM_CLIENT_ID: optionalNonEmpty,
    GLOBAL_ECOSYSTEM_CLIENT_SECRET: optionalNonEmpty,
    GLOBAL_ECOSYSTEM_TIMEOUT_MS: z.coerce.number().int().positive().max(60_000).default(5_000),
    GLOBAL_ECOSYSTEM_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
  })
  .superRefine((config, context) => {
    const hasClientId = Boolean(config.GLOBAL_ECOSYSTEM_CLIENT_ID);
    const hasClientSecret = Boolean(config.GLOBAL_ECOSYSTEM_CLIENT_SECRET);

    if (hasClientId !== hasClientSecret) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['GLOBAL_ECOSYSTEM_CLIENT_ID'],
        message: 'Global Ecosystem client ID and secret must be configured together',
      });
    }
  });

export type EnvironmentConfig = z.infer<typeof environmentSchema>;

export class EnvironmentValidationError extends Error {
  constructor(readonly issues: z.ZodIssue[]) {
    super(issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '));
    this.name = 'EnvironmentValidationError';
  }
}

export function loadEnvironment(
  source: Record<string, string | undefined> = process.env,
): EnvironmentConfig {
  const result = environmentSchema.safeParse(source);
  if (!result.success) {
    throw new EnvironmentValidationError(result.error.issues);
  }
  return result.data;
}

export function isGlobalEcosystemConfigured(config: EnvironmentConfig): boolean {
  return Boolean(
    config.GLOBAL_ECOSYSTEM_BASE_URL &&
      config.GLOBAL_ECOSYSTEM_CLIENT_ID &&
      config.GLOBAL_ECOSYSTEM_CLIENT_SECRET,
  );
}
