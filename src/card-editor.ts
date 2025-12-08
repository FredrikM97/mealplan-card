import { loadHaComponents } from '@kipk/load-ha-components';
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { profiles } from './profiles/profiles.js';
import { localize } from './locales/localize';
import type { MealPlanCardConfig, DeviceProfileGroup } from './types.js';

/**
 * Auto-detect device profile from Home Assistant device model
 */
function detectProfileFromDevice(
  deviceModel: string,
): { manufacturer: string; model: string } | null {
  const modelLower = deviceModel.toLowerCase().replace(/_/g, '');

  for (const group of profiles) {
    for (const profile of group.profiles) {
      const manufacturer = profile.manufacturer.toLowerCase();
      const models = profile.models?.map((m) => m.toLowerCase()) || [];

      const hasManufacturer = modelLower.includes(manufacturer);
      const hasModel =
        models.length === 0 || models.some((m) => modelLower.includes(m));

      if (hasManufacturer && hasModel) {
        return {
          manufacturer: profile.manufacturer,
          model: profile.models?.[0] || '',
        };
      }
    }
  }

  return null;
}

/**
 * Resolve device profile from config
 */
function resolveProfile(config: {
  device_manufacturer?: string;
  device_model?: string;
}): (DeviceProfileGroup & { manufacturer: string; model: string }) | undefined {
  const { device_manufacturer, device_model } = config || {};
  if (!device_manufacturer) return undefined;

  for (const group of profiles) {
    for (const manu of group.profiles) {
      if (manu.manufacturer === device_manufacturer) {
        const models = Array.isArray(manu.models) ? manu.models : [];
        const model = device_model ?? models[0] ?? '';
        if (!device_model || models.includes(model) || models.length === 0) {
          return { ...group, manufacturer: manu.manufacturer, model };
        }
      }
    }
  }
  return undefined;
}

/**
 * Get dropdown items for manufacturer/model selection
 */
export function getProfileDropdownItems(profileGroups: DeviceProfileGroup[]) {
  return profileGroups.flatMap((group) =>
    group.profiles.flatMap((manu) => {
      const models = Array.isArray(manu.models) ? manu.models : [];
      return (models.length ? models : ['']).map((model) => {
        const isSingle = models.length <= 1;
        const label =
          isSingle || !model
            ? manu.manufacturer
            : `${manu.manufacturer} - ${model}`;
        return {
          value: `${manu.manufacturer}:${model}`,
          label,
        };
      });
    }),
  );
}

declare global {
  interface Window {
    customCards?: any[];
  }
}

@customElement('mealplan-card-editor')
export class MealPlanCardEditor extends LitElement {
  @property({ attribute: false }) config: MealPlanCardConfig = {
    sensor: '',
    title: '',
    helper: '',
  };
  @property({ attribute: false }) hass: any;
  private _haComponentsReady: boolean | undefined;

  setConfig(config: MealPlanCardConfig) {
    this.config = { ...config };
  }

  async connectedCallback() {
    super.connectedCallback();
    await loadHaComponents(['ha-entity-picker', 'ha-form', 'ha-textfield']);
    this._haComponentsReady = true;
  }

  configChanged(newConfig) {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
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

  private async _valueChanged(e: CustomEvent) {
    const target = e.target as any;
    if (target.configValue) {
      const newConfig = {
        ...this.config,
        [target.configValue]: e.detail.value,
      };

      this.config = newConfig;

      // Auto-detect device info when sensor is selected, but only if manufacturer not already set
      if (
        target.configValue === 'sensor' &&
        e.detail.value &&
        !this.config.device_manufacturer
      ) {
        // Wait for auto-detection to complete before firing config-changed
        await this._fetchDeviceInfo(e.detail.value);
      }

      // Fire config-changed once with all updates
      this.configChanged(this.config);
    }
  }

  private async _fetchDeviceInfo(entityId: string) {
    try {
      const entityInfo = this.hass.entities?.[entityId];
      if (!entityInfo?.device_id) return;

      const device = this.hass.devices?.[entityInfo.device_id];
      if (!device?.model) return;

      const detected = detectProfileFromDevice(device.model);
      if (detected) {
        this.config = {
          ...this.config,
          device_manufacturer: detected.manufacturer,
          device_model: detected.model,
        };
      }
    } catch (err) {
      console.error('Failed to auto-detect device:', err);
    }
  }

  private _validateConfig() {
    return !!this.config.sensor;
  }

  private _onProfileChanged(e: CustomEvent) {
    // Store both device_manufacturer and device_model in config
    const [device_manufacturer, device_model] = (e.detail.value || '').split(
      ':',
    );
    const newConfig = { ...this.config, device_manufacturer, device_model };

    // Resolve and store profile
    if (device_manufacturer) {
      const profile = resolveProfile(newConfig);
      if (profile?.encodingTemplate) {
        newConfig._profile = profile;
      } else {
        console.warn('Invalid or unsupported profile:', newConfig);
        newConfig._profile = undefined;
      }
    } else {
      newConfig._profile = undefined;
    }

    this.config = newConfig;
    this.configChanged(this.config);
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
        .value=${this.config.sensor || ''}
        .configValue=${'sensor'}
        @value-changed=${this._valueChanged}
        .includeDomains=${['text', 'input_text']}
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
        .value=${this.config.helper || ''}
        .configValue=${'helper'}
        @value-changed=${this._valueChanged}
        .includeDomains=${['input_text']}
      ></ha-entity-picker>
      <div style="height: 20px;"></div>
      <label for="profile-combo" style="display:block;margin-bottom:4px;"
        >Feeder profile</label
      >
      <ha-combo-box
        id="profile-combo"
        .items=${[
          { value: '', label: localize('select_layout') },
          ...getProfileDropdownItems(profiles),
        ]}
        .value=${this.config.device_manufacturer
          ? `${this.config.device_manufacturer}:${this.config.device_model || ''}`
          : ''}
        @value-changed=${this._onProfileChanged}
      ></ha-combo-box>
      <div style="height: 20px;"></div>
      <ha-textfield
        id="title"
        name="title"
        .value=${this.config.title || ''}
        @input=${this._onInput}
        .label=${this.hass?.localize?.('ui.card.config.title_label') || 'Title'}
        placeholder="Title"
      ></ha-textfield>
      <ha-textfield
        id="portions"
        name="portions"
        type="number"
        min="1"
        .value=${this.config.portions ?? ''}
        @input=${this._onInput}
        .label=${this.hass?.localize?.('ui.card.config.portions_label') ||
        'Portions'}
        placeholder="Number of portions"
      />
      <div style="height: 20px;"></div>
      ${!this._validateConfig()
        ? html`<div style="color: var(--error-color, red); margin-top: 8px;">
            Please select a feeder entity (sensor or text).
          </div>`
        : ''}
      <!-- mwc-tooltip handles its own styling -->
    `;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'mealplan-card',
  name: 'Mealplan Card',
  preview: false,
  description: 'Mealplan card to decode/encode base64 meal_plan',
});
