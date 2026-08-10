export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface GlobalApiClientOptions {
  baseURL: string;
  apiKey: string;
  token?: string;
  fetchImpl?: typeof fetch;
}

export class GlobalApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'GlobalApiError';
  }
}

export class GlobalApiClient {
  private readonly baseURL: string;
  private readonly apiKey: string;
  private token: string | undefined;
  private readonly fetchImpl: typeof fetch;

  constructor(options: GlobalApiClientOptions) {
    this.baseURL = options.baseURL.replace(/\/+$/, '');
    this.apiKey = options.apiKey;
    this.token = options.token;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  setToken(token: string | undefined): void {
    this.token = token;
  }

  request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    return this.send<T>(method, path, body);
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

  private async send<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
    const response = await this.fetchImpl(`${this.baseURL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    if (!response.ok) throw new GlobalApiError(`Global API returned ${response.status}`, response.status);
    return (await response.json()) as T;
  }
}
