import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

declare global {
  interface Window {
    customCards?: any[];
  }
}

@customElement('cleverio-card-editor')
export class CleverioCardEditor extends LitElement {
  @property({ attribute: false }) accessor config = { sensor: '', title: '' };

  setConfig(config: { sensor: string; title: string }) {
    this.config = { ...config };
  }

  _onInput(e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    this.config = { ...this.config, [name]: value };
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this.config } }));
  }

  render() {
    return html`
      <label>Sensor:
        <input name="sensor" .value=${this.config.sensor || ''} @input=${this._onInput} /></label>
      <label>Title:
        <input name="title" .value=${this.config.title || ''} @input=${this._onInput} /></label>
    `;
  }
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "cleverio-pf100-card",
  name: "Cleverio Feeder Card",
  preview: false, 
  description: "Cleverio PF100 feeder card to decode/encode base64 meal_plan"
});