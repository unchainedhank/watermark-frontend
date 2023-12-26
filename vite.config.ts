import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 3000, // you can replace this port with any port
  },

  resolve: {
    alias: {
      '@': _resolve('src'),
      '@page': _resolve('src/pages')
    }
  },
  envDir: _resolve('env'),

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
