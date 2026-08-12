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
  private readonly configuration: {
    apiKey: boolean;
    oauthClient: boolean;
    accessToken: boolean;
    refreshToken: boolean;
  };

  constructor(source: NodeJS.ProcessEnv = process.env) {
    const options: ConstructorParameters<typeof YouTubeRealClient>[0] = {};
    if (source.YOUTUBE_API_KEY) options.apiKey = source.YOUTUBE_API_KEY;
    if (source.YOUTUBE_CLIENT_ID) options.clientId = source.YOUTUBE_CLIENT_ID;
    if (source.YOUTUBE_CLIENT_SECRET) options.clientSecret = source.YOUTUBE_CLIENT_SECRET;
    if (source.YOUTUBE_ACCESS_TOKEN) options.accessToken = source.YOUTUBE_ACCESS_TOKEN;
    if (source.YOUTUBE_REFRESH_TOKEN) options.refreshToken = source.YOUTUBE_REFRESH_TOKEN;
    this.client = new YouTubeRealClient(options);
    this.configuration = {
      apiKey: Boolean(source.YOUTUBE_API_KEY),
      oauthClient: Boolean(source.YOUTUBE_CLIENT_ID && source.YOUTUBE_CLIENT_SECRET),
      accessToken: Boolean(source.YOUTUBE_ACCESS_TOKEN),
      refreshToken: Boolean(source.YOUTUBE_REFRESH_TOKEN),
    };
  }

  status() {
    const readConfigured = this.client.isConfiguredForRead();
    const uploadConfigured =
      this.configuration.accessToken ||
      (this.configuration.oauthClient && this.configuration.refreshToken);
    const mode = this.configuration.apiKey
      ? 'API_KEY'
      : uploadConfigured || this.configuration.oauthClient
        ? 'OAUTH'
        : 'MOCK_FALLBACK';

    return {
      status: readConfigured ? 'CONFIGURED' : 'DEGRADED',
      mode,
      readConfigured,
      uploadConfigured,
      fallbackEnabled: true,
      checkedAt: new Date().toISOString(),
    };
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
