import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./HTMLs/index.html', import.meta.url)),
        login: fileURLToPath(new URL('./HTMLs/login.html', import.meta.url)),
        register: fileURLToPath(new URL('./HTMLs/create.html', import.meta.url)),
      },
    },
  },
});
