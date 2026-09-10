import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

try {
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
    (window as any).__pq_mounted = true;
  }
} catch (err) {
  console.error('PharmedQuest: Error mounting React app:', err);
}
