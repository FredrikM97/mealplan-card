import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import lit from '@vitejs/plugin-lit';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    vue(),
    lit(),
    tsconfigPaths(),
    babel({ filter: /\.[jt]s$/ }), // Force Babel on all .js and .ts files
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: [
      'tests/**/*.test.{js,ts}',
      '__tests__/**/*.test.{js,ts}'
    ],
    coverage: {
      reporter: ['text', 'html'],
      include: [
        'www/cleverio-pf100-feeder-card/**/*.{js,ts}',
      ],
      exclude: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/wicg-inert/dist/**',
      ],
      all: false,
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
