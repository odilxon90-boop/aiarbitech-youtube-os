import type { VideoProject } from '../../video/types';

export interface ProjectListProps {
  projects: readonly VideoProject[];
  onSelect: (id: string) => void;
}

export function ProjectList({ projects, onSelect }: ProjectListProps) {
  return (
    <section className="card" aria-label="Video Projects">
      <h3 className="card-title">Projects</h3>
      {projects.length === 0 ? (
        <p className="muted">No projects yet.</p>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <button type="button" className="project-button" onClick={() => onSelect(project.id)}>
                <strong>{project.title}</strong>
                <span className={`status-badge status-badge--${project.status.toLowerCase()}`}>{project.status}</span>
                <span className="muted">{project.updatedAt}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
