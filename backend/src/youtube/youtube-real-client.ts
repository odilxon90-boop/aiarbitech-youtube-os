import { PlatformError } from '../shared/errors.js';

export interface YouTubeChannelMetadata {
  channelId: string;
  title: string;
  description: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  uploadsPlaylistId: string | null;
  thumbnailUrl: string | null;
  fetchedAt: string;
}

export interface YouTubeVideoSummary {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string | null;
}

export interface YouTubeUploadInput {
  channelId: string;
  title: string;
  description: string;
  mimeType: string;
  content: Uint8Array;
  privacyStatus?: 'public' | 'unlisted' | 'private';
  tags?: readonly string[];
}

export interface YouTubeUploadResult {
  channelId: string;
  videoId: string;
  uploadId: string;
  title: string;
  publishedAt: string;
}

interface YouTubeClientOptions {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

interface YouTubeApiListResponse<T> {
  items?: T[];
}

interface YouTubeChannelApiItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: { default?: { url?: string } };
  };
  statistics?: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
  };
  contentDetails?: {
    relatedPlaylists?: { uploads?: string };
  };
}

interface YouTubePlaylistItemApiItem {
  snippet?: {
    resourceId?: { videoId?: string };
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: { default?: { url?: string } };
  };
}

interface YouTubeVideoApiItem {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: { default?: { url?: string } };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export class YouTubeRealClient {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: YouTubeClientOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  isConfiguredForRead(): boolean {
    return Boolean(this.options.apiKey || this.options.accessToken || (this.options.clientId && this.options.clientSecret));
  }

  async getChannelMetadata(channelId: string): Promise<YouTubeChannelMetadata> {
    const url = new URL('https://www.googleapis.com/youtube/v3/channels');
    url.searchParams.set('part', 'snippet,statistics,contentDetails');
    url.searchParams.set('id', channelId);
    if (this.options.apiKey) url.searchParams.set('key', this.options.apiKey);
    const headers = await this.buildReadHeaders();

    const response = await this.requestJson<YouTubeApiListResponse<YouTubeChannelApiItem>>(url.toString(), { headers });
    const channel = response.items?.[0];
    if (!channel) {
      throw new PlatformError(404, 'YOUTUBE_CHANNEL_NOT_FOUND', `Channel ${channelId} was not found.`);
    }

    return {
      channelId: channel.id,
      title: channel.snippet?.title ?? 'Unknown channel',
      description: channel.snippet?.description ?? '',
      subscriberCount: Number(channel.statistics?.subscriberCount ?? 0),
      viewCount: Number(channel.statistics?.viewCount ?? 0),
      videoCount: Number(channel.statistics?.videoCount ?? 0),
      uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads ?? null,
      thumbnailUrl: channel.snippet?.thumbnails?.default?.url ?? null,
      fetchedAt: new Date().toISOString(),
    };
  }

  async listVideos(channelId: string, maxResults = 10): Promise<readonly YouTubeVideoSummary[]> {
    const channel = await this.getChannelMetadata(channelId);
    if (!channel.uploadsPlaylistId) {
      throw new PlatformError(502, 'YOUTUBE_UPLOADS_PLAYLIST_MISSING', `Channel ${channelId} does not expose an uploads playlist.`);
    }

    const playlistUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    playlistUrl.searchParams.set('part', 'snippet');
    playlistUrl.searchParams.set('playlistId', channel.uploadsPlaylistId);
    playlistUrl.searchParams.set('maxResults', String(maxResults));
    if (this.options.apiKey) playlistUrl.searchParams.set('key', this.options.apiKey);
    const headers = await this.buildReadHeaders();

    const playlistResponse = await this.requestJson<YouTubeApiListResponse<YouTubePlaylistItemApiItem>>(playlistUrl.toString(), { headers });
    const videoIds = playlistResponse.items
      ?.map((item) => item.snippet?.resourceId?.videoId)
      .filter((videoId): videoId is string => Boolean(videoId))
      .slice(0, maxResults) ?? [];

    if (videoIds.length === 0) {
      return [];
    }

    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videosUrl.searchParams.set('part', 'snippet,statistics');
    videosUrl.searchParams.set('id', videoIds.join(','));
    if (this.options.apiKey) videosUrl.searchParams.set('key', this.options.apiKey);
    const videoResponse = await this.requestJson<YouTubeApiListResponse<YouTubeVideoApiItem>>(videosUrl.toString(), { headers: await this.buildReadHeaders() });
    return (videoResponse.items ?? []).map((item) => ({
      videoId: item.id ?? '',
      title: item.snippet?.title ?? 'Unknown video',
      description: item.snippet?.description ?? '',
      publishedAt: item.snippet?.publishedAt ?? new Date().toISOString(),
      viewCount: Number(item.statistics?.viewCount ?? 0),
      likeCount: Number(item.statistics?.likeCount ?? 0),
      commentCount: Number(item.statistics?.commentCount ?? 0),
      thumbnailUrl: item.snippet?.thumbnails?.default?.url ?? null,
    }));
  }

