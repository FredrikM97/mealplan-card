import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadHaComponents } from '@kipk/load-ha-components';
import { localize, setLanguage } from './locales/localize';
import { MealStateController } from './mealStateController';
import { profiles } from './profiles/profiles.js';
import type { MealPlanCardConfig, DeviceProfileGroup } from './types.js';
import './components/overview.js';
import './components/schedule-view.js';

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

@customElement('mealplan-card')
export class MealPlanCard extends LitElement {
  private mealState!: MealStateController;

  @property({ type: Object }) hass: any;
  @state() private _dialogOpen = false;
  @property({ type: Boolean }) private _haComponentsReady = false;

  @property({ type: Object })
  set config(val: MealPlanCardConfig) {
    const oldSensor = this._config?.sensor;

    let profile = val?._profile;
    if (val?.device_manufacturer && !profile) {
      profile = resolveProfile(val);
    }

    this._config = profile ? { ...val, _profile: profile } : val;

    if (
      this._config?.sensor &&
      profile &&
      (!this.mealState || oldSensor !== this._config.sensor)
    ) {
      this.mealState = new MealStateController(
        this,
        this._config.sensor,
        profile,
        this._config.helper,
      );

      if (this.hass) {
        this.mealState.setHass(this.hass);
        this.mealState.updateFromHass();
      }
    }
  }
  get config(): MealPlanCardConfig {
    return this._config;
  }
  private _config!: MealPlanCardConfig;

  static styles = [
    css`
      .overview-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin: 0 16px 8px 16px;
        box-sizing: border-box;
        padding-right: 8px;
      }
      @media (max-width: 600px) {
        .overview-row {
          flex-direction: column;
          gap: 4px;
          margin: 0 4px 8px 4px;
        }
      }
      .error-message {
        color: var(--error-color, red);
        margin: 16px;
      }
    `,
  ];

  setConfig(config: MealPlanCardConfig) {
    this.config = config;
  }

  async connectedCallback() {
    super.connectedCallback();
    await setLanguage(this.hass?.language);
    await loadHaComponents(['ha-button', 'ha-data-table', 'ha-dialog']);
    this._haComponentsReady = true;
  }

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('hass') && this.mealState && this.hass) {
      this.mealState.setHass(this.hass);

      if (this._config?.sensor) {
        const oldHass = changedProperties.get('hass') as any;
        const oldState = oldHass?.states?.[this._config.sensor]?.state;
        const newState = this.hass.states?.[this._config.sensor]?.state;

        if (!oldHass || oldState !== newState) {
          const allowUpdate = !oldHass;
          this.mealState.updateFromHass(allowUpdate);
        }
      }
    }
  }

  private getConfigError(): string | null {
    if (!this._config) return 'No configuration provided';
    if (!this._config.sensor) return 'Please configure a sensor entity';
    if (!this._config.device_manufacturer)
      return 'Please select a device manufacturer in card settings';
    return null;
  }

  private renderError(): TemplateResult | string {
    const configError = this.getConfigError();
    if (configError) {
      return html`<div class="error-message">${configError}</div>`;
    }

    const decodeError = this.mealState?.getDecodeError();
    if (decodeError) {
      return html`<div class="error-message" style="margin: 8px;">
        ${decodeError}
      </div>`;
    }

    return '';
  }

  private handleScheduleClosed() {
    this._dialogOpen = false;
  }

  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }

    return html`
      <ha-card
        header=${this.config?.title || 'MealPlan Card'}
        style="height: 100%;"
      >
        ${this.renderError()}
        ${this.mealState
          ? html`
              <meal-overview
                .meals=${this.mealState.getMeals()}
                .portions=${this.config?.portions || 6}
              ></meal-overview>
              <div
                class="card-actions"
                style="display: flex; justify-content: flex-end; padding: 8px 16px; gap: 8px;"
              >
                <ha-button @click=${() => (this._dialogOpen = true)}>
                  <ha-icon icon="mdi:table-edit"></ha-icon>
                  ${localize('manage_schedules')}
                </ha-button>
              </div>
            `
          : ''}
        <slot></slot>
        ${this._dialogOpen && this._config?._profile && this.mealState
          ? html`
              <schedule-view
                .mealState=${this.mealState}
                .meals=${this.mealState.getMeals()}
                .profile=${this._config._profile}
                .hass=${this.hass}
                @schedule-closed=${this.handleScheduleClosed}
              ></schedule-view>
            `
          : ''}
      </ha-card>
    `;
  }

  static async getConfigElement() {
    await import('./card-editor.js');
    return document.createElement('mealplan-card-editor');
  }

  static getStubConfig() {
    return {
      sensor: '',
      title: 'MealPlan Card',
      helper: '',
      portions: 6,
    };
  }
}
