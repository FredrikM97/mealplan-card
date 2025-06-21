import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import lit from '@vitejs/plugin-lit';

export default defineConfig({
  plugins: [vue(), lit()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.test.js'],
    coverage: {
      reporter: ['text', 'html'],
      include: [
        'www/cleverio-pf100-feeder-card/**/*.js',
      ],
      exclude: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/wicg-inert/dist/**',
      ],
      all: false,
    },
  },
});
