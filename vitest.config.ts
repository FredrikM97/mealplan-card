import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    env: {
      TZ: 'Etc/UTC',
      IS_TEST: 'true',
    },
    setupFiles: ['./test/setup.ts'],
    include: ['tests/**/*.test.ts'],
    coverage: {
      include: [
        'src/**/*.js',
        'src/**/*.ts',
        'src/**/*.mjs',
        'src/**/*.vue',
        'src/**/*.jsx',
        'src/**/*.tsx',
      ],
      reporter: ['text', 'html'],
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
  },
});
