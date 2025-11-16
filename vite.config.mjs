import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Determine base path based on deployment target
    // GitHub Pages needs /bedrijfsbeheer/, Render.com and other platforms need /
    const isGitHubPages = env.DEPLOY_TARGET === 'github';
    const basePath = isGitHubPages ? '/bedrijfsbeheer/' : '/';

    return {
      // Dynamic base path for different deployment targets
      base: basePath,
      plugins: [react()],
      build: {
        sourcemap: true,
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
