import { beforeAll } from 'vitest';

beforeAll(() => {
  globalThis.__DEMO__ = false;
  // Expanded list of HA and common custom elements used in tests/components
  const haElements = [
    'ha-card',
    'ha-card-header', // Add ha-card-header for tests
    'ha-dialog',
    'ha-button',
    'ha-textfield',
    'ha-switch',
    'ha-icon',
    'ha-select',
    'ha-checkbox',
    'ha-slider',
    'ha-list-item',
    'ha-formfield',
    'ha-radio',
    'ha-chip',
    'ha-alert',
    'ha-svg-icon',
    'ha-circular-progress',
    'edit-view',
  ];
  haElements.forEach(tag => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  });

  // Patch ha-data-table to render a minimal table for tests
  if (!customElements.get('ha-data-table')) {
    class DummyDataTable extends HTMLElement {
      connectedCallback() {
        const root = this.attachShadow({ mode: 'open' });
        if (root) {
          root.innerHTML = `
            <table>
              <tr><th>Time</th><th>Portion</th><th>Status</th></tr>
              <tr><td>08:00</td><td>2</td><td>enabled</td></tr>
            </table>
          `;
        }
      }
    }
    customElements.define('ha-data-table', DummyDataTable);
  }

  // Global helper to register any custom element by tag name
  globalThis.registerDummyElement = (tag) => {
    if (!customElements.get(tag)) {
      customElements.define(tag, class extends HTMLElement {});
    }
  };
});
