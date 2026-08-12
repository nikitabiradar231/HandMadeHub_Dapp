import { Buffer } from 'buffer';

// Polyfill global Buffer for Midnight SDKs and wallet address utilities in the browser
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}
if (typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = Buffer;
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
