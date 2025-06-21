import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import lit from '@vitejs/plugin-lit';
import babel from 'vite-plugin-babel';

export default defineConfig({
  plugins: [
    vue(),
    lit(),
    babel({ filter: /\.js$/ }), // Force Babel on all .js files
  ],
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
