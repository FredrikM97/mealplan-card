
import { loadHaComponents } from '@kipk/load-ha-components';
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { mealplanLayouts } from './util/mealplan-layouts';

declare global {
  interface Window {
    customCards?: any[];
  }
}

@customElement('cleverio-card-editor')
export class CleverioCardEditor extends LitElement {
  @property({ attribute: false }) config: {
    sensor: string;
    title: string;
    helper: string;
    layout?: string;
    overviewFields?: string[];
  } = { sensor: '', title: '', helper: '', layout: '', overviewFields: ['schedules', 'active_schedules', 'today', 'avg_week'] };
  @property({ attribute: false }) hass: any;
  private _haComponentsReady: boolean | undefined;

  setConfig(config: { sensor: string; title: string; helper: string; layout?: string; overviewFields?: string[] }) {
    this.config = { ...config };
 
  }

  async connectedCallback() {
      await loadHaComponents(['ha-entity-picker', 'ha-form', 'ha-textfield']);
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
    return !!this.config.sensor && !!this.config.helper;
  }

  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    return html`
      <label for="layout-combo" style="display:block;margin-bottom:4px;">Meal plan layout</label>
      <ha-combo-box
        id="layout-combo"
        .items=${mealplanLayouts.map((l) => ({ value: l.name, label: l.name }))}
        .value=${this.config.layout || ""}
        @value-changed=${(e) => {
          this.config = { ...this.config, layout: e.detail.value };
          this.configChanged(this.config);
        }}
      ></ha-combo-box>
      <div style="height: 20px;"></div>
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
      <label for="helper-picker" style="display:block;margin-bottom:4px;">Meal plan storage helper (input_text)
        <ha-tooltip content="This input_text helper is used to store and sync your meal plan schedule. The card will always read and write the schedule to this helper, making it the single source of truth for your meal plan. Tip: Create a dedicated input_text helper in Home Assistant for each feeder you want to manage." placement="right">
          <ha-icon
            icon="mdi:information-outline"
            style="font-size:1.1em;color:var(--secondary-text-color,#666);margin-left:4px;vertical-align:middle;cursor:pointer;"
            tabindex="0"
          ></ha-icon>
        </ha-tooltip>
      </label>
      <ha-entity-picker
        id="helper-picker"
        .hass=${this.hass}
        .value=${this.config.helper || ''}
        .configValue=${'helper'}
        @value-changed=${this._valueChanged}
        .includeDomains=${['input_text']}
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
      <div style="height: 20px;"></div>
      ${!this._validateConfig()
        ? html`<div style="color: var(--error-color, red); margin-top: 8px;">Please select a sensor entity and a storage helper (input_text).` : ''}
      <!-- mwc-tooltip handles its own styling -->
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
