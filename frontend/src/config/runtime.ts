function value(name: keyof ImportMetaEnv): string {
  return import.meta.env[name]?.trim() ?? '';
}

export const publicRuntimeConfig = {
  apiBaseUrl: value('VITE_PLATFORM_API_BASE_URL') || '/api/v1',
  supportEmail: value('VITE_SUPPORT_EMAIL') || 'support@aiarbitech.com',
  userDisplayName: value('VITE_USER_DISPLAY_NAME') || 'Creator',
  userAvatarUrl: value('VITE_USER_AVATAR_URL'),
  youtube: {
    clientId: value('VITE_YOUTUBE_CLIENT_ID'),
    redirectUri: value('VITE_YOUTUBE_REDIRECT_URI'),
    channelId: value('VITE_YOUTUBE_CHANNEL_ID'),
  },
  social: [
    { label: 'YouTube', icon: '▶', url: value('VITE_SOCIAL_YOUTUBE_URL') },
    { label: 'X', icon: '𝕏', url: value('VITE_SOCIAL_X_URL') },
    { label: 'LinkedIn', icon: 'in', url: value('VITE_SOCIAL_LINKEDIN_URL') },
    { label: 'GitHub', icon: '◉', url: value('VITE_SOCIAL_GITHUB_URL') },
  ].filter((item) => item.url),
} as const;

export function createYouTubeOAuthUrl(state: string): string | undefined {
  const { clientId, redirectUri } = publicRuntimeConfig.youtube;
  if (!clientId || !redirectUri) return undefined;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload');
  url.searchParams.set('state', state);
  return url.toString();
}
