import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  files: 'tests/**/*.test.ts',
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' })
  ],
  testFramework: {
    config: {
      timeout: 10000
    }
  },
  coverage: true
};
