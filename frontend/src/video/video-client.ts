import type {
  IdeasResponse,
  VideoScript,
  GenerateResponse,
  GenerateRequest,
  ProjectsResponse,
  VideoProject,
} from './types';

interface ApiEnvelope<T> {
  data: T;
  meta: { correlationId: string; timestamp: string };
}

export interface VideoClient {
  loadIdeas(signal?: AbortSignal): Promise<IdeasResponse>;
  loadScript(id: string, signal?: AbortSignal): Promise<VideoScript>;
  generate(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResponse>;
  loadProjects(signal?: AbortSignal): Promise<ProjectsResponse>;
  loadProject(id: string, signal?: AbortSignal): Promise<VideoProject>;
}

export class HttpVideoClient implements VideoClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token = 'mock-creator-token',
  ) {}

  private async get<T>(path: string, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers,
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Video API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  private async post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    });
    if (!response.ok) throw new Error(`Video API returned ${response.status}`);
    return ((await response.json()) as ApiEnvelope<T>).data;
  }

  loadIdeas(signal?: AbortSignal): Promise<IdeasResponse> {
    return this.get<IdeasResponse>('/video/ideas', signal);
  }

  loadScript(id: string, signal?: AbortSignal): Promise<VideoScript> {
    return this.get<VideoScript>(`/video/script/${encodeURIComponent(id)}`, signal);
  }

  generate(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResponse> {
    return this.post<GenerateResponse>('/video/generate', request, signal);
  }

  loadProjects(signal?: AbortSignal): Promise<ProjectsResponse> {
    return this.get<ProjectsResponse>('/video/projects', signal);
  }

  loadProject(id: string, signal?: AbortSignal): Promise<VideoProject> {
    return this.get<VideoProject>(`/video/projects/${encodeURIComponent(id)}`, signal);
  }
}

export function createVideoClient(): VideoClient {
  const configuredBaseUrl = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  return new HttpVideoClient(configuredBaseUrl || '/api/v1');
}
