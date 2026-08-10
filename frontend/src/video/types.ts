export interface VideoIdea {
  id: string;
  title: string;
  description: string;
  confidence: number;
  trend: string;
}

export interface VideoScript {
  id: string;
  topic: string;
  style: string;
  length: string;
  outline: string[];
}

export interface GenerateRequest {
  topic: string;
  style: string;
  length: string;
}

export interface GenerateResponse {
  script: VideoScript;
}

export interface VideoProject {
  id: string;
  title: string;
  status: 'DRAFT' | 'SCRIPTED' | 'EDITING' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
  scriptId?: string;
  metadata: {
    duration?: string;
    format?: string;
    tags?: string[];
  };
}

export interface IdeasResponse {
  ideas: VideoIdea[];
}

export interface ProjectsResponse {
  projects: VideoProject[];
}
