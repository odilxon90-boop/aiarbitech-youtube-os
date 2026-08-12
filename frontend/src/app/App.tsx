import { AppShell } from './AppShell';
import { GlobalEcosystemHomePage } from '../pages/GlobalEcosystemHomePage';
import { CreatorDashboard } from '../pages/CreatorDashboard';
import type { PlatformFoundationClient } from '../platform/platform-client';
export interface AppProps {
  client?: PlatformFoundationClient;
}

export function App(_props: AppProps) {
  const path = window.location.pathname.replace(/^\/youtube-os/, '');
  return (
    <AppShell>
      {path === '/creator' ? <CreatorDashboard /> : <GlobalEcosystemHomePage />}
    </AppShell>
  );
}
