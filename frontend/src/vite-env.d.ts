/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM_API_BASE_URL?: string;
  readonly VITE_GLOBAL_API_BASE_URL?: string;
  readonly VITE_GLOBAL_API_KEY?: string;
  readonly VITE_YOUTUBE_CLIENT_ID?: string;
  readonly VITE_YOUTUBE_REDIRECT_URI?: string;
  readonly VITE_YOUTUBE_CHANNEL_ID?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
  readonly VITE_USER_DISPLAY_NAME?: string;
  readonly VITE_USER_AVATAR_URL?: string;
  readonly VITE_SOCIAL_YOUTUBE_URL?: string;
  readonly VITE_SOCIAL_X_URL?: string;
  readonly VITE_SOCIAL_LINKEDIN_URL?: string;
  readonly VITE_SOCIAL_GITHUB_URL?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
