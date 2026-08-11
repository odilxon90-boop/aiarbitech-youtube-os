import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { registerFrontendErrorTracking } from './monitoring/error-tracking';
import './i18n';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Application root element is missing.');
registerFrontendErrorTracking();

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
