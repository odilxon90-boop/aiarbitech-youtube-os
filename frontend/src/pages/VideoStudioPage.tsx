import { useEffect, useMemo, useState } from 'react';
import { createVideoClient, type VideoClient } from '../video/video-client';
import type { GenerateRequest, IdeasResponse, VideoProject, VideoScript } from '../video/types';
import { IdeaList } from '../components/video/IdeaList';
import { ScriptViewer } from '../components/video/ScriptViewer';
import { GenerateForm } from '../components/video/GenerateForm';
import { ProjectList } from '../components/video/ProjectList';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/AsyncStates';
import { errorState, loadingState, successState, type AsyncState } from '../shared/async-state';

interface VideoStudioPageProps {
  client?: VideoClient;
  initialData?: {
    ideas: IdeasResponse;
    projects: { projects: VideoProject[] };
    script?: VideoScript;
  };
}

type Tab = 'ideas' | 'generate' | 'projects';

export function VideoStudioPage({ client, initialData }: VideoStudioPageProps) {
  const [ideasState, setIdeasState] = useState<AsyncState<IdeasResponse>>(() =>
    initialData?.ideas ? successState(initialData.ideas) : loadingState(),
  );
  const [projectsState, setProjectsState] = useState<AsyncState<{ projects: VideoProject[] }>>(() =>
    initialData?.projects ? successState(initialData.projects) : loadingState(),
  );
  const [script, setScript] = useState<VideoScript | null>(initialData?.script ?? null);
  const [activeTab, setActiveTab] = useState<Tab>('ideas');

  const videoClient = useMemo(() => client ?? createVideoClient(), [client]);

  useEffect(() => {
    const controller = new AbortController();
    if (!initialData?.ideas) {
      setIdeasState(loadingState());
      videoClient
        .loadIdeas(controller.signal)
        .then((data) => setIdeasState(successState(data)))
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setIdeasState(errorState(error instanceof Error ? error.message : 'Unable to load ideas.'));
          }
        });
    }
    if (!initialData?.projects) {
      setProjectsState(loadingState());
      videoClient
        .loadProjects(controller.signal)
        .then((data) => setProjectsState(successState(data)))
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setProjectsState(errorState(error instanceof Error ? error.message : 'Unable to load projects.'));
          }
        });
    }
    return () => controller.abort();
  }, [videoClient, initialData]);

  const handleGenerate = async (request: GenerateRequest) => {
    const generated = await videoClient.generate(request);
    setScript(generated.script);
    setActiveTab('projects');
  };

  const handleProjectSelect = async (id: string) => {
    const project = await videoClient.loadProject(id);
    if (project.scriptId) {
      const s = await videoClient.loadScript(project.scriptId);
      setScript(s);
    } else {
      setScript(null);
    }
  };

  return (
    <section className="video-page" aria-label="AI Video Studio">
      <header className="video-header">
        <div>
          <p className="section-kicker">AI Studio</p>
          <h2 className="video-title">AI Video Studio</h2>
        </div>
      </header>

      <nav className="video-tabs" aria-label="Video studio tabs">
        <button type="button" className={`video-tab ${activeTab === 'ideas' ? 'video-tab--active' : ''}`} onClick={() => setActiveTab('ideas')}>
          Ideas
        </button>
        <button type="button" className={`video-tab ${activeTab === 'generate' ? 'video-tab--active' : ''}`} onClick={() => setActiveTab('generate')}>
          Generate
        </button>
        <button type="button" className={`video-tab ${activeTab === 'projects' ? 'video-tab--active' : ''}`} onClick={() => setActiveTab('projects')}>
          Projects
        </button>
      </nav>

      {activeTab === 'ideas' && (
        <div className="video-panel">
          {ideasState.status === 'loading' && <LoadingState message="Loading video ideas…" />}
          {ideasState.status === 'error' && <ErrorState message={ideasState.error ?? 'Unable to load ideas.'} />}
          {ideasState.status === 'success' && ideasState.data && (
            <IdeaList ideas={ideasState.data.ideas} />
          )}
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="video-panel">
          <GenerateForm onGenerate={handleGenerate} />
          {script && (
            <div className="generated-script">
              <ScriptViewer script={script} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="video-panel">
          {projectsState.status === 'loading' && <LoadingState message="Loading projects…" />}
          {projectsState.status === 'error' && <ErrorState message={projectsState.error ?? 'Unable to load projects.'} />}
          {projectsState.status === 'success' && projectsState.data && (
            <ProjectList projects={projectsState.data.projects} onSelect={handleProjectSelect} />
          )}
          {script && (
            <div className="project-script">
              <ScriptViewer script={script} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
