import { beforeAll } from 'vitest';

declare global {
  var __DEMO__: boolean;
  var registerDummyElement: (tag: string) => void;
}

beforeAll(() => {
  globalThis.__DEMO__ = false;
  // HA custom elements used in the app
  const haElements = [
    'ha-card',
    'ha-button',
    'ha-switch',
    'ha-icon',
    'ha-chip',
    'ha-dialog',
  ];
  haElements.forEach((tag) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  });

  // Global helper to register any custom element by tag name
  globalThis.registerDummyElement = (tag: string) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  };
});
