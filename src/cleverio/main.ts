import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getTotalFoodPerDay, decodeMealPlanData, encodeMealPlanData, getTodaysFoodGrams } from './util/mealplan-state.js';
import type { FeedingTime } from './util/mealplan-state.js';
import './schedule';
import { loadHaComponents } from '@kipk/load-ha-components';
import { loadTranslations as loadCardTranslations, localize } from './locales/localize';
import { Day } from './util/days-util';

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
  @state() accessor _footerButtons = [];
  @state() footerButtonsTemplate = null;

  constructor() {
    super();
    this._meals = [];
    this._persistedMeals = [];
    this._dialogOpen = false;
    this._dialogData = undefined;
  }

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
    `
  ];

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
    await loadHaComponents(['ha-button', 'ha-data-table']); // Remove ha-card-header
    this._haComponentsReady = true;
    super.connectedCallback();
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
  }

  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    return html`
      <ha-card header=${this.config?.title || 'Cleverio Pet Feeder'} style="height: 100%;">
        <div class="overview-row">
          <ha-chip class="overview-schedules">
            <ha-icon icon="mdi:calendar-clock"></ha-icon>
            ${localize('schedules')}: <span style="white-space:nowrap;">${this._meals.length}</span>
          </ha-chip>
          <ha-chip class="overview-active">
            <ha-icon icon="mdi:check-circle-outline"></ha-icon>
            ${localize('active_schedules')}: <span style="white-space:nowrap;">${this._meals.filter(m => m.enabled).length}</span>
          </ha-chip>
          <ha-chip class="overview-grams">
            <ha-icon icon="mdi:food-drumstick"></ha-icon>
            ${localize('today')}: <span style="white-space:nowrap;">${getTodaysFoodGrams(this._meals.filter(m => m.enabled), new Date().getDay()) * 6}g</span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => { this._dialogOpen = true; }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${localize('manage_schedules')}
          </ha-button>
        </div>
        ${this._dialogOpen
          ? html`
              <cleverio-schedule-view
                .meals=${this._meals}
                .localize=${localize}
                @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
                @footer-buttons-changed=${this._onFooterButtonsChanged.bind(this)}
                id="scheduleView"
              ></cleverio-schedule-view>
            `
          : ''}
        <slot></slot>
      </ha-card>
    `;
  }
  static async getConfigElement() {
    await import('./card-editor');
    return document.createElement('cleverio-card-editor');
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
    this._saveMealsToSensor();
  }

  _onDialogClose() {
    this._dialogOpen = false;
  }

  _onFooterButtonsChanged(e) {
    this.footerButtonsTemplate = e.detail.template;
  }
}

function loadTranslations() {
  throw new Error('Function not implemented.');
}
