import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
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
