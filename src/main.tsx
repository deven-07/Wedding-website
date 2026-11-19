import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts';
import './styles/globals.css';
import { detectLowPower } from './hooks/useReducedMotion';
import App from './App';

document.documentElement.dataset.lowPower = String(detectLowPower());

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

// Styles are inlined in index.html, so a failed stylesheet preload must never
// abort loading a page section (it used to leave a blank screen on Vercel).
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
});

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
