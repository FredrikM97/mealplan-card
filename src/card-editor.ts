import { LitElement, html, css } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { profiles } from './profiles/profiles.js';
import { localize } from './locales/localize';
import type {
  MealPlanCardConfig,
  DeviceProfileGroup,
  DeviceProfile,
} from './types.js';
import { isValidProfile } from './types.js';
import {
  EVENT_CLEAR_MESSAGE,
  MealMessageEvent,
  ConfigChangedEvent,
  MESSAGE_TYPE_INFO,
  MESSAGE_TYPE_ERROR,
} from './constants.js';
import './components/message-display.js';

/**
 * Resolve device profile from manufacturer and model
 */
function resolveProfile(
  manufacturer: string,
  model?: string,
): (DeviceProfileGroup & { selectedProfile: DeviceProfile }) | undefined {
  if (!manufacturer) return undefined;

  for (const group of profiles) {
    for (const manu of group.profiles) {
      if (manu.manufacturer === manufacturer) {
        const models = Array.isArray(manu.models) ? manu.models : [];
        const selectedModel = model ?? models[0] ?? '';
        if (!model || models.includes(selectedModel) || models.length === 0) {
          return {
            ...group,
            selectedProfile: {
              manufacturer: manu.manufacturer,
              models: [selectedModel],
              default: manu.default,
            },
          };
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
  @property({ attribute: false }) config!: MealPlanCardConfig;
  @property({ attribute: false }) hass: any;
  @state() private _lastHintMessage: string | null = null;

  setConfig(config: MealPlanCardConfig) {
    this.config = { ...config };
    this._showConfigHints();
  }

  private _showConfigHints() {
    let currentMessage: string | null = null;

    // Determine what message should be shown
    if (!this.config?.sensor) {
      currentMessage = 'Please configure a sensor entity to get started.';
    } else if (!this.config?.profile) {
      currentMessage = 'Please select a feeder profile to continue.';
    }

    // Only dispatch if message changed
    if (currentMessage !== this._lastHintMessage) {
      if (currentMessage) {
        this._dispatchInfo(currentMessage);
      } else {
        // Clear when config becomes valid
        this.dispatchEvent(
          new CustomEvent(EVENT_CLEAR_MESSAGE, {
            bubbles: true,
            composed: true,
          }),
        );
      }
      this._lastHintMessage = currentMessage;
    }
  }

  private _dispatchInfo(message: string): void {
    this.dispatchEvent(new MealMessageEvent(message, MESSAGE_TYPE_INFO));
  }

  configChanged(newConfig) {
    this.dispatchEvent(new ConfigChangedEvent(newConfig));
    this._showConfigHints();
  }

  private _onInput(e: Event) {
    const { name, value } = e.target as HTMLInputElement;
    this.config = { ...this.config, [name]: value };
    this.configChanged(this.config);
  }

  private async _valueChanged(e: CustomEvent) {
    const target = e.target as any;
    if (target.configValue) {
      this.config = {
        ...this.config,
        [target.configValue]: e.detail.value,
      };
      this.configChanged(this.config);
    }
  }

  private _dispatchError(message: string): void {
    this.dispatchEvent(new MealMessageEvent(message, MESSAGE_TYPE_ERROR));
  }

  private _onProfileChanged(e: CustomEvent<{ value: string }>) {
    // Clear profile when user selects empty option
    if (!e.detail.value) {
      delete this.config.profile;
      this.configChanged(this.config);
      return;
    }

    const [device_manufacturer, device_model] = e.detail.value.split(':');
    const profile = resolveProfile(device_manufacturer, device_model);

    if (!isValidProfile(profile)) {
      this._dispatchError(
        `Invalid or unsupported profile: ${device_manufacturer}`,
      );
      return;
    }

    this.config = {
      ...this.config,
      profile,
    };
    this.configChanged(this.config);
  }

  render() {
    if (!this.config) {
      return html``;
    }

    const profileItems = getProfileDropdownItems(profiles);
    return html`
      <meal-message-display></meal-message-display>
      <label for="sensor-picker" style="display:block;margin-bottom:4px;"
        >Feeder entity (sensor or text)</label
      >
      <ha-entity-picker
        id="sensor-picker"
        .hass=${this.hass}
        .value=${this.config.sensor}
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
        .value=${this.config.helper}
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
          ...profileItems,
        ]}
        .value=${this.config.profile?.selectedProfile
          ? `${this.config.profile.selectedProfile.manufacturer}:${this.config.profile.selectedProfile.models?.[0] ?? ''}`
          : ''}
        @value-changed=${this._onProfileChanged}
      ></ha-combo-box>
      <div style="height: 20px;"></div>
      <ha-textfield
        id="title"
        name="title"
        .value=${this.config.title}
        @input=${this._onInput}
        .label=${this.hass?.localize?.('ui.card.config.title_label') || 'Title'}
        placeholder="Title"
      ></ha-textfield>
      <ha-textfield
        id="portions"
        name="portions"
        type="number"
        min="1"
        .value=${this.config.portions}
        @input=${this._onInput}
        .label=${this.hass?.localize?.('ui.card.config.portions_label') ||
        'Portions'}
        placeholder="Number of portions"
      />
      <div style="height: 20px;"></div>
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
