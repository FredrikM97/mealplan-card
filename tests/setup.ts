import { beforeAll } from 'vitest';

beforeAll(() => {
  // Optionally set up global variables or mocks here
  globalThis.__DEMO__ = false;
  // Mock Home Assistant elements and edit-view globally for all tests
  const haElements = [
    'ha-card',
    'ha-dialog',
    'ha-button',
    'ha-textfield',
    'edit-view',
  ];
  haElements.forEach(tag => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  });
});
