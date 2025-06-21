import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * Minimal stub for the Lovelace card editor to avoid import errors.
 * Replace with full editor implementation as needed.
 */
export class CleverioPf100CardEditor extends LitElement {
  @property({ type: Object }) config = { sensor: '', title: '' };

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
