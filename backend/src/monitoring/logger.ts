import type { PlatformLogger } from '../shared/logger.js';

export interface MonitoringEvent {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Readonly<Record<string, unknown>>;
}

export class MonitoringLogger {
  constructor(private readonly logger: PlatformLogger) {}

  request(context: Readonly<Record<string, unknown>>): void {
    this.logger.info('HTTP request completed', context);
  }

  slowRequest(context: Readonly<Record<string, unknown>>): void {
    this.logger.warn('Slow HTTP request', context);
  }

  error(message: string, error: unknown, context?: Readonly<Record<string, unknown>>): void {
    this.logger.error(message, {
      ...(context ?? {}),
      errorName: error instanceof Error ? error.name : 'UnknownError',
      ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
    });
  }
}
