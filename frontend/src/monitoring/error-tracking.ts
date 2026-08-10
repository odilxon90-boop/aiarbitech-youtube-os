export interface FrontendErrorEvent {
  message: string;
  timestamp: string;
  stack?: string;
}

export function trackFrontendError(error: unknown): FrontendErrorEvent {
  const event: FrontendErrorEvent = {
    message: error instanceof Error ? error.message : 'Unknown frontend error',
    timestamp: new Date().toISOString(),
    ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
  };
  console.error(JSON.stringify({ level: 'error', message: 'Frontend error', event }));
  const endpoint = import.meta.env.VITE_LOG_INGEST_URL?.trim();
  if (endpoint && typeof navigator !== 'undefined') {
    void fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ level: 'error', service: 'frontend', event }), keepalive: true }).catch(() => undefined);
  }
  return event;
}

export function registerFrontendErrorTracking(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (event) => { trackFrontendError(event.error ?? event.message); });
  window.addEventListener('unhandledrejection', (event) => { trackFrontendError(event.reason); });
}
