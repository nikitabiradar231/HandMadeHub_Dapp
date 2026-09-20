import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

// The compiled contract lives outside `frontend/` (it is generated into
// `contracts/managed/...` by `npm run compile` at the repo root), so the dev
// server must be allowed to serve files from the parent directory.
export default defineConfig({
  plugins: [react(), tailwindcss(), wasm(), topLevelAwait()],
  define: {
    // Node-polyfill deps (@subsquid/* -> assert -> util) touch `process.env`
    // at module scope. There is no `process` global in the browser, so pin it
    // to an empty object instead of letting the bundle crash at eval time.
    'process.env': '{}',
    global: 'globalThis',
  },
  resolve: {
    alias: {
      assert: 'assert',
      events: 'events',
      buffer: 'buffer',
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    chunkSizeWarningLimit: 4000,
    target: 'es2022',
  },
  optimizeDeps: {
    exclude: ['@midnight-ntwrk/onchain-runtime-v3'],
    include: ['buffer'],
  },
});
