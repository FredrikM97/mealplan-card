import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    lib: {
      entry: 'src/main.ts',
      name: 'MealPlanCard',
      fileName: 'mealplan-card',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
  },
  test: {
    environment: 'jsdom',
    env: {
      TZ: 'Etc/UTC',
      IS_TEST: 'true',
    },
    setupFiles: ['./tests/setup.ts'],
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
      reporter: ['text', 'html', 'lcov'],
      provider: 'v8',
      reportsDirectory: 'coverage',
    },
  },
});
