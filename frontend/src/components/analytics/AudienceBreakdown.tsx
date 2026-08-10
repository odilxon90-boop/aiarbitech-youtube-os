import type { DeviceBreakdown, RegionBreakdown } from '../../analytics/types';

export interface AudienceBreakdownProps {
  geography: readonly RegionBreakdown[];
  devices: readonly DeviceBreakdown[];
}

interface BarProps {
  label: string;
  share: number;
}

function AudienceBar({ label, share }: BarProps) {
  const width = Math.min(100, Math.max(0, share));
  return (
    <li className="audience-row">
      <span className="audience-row__label">{label}</span>
      <div className="audience-row__track">
        <div className="audience-row__fill" style={{ width: `${width}%` }} />
      </div>
      <span className="audience-row__value">{share}%</span>
    </li>
  );
}

export function AudienceBreakdown({ geography, devices }: AudienceBreakdownProps) {
  if (geography.length === 0 && devices.length === 0) {
    return <p className="muted">No audience data yet.</p>;
  }
  return (
    <div className="audience-breakdown" data-testid="audience-breakdown">
      <div className="audience-group">
        <h4>Audience Geography</h4>
        <ul className="audience-list">
          {geography.map((region) => (
            <AudienceBar key={region.country} label={region.country} share={region.share} />
          ))}
        </ul>
      </div>
      <div className="audience-group">
        <h4>Devices</h4>
        <ul className="audience-list">
          {devices.map((device) => (
            <AudienceBar key={device.device} label={device.device} share={device.share} />
          ))}
        </ul>
      </div>
    </div>
  );
}
