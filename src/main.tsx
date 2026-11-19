import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts';
import './styles/globals.css';
import { detectLowPower } from './hooks/useReducedMotion';
import App from './App';

document.documentElement.dataset.lowPower = String(detectLowPower());

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