  async uploadVideo(input: YouTubeUploadInput): Promise<YouTubeUploadResult> {
    const accessToken = await this.getUploadToken();
    const metadata = {
      snippet: {
        title: input.title,
        description: input.description,
        tags: input.tags ?? [],
        categoryId: '22',
      },
      status: {
        privacyStatus: input.privacyStatus ?? 'private',
      },
    };
    const initiate = await this.fetchImpl('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': input.mimeType,
        'X-Upload-Content-Length': String(input.content.byteLength),
      },
      body: JSON.stringify(metadata),
    });
    if (!initiate.ok) {
      throw await this.toPlatformError(initiate, 'YOUTUBE_UPLOAD_INIT_FAILED');
    }
    const uploadUrl = initiate.headers.get('location') ?? initiate.headers.get('Location');
    if (!uploadUrl) {
      throw new PlatformError(502, 'YOUTUBE_UPLOAD_SESSION_MISSING', 'YouTube upload session URL was not returned.');
    }
    const uploadResponse = await this.fetchImpl(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': input.mimeType,
        'Content-Length': String(input.content.byteLength),
      },
      body: input.content,
    });
    if (!uploadResponse.ok) {
      throw await this.toPlatformError(uploadResponse, 'YOUTUBE_UPLOAD_FAILED');
    }
    const body = (await uploadResponse.json()) as { id?: string; snippet?: { publishedAt?: string } };
    return {
      channelId: input.channelId,
      videoId: body.id ?? '',
      uploadId: uploadUrl,
      title: input.title,
      publishedAt: body.snippet?.publishedAt ?? new Date().toISOString(),
    };
  }

  private async buildReadHeaders(): Promise<Record<string, string>> {
    if (this.options.apiKey) return {};
    const token = await this.getReadToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async getReadToken(): Promise<string | undefined> {
    if (this.options.accessToken) return this.options.accessToken;
    if (!this.options.clientId || !this.options.clientSecret || !this.options.refreshToken) return undefined;
    const tokenResponse = await this.fetchImpl('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.options.refreshToken,
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
      }),
    });
    if (!tokenResponse.ok) {
      throw await this.toPlatformError(tokenResponse, 'YOUTUBE_TOKEN_REFRESH_FAILED');
    }
    const body = (await tokenResponse.json()) as { access_token?: string };
    return body.access_token;
  }

  private async getUploadToken(): Promise<string> {
    if (this.options.accessToken) return this.options.accessToken;
    const token = await this.getReadToken();
    if (!token) {
      throw new PlatformError(503, 'YOUTUBE_OAUTH_NOT_CONFIGURED', 'YouTube OAuth credentials are not configured.');
    }
    return token;
  }

  private async requestJson<T>(url: string, init: RequestInit = {}): Promise<T> {
    const timeout = this.options.timeoutMs ?? 10_000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await this.fetchImpl(url, { ...init, signal: controller.signal });
      if (!response.ok) {
        throw await this.toPlatformError(response, 'YOUTUBE_API_REQUEST_FAILED');
      }
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof PlatformError) throw error;
      throw new PlatformError(503, 'YOUTUBE_API_UNAVAILABLE', error instanceof Error ? error.message : 'YouTube API request failed.');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async toPlatformError(response: Response, code: string): Promise<PlatformError> {
    const text = await response.text();
    return new PlatformError(response.status || 502, code, text || 'YouTube API request failed.');
  }
}
