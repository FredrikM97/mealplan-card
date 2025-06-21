import { LitElement, html, css } from 'lit';

/**
 * Minimal stub for the Lovelace card editor to avoid import errors.
 * Replace with full editor implementation as needed.
 */
export class CleverioPf100CardEditor extends LitElement {
  static properties = {
    config: { type: Object },
  };

  constructor() {
    super();
    this.config = { sensor: '', title: '' };
  }

  setConfig(config) {
    this.config = { ...config };
  }

  _onInput(e) {
    const { name, value } = e.target;
    this.config = { ...this.config, [name]: value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
  }

  render() {
    return html`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ''} @input=${this._onInput} />
      </label>
      <label>Title:
        <input name="title" .value=${this.config.title || ''} @input=${this._onInput} />
      </label>
    `;
  }
}

customElements.define('cleverio-pf100-card-editor', CleverioPf100CardEditor);

// ...will move and refactor config editor code here...
