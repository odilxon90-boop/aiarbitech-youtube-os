import type {
  CreateGoalInput,
  Goal,
  GoalsBundle,
  GoalsClient,
  ProgressInput,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export class HttpGoalsClient implements GoalsClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  private async request<T>(input: RequestInfo, init: RequestInit): Promise<T> {
    const response = await fetch(input, init);
    if (!response.ok) throw new Error(`Goals API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  listGoals(signal?: AbortSignal): Promise<Goal[]> {
    return this.request<Goal[]>(`${this.baseUrl}/goals/list`, {
      method: 'GET',
      headers: this.headers(),
      ...(signal ? { signal } : {}),
    });
  }

  createGoal(input: CreateGoalInput, signal?: AbortSignal): Promise<Goal> {
    return this.request<Goal>(`${this.baseUrl}/goals/create`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(input),
      ...(signal ? { signal } : {}),
    });
  }

  updateProgress(goalId: string, input: ProgressInput, signal?: AbortSignal): Promise<Goal> {
    return this.request<Goal>(`${this.baseUrl}/goals/${goalId}/progress`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(input),
      ...(signal ? { signal } : {}),
    });
  }

  deleteGoal(goalId: string, signal?: AbortSignal): Promise<{ deleted: boolean; goalId: string }> {
    return this.request<{ deleted: boolean; goalId: string }>(`${this.baseUrl}/goals/${goalId}`, {
      method: 'DELETE',
      headers: this.headers(),
      ...(signal ? { signal } : {}),
    });
  }

  getRecommendations(goalId?: string, signal?: AbortSignal): Promise<GoalsBundle> {
    const url = new URL(`${this.baseUrl}/goals/recommendations`);
    if (goalId) url.searchParams.set('goalId', goalId);
    return this.request<GoalsBundle>(url.toString(), {
      method: 'GET',
      headers: this.headers(),
      ...(signal ? { signal } : {}),
    });
  }
}

export type { GoalsClient } from './types';

export function createGoalsClient(): GoalsClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpGoalsClient(configuredBaseUrl || '/api/v1', 'mock-creator-token');
}
