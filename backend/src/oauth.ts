import { PlatformError } from './shared/errors.js';

const YOUTUBE_OAUTH_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const DEFAULT_YOUTUBE_SCOPE = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
].join(' ');

export interface YouTubeAuthorizeUrlOptions {
  state?: string;
  scope?: string;
}

export function buildYouTubeAuthorizeUrl(options: YouTubeAuthorizeUrlOptions = {}): string {
  const clientId = process.env.YOUTUBE_CLIENT_ID?.trim();
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;

  if (!clientId) {
    throw new PlatformError(500, 'YOUTUBE_CLIENT_ID_MISSING', 'YOUTUBE_CLIENT_ID is not configured.');
  }

  if (!redirectUri) {
    throw new PlatformError(500, 'YOUTUBE_REDIRECT_URI_MISSING', 'YOUTUBE_REDIRECT_URI is not configured.');
  }

  const url = new URL(YOUTUBE_OAUTH_AUTHORIZE_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('scope', options.scope ?? DEFAULT_YOUTUBE_SCOPE);

  if (options.state) {
    url.searchParams.set('state', options.state);
  }

  return url.toString();
}
