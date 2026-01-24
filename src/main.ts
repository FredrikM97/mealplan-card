import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { localize, setLanguage } from './locales/localize';
import { MealStateController } from './mealStateController';
import type { HomeAssistant, MealPlanCardConfig } from './types';
import { TransportType, isValidCardConfig } from './types';
import { getProfileWithTransformer } from './profiles/profiles';
import { generateConfigFormSchema } from './config-form';
import './components/overview';
import './components/schedule-view';
import { log } from './logger';
import { getVersionString } from './version';

@customElement('mealplan-card')
export class MealPlanCard extends LitElement {
  @property({ type: Object }) hass!: HomeAssistant;
  @property({ type: Object }) config!: MealPlanCardConfig;
  @state() public mealState?: MealStateController;
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
    if (
      this.hass &&
      isValidCardConfig(this.config) &&
      this.config.manufacturer
    ) {
      const profile = getProfileWithTransformer(this.config.manufacturer);

      if (profile) {
        this.mealState = new MealStateController(
          this,
          profile,
          () => this.hass,
          this.config,
        );
      }
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await setLanguage(this.hass?.language);

    // Initialize meal state controller (hass is now available)
    if (isValidCardConfig(this.config) && this.config.manufacturer) {
      const profile = getProfileWithTransformer(this.config.manufacturer);

      if (profile) {
        this.mealState = new MealStateController(
          this,
          profile,
          () => this.hass,
          this.config,
        );
      }
    }
  }

  updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    if (changedProps.has('hass') && this.mealState) {
      setLanguage(this.hass?.language);

      this.mealState.updateFromHass().catch((error) => {
        log.error('[MealPlanCard] Failed to update from hass:', error);
      });
    }
  }

  render() {
    log.info(`MealPlan Card ${getVersionString()}`);

    return html`
      <ha-card header="${this.config.title}">
        ${this.renderContent()} ${this.renderScheduleDialog()}
      </ha-card>
    `;
  }

  private renderContent() {
    if (!this.mealState) {
      return this.renderConfigurationRequired();
    }

    return html`
      <meal-overview
        .meals=${this.mealState.meals}
        .portions=${this.config?.portions}
      ></meal-overview>
      <div class="card-actions">
        <ha-button @click=${() => (this._dialogOpen = true)}>
          <ha-icon icon="mdi:table-edit"></ha-icon>
          ${localize('main.manage_schedules')}
        </ha-button>
      </div>
    `;
  }

  private renderConfigurationRequired() {
    return html`
      <div class="card-content">
        <ha-icon icon="mdi:cog"></ha-icon>
        <p>${localize('main.configuration_required')}</p>
        <p>${localize('main.configuration_instructions')}</p>
      </div>
    `;
  }

  private renderScheduleDialog() {
    if (!this._dialogOpen || !this.mealState) {
      return '';
    }

    return html`
      <schedule-view
        .mealState=${this.mealState}
        .hass=${this.hass}
        @schedule-closed=${() => {
          this._dialogOpen = false;
        }}
      ></schedule-view>
    `;
  }

  static getConfigForm(): ReturnType<typeof generateConfigFormSchema> {
    return generateConfigFormSchema();
  }

  static getStubConfig(): MealPlanCardConfig {
    return {
      title: 'MealPlan Card',
      portions: 6,
      manufacturer: '',
      model: '',
      sensor: '',
      helper: '',
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
