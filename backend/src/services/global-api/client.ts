export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface GlobalApiClientOptions {
  baseURL: string;
  apiKey: string;
  timeout?: number;
  retries?: number;
  fetchImpl?: typeof fetch;
}

export class GlobalApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly retryable = false,
  ) {
    super(message);
    this.name = 'GlobalApiError';
  }
}

export class GlobalApiClient {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: GlobalApiClientOptions) {
    this.baseURL = options.baseURL.replace(/\/+$/, '');
    this.apiKey = options.apiKey;
    this.timeout = options.timeout ?? 5_000;
    this.retries = options.retries ?? 2;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    let lastError: GlobalApiError | undefined;

    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
          const response = await this.fetchImpl(`${this.baseURL}${path}`, {
            method,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-Key': this.apiKey,
            },
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
            signal: controller.signal,
          });

          if (!response.ok) {
            const retryable = response.status >= 500 || response.status === 429;
            throw new GlobalApiError(`Global API returned ${response.status}`, response.status, retryable);
          }

          return (await response.json()) as T;
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        lastError =
          error instanceof GlobalApiError
            ? error
            : new GlobalApiError(
                error instanceof Error && error.name === 'AbortError'
                  ? `Global API request timed out after ${this.timeout}ms`
                  : 'Global API request failed',
                undefined,
                true,
              );

        if (!lastError.retryable || attempt === this.retries) throw lastError;
      }
    }

    throw lastError ?? new GlobalApiError('Global API request failed');
  }
}
