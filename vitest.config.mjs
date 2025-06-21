import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.test.js'],
    coverage: {
      reporter: ['text', 'html'],
      include: [
        'src/**/*.js',
      ],
      exclude: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/wicg-inert/dist/**',
      ],
      all: true,
    },
    deps: {
      inline: [/@lit/, /lit/, /@open-wc/, /@webcomponents/],
    },
    transformMode: {
      web: [/\.([cm]?[jt]sx?|vue)$/],
      ssr: [/\.([cm]?[jt]sx?|vue)$/],
    },
  },
  esbuild: {
    supported: {
      'decorators': true
    },
    target: 'esnext'
  }
});
