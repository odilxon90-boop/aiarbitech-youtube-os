import type { SkillAssessment } from '../../intelligence/types';

export interface SkillListProps {
  skills: readonly SkillAssessment[];
}

export function SkillList({ skills }: SkillListProps) {
  return (
    <section className="card" aria-label="Skill Assessment">
      <h3 className="card-title">Skill Assessment</h3>
      <ul className="skill-list">
        {skills.map((skill) => (
          <li key={skill.name} className="skill-item">
            <div className="skill-head">
              <strong>{skill.name}</strong>
              <span>{skill.score}/100</span>
            </div>
            <div className="skill-track" role="progressbar" aria-valuenow={skill.score} aria-valuemin={0} aria-valuemax={100}>
              <div className="skill-fill" style={{ width: `${skill.score}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
