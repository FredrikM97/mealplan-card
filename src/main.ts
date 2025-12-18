import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { localize, setLanguage } from './locales/localize';
import { MealStateController } from './mealStateController';
import {
  TransportType,
  type MealPlanCardConfig,
  type HomeAssistant,
} from './types';
import { getProfileWithTransformer } from './profiles/profiles';
import { generateConfigFormSchema } from './config-form';
import './components/overview';
import './components/schedule-view';

@customElement('mealplan-card')
export class MealPlanCard extends LitElement {
  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Object }) config!: MealPlanCardConfig;
  @state() private mealState?: MealStateController;
  @state() private _dialogOpen = false;

  static get styles() {
    return css`
      :host,
      ha-card {
        display: block;
        height: 100%;
        overflow: hidden;
      }
    `;
  }

  setConfig(config: MealPlanCardConfig) {
    this.config = config;

    // Initialize controller if we have all prerequisites
    if (this.hass && this.config.sensor && this.config.manufacturer) {
      const profile = getProfileWithTransformer(this.config.manufacturer);

      if (profile) {
        this.mealState = new MealStateController(
          this,
          profile,
          this.hass,
          this.config,
        );
      }
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await setLanguage(this.hass?.language);

    // Initialize meal state controller (hass is now available)
    if (this.config?.sensor && this.config.manufacturer) {
      const profile = getProfileWithTransformer(this.config.manufacturer);

      if (profile) {
        this.mealState = new MealStateController(
          this,
          profile,
          this.hass,
          this.config,
        );
      }
    }
  }

  updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.mealState) {
      this.mealState.hass = this.hass;
      this.mealState.updateFromHass();
    }
  }

  render() {
    return html`
      <ha-card header="${this.config.title}">
        ${this.mealState
          ? html`
              <meal-overview
                .meals=${this.mealState.meals}
                .portions=${this.config?.portions}
              ></meal-overview>
              <div class="card-actions">
                <ha-button @click=${() => (this._dialogOpen = true)}>
                  <ha-icon icon="mdi:table-edit"></ha-icon>
                  ${localize('manage_schedules')}
                </ha-button>
              </div>
            `
          : html`
              <div class="card-content">
                <ha-icon icon="mdi:cog"></ha-icon>
                <p>${localize('configuration_required')}</p>
                <p>
                  Please configure a sensor and manufacturer in the card
                  settings.
                </p>
              </div>
            `}
        ${this._dialogOpen && this.mealState
          ? html`
              <schedule-view
                .mealState=${this.mealState}
                .hass=${this.hass}
                @schedule-closed=${() => {
                  this._dialogOpen = false;
                }}
              ></schedule-view>
            `
          : ''}
      </ha-card>
    `;
  }

  static getConfigForm(): ReturnType<typeof generateConfigFormSchema> {
    return generateConfigFormSchema();
  }

  static getStubConfig(): MealPlanCardConfig {
    return {
      sensor: '',
      title: 'MealPlan Card',
      helper: '',
      portions: 6,
      manufacturer: '',
      model: '',
      transport_type: TransportType.SENSOR,
    } as MealPlanCardConfig;
  }

  static getGridOptions() {
    return {
      columns: 6,
      rows: 4,
      min_columns: 6,
      min_rows: 4,
    };
  }
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'mealplan-card',
  name: 'Mealplan Card',
  preview: false,
  description: 'Mealplan card to decode/encode base64 meal_plan',
});
