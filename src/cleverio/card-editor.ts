import { loadHaComponents } from '@kipk/load-ha-components';
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

declare global {
  interface Window {
    customCards?: any[];
  }
}

@customElement('cleverio-card-editor')
export class CleverioCardEditor extends LitElement {
  @property({ attribute: false }) config = { sensor: '', title: '' };
  @property({ attribute: false }) hass: any;
  private _haComponentsReady: boolean | undefined;

  setConfig(config: { sensor: string; title: string }) {
    this.config = { ...config };
  }

  async connectedCallback() {
      await loadHaComponents(['ha-entity-picker', 'ha-form', 'ha-textfield']); // Remove ha-card-header
      this._haComponentsReady = true;
      super.connectedCallback();
    }

  configChanged(newConfig) {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    }));
  }

  private _onInput(e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    this.config = { ...this.config, [name]: value };
    this.configChanged(this.config);
  }

  private _valueChanged(e: CustomEvent) {
    const target = e.target as any;
    if (target.configValue) {
      this.config = { ...this.config, [target.configValue]: e.detail.value };
      this.configChanged(this.config);
    }
  }

  private _validateConfig() {
    return !!this.config.sensor;
  }

  render() {

    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    return html`
      <label for="entity-picker" style="display:block;margin-bottom:4px;">Meal plan entity</label>
      <ha-entity-picker
        id="entity-picker"
        .hass=${this.hass}
        .value=${this.config.sensor || ''}
        .configValue=${'sensor'}
        @value-changed=${this._valueChanged}
        allow-custom-entity
      ></ha-entity-picker>
      <div style="height: 20px;"></div>
      <ha-textfield
        id="title"
        name="title"
        .value=${this.config.title || ''}
        @input=${this._onInput}
        .label=${this.hass?.localize?.('ui.card.config.title_label') || 'Title'}
        placeholder="Title"
      ></ha-textfield>
      ${!this._validateConfig()
        ? html`<div style="color: var(--error-color, red); margin-top: 8px;">Please select a sensor entity.</div>`
        : ''}
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
