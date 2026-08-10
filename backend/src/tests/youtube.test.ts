import { afterEach, describe, expect, it } from 'vitest';
import { buildApp, NoopLogger } from '../app/server.js';
import { loadEnvironment } from '../config/environment.js';
import { YouTubeRealClient } from '../youtube/youtube-real-client.js';

const config = loadEnvironment({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost:5432/youtube_os' });
const apps: Awaited<ReturnType<typeof buildApp>>[] = [];

afterEach(async () => Promise.all(apps.splice(0).map((app) => app.close())));

async function createApp() {
  const app = await buildApp({ config, logger: new NoopLogger() });
  apps.push(app);
  return app;
}

describe('YouTube API integration', () => {
  it('falls back to mock channel metadata when credentials are absent', async () => {
    const app = await createApp();
    const response = await app.inject({ method: 'GET', url: '/api/v1/youtube/channels/channel-01', headers: { authorization: 'Bearer legacy-youtube-token', 'x-permissions': 'videos:read' } });
    expect(response.statusCode).toBe(200);
    expect(response.json().data).toMatchObject({ channelId: 'channel-01', title: 'Mock Channel channel-01' });
  });

  it('returns mock video lists and supports mock uploads', async () => {
    const app = await createApp();
    const videos = await app.inject({ method: 'GET', url: '/api/v1/youtube/channels/channel-01/videos', headers: { authorization: 'Bearer legacy-youtube-token', 'x-permissions': 'videos:read' } });
    expect(videos.statusCode).toBe(200);
    expect(videos.json().data.length).toBeGreaterThanOrEqual(1);
    const upload = await app.inject({
      method: 'POST',
      url: '/api/v1/youtube/upload',
      headers: { authorization: 'Bearer legacy-youtube-token', 'x-permissions': 'videos:create' },
      payload: {
        channelId: 'channel-01',
        title: 'Demo upload',
        description: 'Fallback upload',
        mimeType: 'video/mp4',
        contentBase64: Buffer.from('demo').toString('base64'),
      },
    });
    expect(upload.statusCode).toBe(200);
    expect(upload.json().data).toMatchObject({ channelId: 'channel-01', title: 'Demo upload' });
  });

  it('builds real-client channel requests with the YouTube Data API key', async () => {
    const fetchImpl = async (input: string | URL) =>
      new Response(
        JSON.stringify({
          items: [
            {
              id: 'channel-abc',
              snippet: { title: 'Real Channel', description: 'Desc', thumbnails: { default: { url: 'https://img' } } },
              statistics: { subscriberCount: '123', viewCount: '456', videoCount: '7' },
              contentDetails: { relatedPlaylists: { uploads: 'uploads-1' } },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    const client = new YouTubeRealClient({ apiKey: 'api-key', fetchImpl: fetchImpl as typeof fetch });
    const metadata = await client.getChannelMetadata('channel-abc');
    expect(metadata).toMatchObject({ channelId: 'channel-abc', title: 'Real Channel', subscriberCount: 123, videoCount: 7 });
  });
});
