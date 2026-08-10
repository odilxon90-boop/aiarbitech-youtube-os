import { AppShell } from './AppShell';
import { GlobalEcosystemHomePage } from '../pages/GlobalEcosystemHomePage';
import type { PlatformFoundationClient } from '../platform/platform-client';
export interface AppProps {
  client?: PlatformFoundationClient;
}

export function App(_props: AppProps) {
  return (
    <AppShell>
      <GlobalEcosystemHomePage />
    </AppShell>
  );
}
