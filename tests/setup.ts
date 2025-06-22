import { beforeAll } from 'vitest';

beforeAll(() => {
  globalThis.__DEMO__ = false;
  // Expanded list of HA and common custom elements used in tests/components
  const haElements = [
    'ha-card',
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
      static get observedAttributes() { return ['data', 'columns']; }
      set data(val) {
        this._data = val;
        this._render();
      }
      get data() { return this._data; }
      set columns(val) {
        this._columns = val;
        this._render();
      }
      get columns() { return this._columns; }
      _data = [];
      _columns = {};
      connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this._render();
      }
      _render() {
        if (!this.shadowRoot) return;
        const cols = this._columns ? Object.entries(this._columns) : [];
        const rows = this._data || [];
        this.shadowRoot.innerHTML = `
          <table>
            <tr>${cols.map(([k, v]) => `<th>${typeof (v as any).title === 'string' ? (v as any).title : ''}</th>`).join('')}</tr>
            ${rows.map(row => `<tr>${cols.map(([k, v]) => {
              if (k === 'actions') {
                return `<td data-key="${k}"><ha-icon icon='mdi:pencil'></ha-icon><ha-icon icon='mdi:delete'></ha-icon></td>`;
              }
              return `<td data-key="${k}">${row[k] ?? ''}</td>`;
            }).join('')}</tr>`).join('')}
          </table>
        `;
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
