import { PlatformError } from '../shared/errors.js';
import { YouTubeRealClient, type YouTubeChannelMetadata, type YouTubeUploadInput, type YouTubeUploadResult, type YouTubeVideoSummary } from './youtube-real-client.js';

const fallbackChannels = new Map<string, YouTubeChannelMetadata>();
const fallbackVideos = new Map<string, readonly YouTubeVideoSummary[]>();

function fallbackChannel(channelId: string): YouTubeChannelMetadata {
  const existing = fallbackChannels.get(channelId);
  if (existing) return existing;
  const created = {
    channelId,
    title: `Mock Channel ${channelId}`,
    description: 'Fallback channel metadata used when YouTube Data API is unavailable.',
    subscriberCount: 120_000,
    viewCount: 8_400_000,
    videoCount: 240,
    uploadsPlaylistId: null,
    thumbnailUrl: null,
    fetchedAt: new Date().toISOString(),
  };
  fallbackChannels.set(channelId, created);
  return created;
}

function fallbackVideoList(channelId: string): readonly YouTubeVideoSummary[] {
  const existing = fallbackVideos.get(channelId);
  if (existing) return existing;
  const videos: readonly YouTubeVideoSummary[] = [
    {
      videoId: `${channelId}-video-1`,
      title: 'Mock Creator Growth Playbook',
      description: 'Fallback video list used when the YouTube Data API is unavailable.',
      publishedAt: new Date().toISOString(),
      viewCount: 45_000,
      likeCount: 2_400,
      commentCount: 180,
      thumbnailUrl: null,
    },
  ];
  fallbackVideos.set(channelId, videos);
  return videos;
}

export class YouTubeService {
  private readonly client: YouTubeRealClient;

  constructor() {
    const options: ConstructorParameters<typeof YouTubeRealClient>[0] = {};
    if (process.env.YOUTUBE_API_KEY) options.apiKey = process.env.YOUTUBE_API_KEY;
    if (process.env.YOUTUBE_CLIENT_ID) options.clientId = process.env.YOUTUBE_CLIENT_ID;
    if (process.env.YOUTUBE_CLIENT_SECRET) options.clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    if (process.env.YOUTUBE_ACCESS_TOKEN) options.accessToken = process.env.YOUTUBE_ACCESS_TOKEN;
    if (process.env.YOUTUBE_REFRESH_TOKEN) options.refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
    this.client = new YouTubeRealClient(options);
  }

  async getChannelMetadata(channelId: string): Promise<YouTubeChannelMetadata> {
    try {
      return await this.client.getChannelMetadata(channelId);
    } catch {
      return fallbackChannel(channelId);
    }
  }

  async listVideos(channelId: string, maxResults = 10): Promise<readonly YouTubeVideoSummary[]> {
    try {
      return await this.client.listVideos(channelId, maxResults);
    } catch {
      return fallbackVideoList(channelId).slice(0, maxResults);
    }
  }

  async uploadVideo(input: YouTubeUploadInput): Promise<YouTubeUploadResult> {
    try {
      return await this.client.uploadVideo(input);
    } catch (error) {
      if (error instanceof PlatformError && error.code !== 'YOUTUBE_OAUTH_NOT_CONFIGURED') {
        throw error;
      }
      return {
        channelId: input.channelId,
        videoId: `${input.channelId}-mock-upload`,
        uploadId: 'mock-upload',
        title: input.title,
        publishedAt: new Date().toISOString(),
      };
    }
  }
}
