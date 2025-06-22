import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getTotalFoodPerDay, decodeMealPlanData, encodeMealPlanData, getTodaysFoodGrams } from './util/mealplan-state.js';
import type { FeedingTime } from './util/mealplan-state.js';
import { commonCardStyle } from './common-styles.js';
import './schedule';
import { loadHaComponents } from '@kipk/load-ha-components';
import { loadTranslations as loadCardTranslations, localize } from './locales/localize';

/**
 * Cleverio PF100 Feeder Card
 */
@customElement('cleverio-pf100-card')
export class CleverioPf100Card extends LitElement {
  @property({ type: Object }) accessor hass;
  @property({ type: Object }) accessor config;
  @state() accessor _meals: FeedingTime[];
  @state() accessor _persistedMeals: FeedingTime[];
  @state() accessor _dialogOpen: boolean;
  @state() accessor _dialogData;
  @property({ type: Boolean }) private _haComponentsReady = false;

  constructor() {
    super();
    this._meals = [];
    this._persistedMeals = [];
    this._dialogOpen = false;
    this._dialogData = undefined;
  }

  static styles = [commonCardStyle, css``];

  setConfig(config) {
    this.config = config;
    this._checkConfig();
    this._updateConfig();
  }

  updated(changedProps) {
    if (changedProps.has('hass')) {
      this._updateHass();
    }
  }

 
  async connectedCallback() {
    await loadCardTranslations(); // Only loads once, even if called multiple times
    await loadHaComponents(['ha-button', 'ha-data-table']);
    this._haComponentsReady = true;
    super.connectedCallback();
    this.requestUpdate();
  }

  get _sensorID() {
    return this.config?.sensor;
  }

  get _stateObj() {
    return this.hass?.states?.[this._sensorID];
  }

  get _attributes() {
    return this._stateObj?.attributes || {};
  }

  get _name() {
    return this._attributes.friendly_name || this._sensorID;
  }

  _checkConfig() {
    if (!this.config?.sensor) {
      throw new Error('Please define a sensor!');
    }
  }

  _updateConfig() {
    this.requestUpdate();
  }

  _updateHass() {
    const stateObj = this._stateObj;
    let loadedMeals;
    if (stateObj) {
      try {
        loadedMeals = decodeMealPlanData(stateObj.state);
        if (Array.isArray(loadedMeals)) {
          this._persistedMeals = loadedMeals;
        }
      } catch (e) {
        console.error('Failed to decode meal plan:', e);
      }
    }
    if (Array.isArray(this._persistedMeals)) {
      this._meals = JSON.parse(JSON.stringify(this._persistedMeals));
    } else {
      this._persistedMeals = [];
      this._meals = [];
    }
    this.requestUpdate();
  }

  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    const enabledCount = this._meals.filter(m => m.enabled).length;
    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const dayIdx = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(todayStr);
    const gramsValue = getTodaysFoodGrams(this._meals.filter(m => m.enabled), dayIdx) * 6;
    return html`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${this.config?.title || 'Cleverio Pet Feeder'}</h2>
        <section class="overview-section">
          <div class="overview-summary" style="display: flex; gap: 0.5em; align-items: center; flex-wrap: wrap;">
            <ha-chip>
              <ha-icon icon="mdi:calendar-clock"></ha-icon>
              ${localize('schedules')}: ${this._meals.length}
            </ha-chip>
            <ha-chip>
              <ha-icon icon="mdi:check-circle-outline"></ha-icon>
              ${localize('active_schedules')}: ${enabledCount}
            </ha-chip>
            <ha-chip>
              <ha-icon icon="mdi:food-drumstick"></ha-icon>
              ${localize('today')}: ${gramsValue}g
            </ha-chip>
          </div>
          <ha-button class="manage-btn" @click=${() => { this._dialogOpen = true; this.requestUpdate(); }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${localize('manage_schedules')}
          </ha-button>
        </section>
        ${this._dialogOpen
          ? html`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedule-view
                  .meals=${this._meals}
                  .localize=${localize}
                  @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></cleverio-schedule-view>
              </ha-dialog>
            `
          : ''}
        <slot></slot>
      </ha-card>
    `;
  }

  _onDialogClose() {
    this._dialogOpen = false;
    this.requestUpdate();
  }

  _saveMealsToSensor() {
    if (!this.hass || !this._sensorID) return;
    const value = encodeMealPlanData(this._meals);
    this.hass.callService('text', 'set_value', {
      entity_id: this._sensorID,
      value,
    });
  }

  _onScheduleMealsChanged(e) {
    this._dialogOpen = false;
    this._meals = e.detail.meals;
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: e.detail.meals }, bubbles: true, composed: true }));
    this.requestUpdate();
  }

  _onMealsChanged = (e) => {
    this._meals = e.detail.meals;
    this.requestUpdate();
  }

  static async getConfigElement() {
    await import('./card-editor');
    return document.createElement('cleverio-card-editor');
  }

  static getStubConfig() {
    return { sensor: '', title: 'Cleverio Pet Feeder' };
  }

  static getCardSize(config) {
    return 2;
  }

  // Legacy methods for test compatibility
  getNextSchedule() {
    return this._meals ? (this._meals.length ? this._meals[0].time : '-') : '-';
  }

  getTotalFoodPerDay() {
    if (typeof getTotalFoodPerDay === 'function') {
      return getTotalFoodPerDay(this._meals || []);
    }
    return {};
  }
}

function loadTranslations() {
  throw new Error('Function not implemented.');
}
