import type { TopVideo } from '../../analytics/types';

export interface TopVideosTableProps {
  videos: readonly TopVideo[];
}

export function TopVideosTable({ videos }: TopVideosTableProps) {
  if (videos.length === 0) {
    return <p className="muted">No video data yet.</p>;
  }
  return (
    <div className="top-videos" data-testid="top-videos">
      <table className="top-videos__table">
        <thead>
          <tr>
            <th>#</th>
            <th>Video</th>
            <th>Views</th>
            <th>Watch time (h)</th>
            <th>CTR</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={video.id}>
              <td>{index + 1}</td>
              <td>{video.title}</td>
              <td>{video.views.toLocaleString()}</td>
              <td>{video.watchTimeHours}</td>
              <td>{video.ctr.toFixed(1)}%</td>
              <td>${video.revenue.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}