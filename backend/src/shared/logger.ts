import type { FastifyRequest } from 'fastify';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  context?: Readonly<Record<string, unknown>>;
}

export interface PlatformLogger {
  info(message: string, context?: Readonly<Record<string, unknown>>): void;
  warn(message: string, context?: Readonly<Record<string, unknown>>): void;
  error(message: string, context?: Readonly<Record<string, unknown>>): void;
}

export class StructuredConsoleLogger implements PlatformLogger {
  private write(level: LogLevel, message: string, context?: Readonly<Record<string, unknown>>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(typeof context?.correlationId === 'string' ? { correlationId: context.correlationId } : {}),
      ...(context ? { context } : {}),
    };
    const output = JSON.stringify(entry);
    if (level === 'error') console.error(output);
    else if (level === 'warn') console.warn(output);
    else console.info(output);
  }

  info(message: string, context?: Readonly<Record<string, unknown>>): void {
    this.write('info', message, context);
  }

  warn(message: string, context?: Readonly<Record<string, unknown>>): void {
    this.write('warn', message, context);
  }

  error(message: string, context?: Readonly<Record<string, unknown>>): void {
    this.write('error', message, context);
  }
}

export class NoopLogger implements PlatformLogger {
  info(): void {}
  warn(): void {}
  error(): void {}
}

export function requestLogContext(request: FastifyRequest): Readonly<Record<string, unknown>> {
  return {
    correlationId: request.correlationId,
    method: request.method,
    path: request.url,
  };
}
