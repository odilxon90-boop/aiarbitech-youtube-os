import type { CreatorProfile } from '../../intelligence/types';

export interface ProfileCardProps {
  profile: CreatorProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <section className="card" aria-label="Creator Profile">
      <h3 className="card-title">Creator Profile</h3>
      <div className="profile-meta">
        <div>
          <strong>{profile.name}</strong>
          <span>{profile.level}</span>
        </div>
        <div>
          <span>Experience</span>
          <span>{profile.experience}</span>
        </div>
        <div>
          <span>Niche</span>
          <span>{profile.niche}</span>
        </div>
      </div>
    </section>
  );
}
