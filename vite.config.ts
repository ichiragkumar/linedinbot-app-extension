import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        background: 'src/background.ts',
        contentScript: 'src/contentScript.tsx',
      },
      output: {
        entryFileNames: 'src/[name].js',
      },
    },
  },
});