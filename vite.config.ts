import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    outDir: 'www/cleverio-pf100-feeder-card',
    lib: {
      entry: 'dist/cleverio/main.js',
      name: 'CleverioPf100FeederCard',
      fileName: 'cleverio-pf100-feeder-card'
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  },
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
        'src/**/*.ts'
      ],
      reporter: ['text', 'html'],
      provider: 'v8',
      reportsDirectory: 'coverage'
    }
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});