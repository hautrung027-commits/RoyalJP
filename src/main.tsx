import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './i18n';
// Chi nap o dev: gan window.royalDebug de chan doan Firebase trong DevTools.
if (import.meta.env.DEV) {
  import('./lib/firebaseDiagnostic');
}
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
