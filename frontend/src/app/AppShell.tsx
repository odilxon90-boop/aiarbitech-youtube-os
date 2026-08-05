import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AIArbiTechnology</p>
          <h1>AIArbiTech YouTube OS</h1>
        </div>
        <span className="foundation-badge">Gate 0B · Foundation 0.1.0</span>
      </header>
      <main>{children}</main>
      <footer>
        Independent platform service В· Global Ecosystem integration is API/event-only В· Gate 0B · Awaiting Enterprise Audit
      </footer>
    </div>
  );
}
