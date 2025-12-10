import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadHaComponents } from '@kipk/load-ha-components';
import { localize, setLanguage } from './locales/localize';
import { MealStateController } from './mealStateController';
import type { MealPlanCardConfig } from './types';
import './components/overview';
import './components/schedule-view';
import './components/message-display';

const BUILD_TIME = new Date().toISOString();

@customElement('mealplan-card')
export class MealPlanCard extends LitElement {
  @property({ type: Object }) hass: any;
  @property({ type: Object }) config!: MealPlanCardConfig;
  @state() private mealState?: MealStateController;
  @state() private _dialogOpen = false;
  @state() private _haComponentsReady = false;

  setConfig(config: MealPlanCardConfig) {
    this.config = config;
  }

  async connectedCallback() {
    super.connectedCallback();
    console.log(`[MealPlan Card] Build time: ${BUILD_TIME}`);
    await setLanguage(this.hass?.language);
    await loadHaComponents([
      'ha-button',
      'ha-data-table',
      'ha-dialog',
      'ha-entity-picker',
      'ha-combo-box',
    ]);
    this._haComponentsReady = true;

    // Initialize controller if we have all required config
    if (this.config?.sensor && this.config?.profile && !this.mealState) {
      this.mealState = new MealStateController(
        this,
        this.config.sensor,
        this.config.profile,
        this.hass,
        this.config.helper,
      );
    } else if (this.mealState && this.hass) {
      // Update hass if it wasn't available during construction
      this.mealState.hass = this.hass;
      this.mealState.updateFromHass();
    }
  }

  render() {
    if (!this._haComponentsReady) {
      return html``;
    }

    return html`
      <ha-card
        header="${this.config?.title || 'MealPlan Card'}"
        style="height: 100%;"
      >
        <meal-message-display></meal-message-display>
        ${this.mealState
          ? html`
              <meal-overview
                .meals=${this.mealState.meals}
                .portions=${this.config?.portions}
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
