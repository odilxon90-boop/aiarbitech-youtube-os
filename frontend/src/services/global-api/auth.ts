import { GlobalApiClient } from './client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface GlobalUser {
  id: string;
  email: string;
  [key: string]: unknown;
}

export class GlobalAuthApi {
  constructor(private readonly client: GlobalApiClient) {}

  login(email: string, password: string): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/identity/auth/login', { email, password });
  }

  refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/identity/auth/refresh', { refreshToken });
  }

  logout(refreshToken?: string): Promise<void> {
    return this.client.post<void>('/identity/auth/logout', refreshToken ? { refreshToken } : undefined);
  }

  getCurrentUser(): Promise<GlobalUser> {
    return this.client.get<GlobalUser>('/identity/me');
  }
}
