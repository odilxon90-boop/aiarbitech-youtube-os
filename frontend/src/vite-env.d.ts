/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM_API_BASE_URL?: string;
  readonly VITE_GLOBAL_API_BASE_URL?: string;
  readonly VITE_GLOBAL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
