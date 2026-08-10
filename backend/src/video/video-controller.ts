import type {
  IdeasResponse,
  VideoScript,
  GenerateResponse,
  GenerateRequest,
  ProjectsResponse,
  VideoProject,
} from './video-service.js';
import {
  getVideoIdeas,
  getScript,
  generateVideo,
  getProjects,
  getProject,
} from './video-service.js';

export interface VideoController {
  getIdeas(): Promise<IdeasResponse>;
  getScript(id: string): Promise<VideoScript | null>;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
  getProjects(): Promise<ProjectsResponse>;
  getProject(id: string): Promise<VideoProject | null>;
}

export const videoController: VideoController = {
  getIdeas: () => getVideoIdeas(),
  getScript: (id) => getScript(id),
  generate: (request) => generateVideo(request),
  getProjects: () => getProjects(),
  getProject: (id) => getProject(id),
};
