import { loadHaComponents } from "@kipk/load-ha-components";
import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import { profiles } from "./profiles/profiles";
import { getProfileDropdownItems } from "./profiles/resolveProfile";
import { localize } from "./locales/localize";

declare global {
  interface Window {
    customCards?: any[];
  }
}

@customElement("mealplan-card-editor")
export class MealPlanCardEditor extends LitElement {
  @property({ attribute: false }) config: {
    sensor: string;
    title: string;
    helper: string;
    device_model?: string;
    device_manufacturer?: string;
    portions?: number;
  } = { sensor: "", title: "", helper: "" };
  @property({ attribute: false }) hass: any;
  private _haComponentsReady: boolean | undefined;

  setConfig(config: {
    sensor: string;
    title: string;
    helper: string;
    device_model?: string;
    device_manufacturer?: string;
    portions?: number;
  }) {
    this.config = { ...config };
  }

  async connectedCallback() {
    await loadHaComponents(["ha-entity-picker", "ha-form", "ha-textfield"]);
    this._haComponentsReady = true;
    super.connectedCallback();
  }

  configChanged(newConfig) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onInput(e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    this.config = { ...this.config, [name]: value };
    this.configChanged(this.config);
  }

  private _valueChanged(e: CustomEvent) {
    const target = e.target as any;
    if (target.configValue) {
      const newConfig = {
        ...this.config,
        [target.configValue]: e.detail.value,
      };
      // No more device model/profile auto-matching. Just update config with the selected value.
      this.config = newConfig;
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
      <label for="sensor-picker" style="display:block;margin-bottom:4px;"
        >Feeder entity (sensor or text)</label
      >
      <ha-entity-picker
        id="sensor-picker"
        .hass=${this.hass}
        .value=${this.config.sensor || ""}
        .configValue=${"sensor"}
        @value-changed=${this._valueChanged}
        .includeDomains=${["text", "input_text"]}
      ></ha-entity-picker>
      <div style="height: 20px;"></div>
      <label for="helper-picker" style="display:block;margin-bottom:4px;"
        >Meal plan storage helper (input_text)
        <ha-tooltip
          content="This input_text helper is used to store and sync your meal plan schedule. The card will always read and write the schedule to this helper, making it the single source of truth for your meal plan. Tip: Create a dedicated input_text helper in Home Assistant for each feeder you want to manage."
          placement="right"
        >
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
        .value=${this.config.helper || ""}
        .configValue=${"helper"}
        @value-changed=${this._valueChanged}
        .includeDomains=${["input_text"]}
      ></ha-entity-picker>
      <div style="height: 20px;"></div>
      <label for="profile-combo" style="display:block;margin-bottom:4px;"
        >Feeder profile</label
      >
      <ha-combo-box
        id="profile-combo"
        .items=${[
          { value: "", label: localize("select_layout") },
          ...getProfileDropdownItems(profiles),
        ]}
        .value=${this.config.device_manufacturer
          ? `${this.config.device_manufacturer}:${this.config.device_model || ""}`
          : ""}
        @value-changed=${(e: CustomEvent) => {
          // Store both device_manufacturer and device_model in config
          const [device_manufacturer, device_model] = (
            e.detail.value || ""
          ).split(":");
          this.config = { ...this.config, device_manufacturer, device_model };
          this.configChanged(this.config);
        }}
      ></ha-combo-box>
      <div style="height: 20px;"></div>
      <ha-textfield
        id="title"
        name="title"
        .value=${this.config.title || ""}
        @input=${this._onInput}
        .label=${this.hass?.localize?.("ui.card.config.title_label") || "Title"}
        placeholder="Title"
      ></ha-textfield>
      <ha-textfield
        id="portions"
        name="portions"
        type="number"
        min="1"
        .value=${this.config.portions ?? ""}
        @input=${this._onInput}
        .label=${this.hass?.localize?.("ui.card.config.portions_label") || "Portions"}
        placeholder="Number of portions"
      />
      <div style="height: 20px;"></div>
      ${!this._validateConfig()
        ? html`<div style="color: var(--error-color, red); margin-top: 8px;">
            Please select a feeder entity (sensor or text).
          </div>`
        : ""}
      <!-- mwc-tooltip handles its own styling -->
    `;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "mealplan-card",
  name: "Mealplan Card",
  preview: false,
  description: "Mealplan card to decode/encode base64 meal_plan",
});
