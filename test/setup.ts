import { beforeAll } from 'vitest';

beforeAll(() => {
  // Optionally set up global variables or mocks here
  globalThis.__DEMO__ = false;
  // You can add more global setup as needed
});
