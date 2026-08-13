import { AppShell } from './AppShell';
import { GlobalEcosystemHomePage } from '../pages/GlobalEcosystemHomePage';
import { CreatorDashboard } from '../pages/CreatorDashboard';
import { PresidentPanelPage } from '../pages/PresidentPanelPage';
import { GoalsPage } from '../pages/GoalsPage';
import type { PlatformFoundationClient } from '../platform/platform-client';

export interface AppProps {
  client?: PlatformFoundationClient;
}

export function App(_props: AppProps) {
  const path = window.location.pathname.replace(/^\/youtube-os/, '');
  const isCreatorRoute = path === '' || path === '/' || path === '/creator';
  return <AppShell>{isCreatorRoute ? <CreatorDashboard /> : path === '/president' ? <PresidentPanelPage /> : path === '/goals' ? <GoalsPage /> : <GlobalEcosystemHomePage />}</AppShell>;
}
