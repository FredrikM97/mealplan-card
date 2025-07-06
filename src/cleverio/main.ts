import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getTotalFoodPerDay, decodeMealPlanData, encodeMealPlanData, getTodaysFoodGrams } from './util/mealplan-state.js';
import type { FeedingTime } from './util/mealplan-state.js';
import './schedule';
import { loadHaComponents } from '@kipk/load-ha-components';
import {localize, setLanguage } from './locales/localize';
import { mealplanLayouts, getLayoutByName } from './util/mealplan-layouts';

/**
 * Cleverio PF100 Feeder Card
 */
@customElement('cleverio-pf100-card')
export class CleverioPf100Card extends LitElement {
  private _hass;
  @property({ type: Object })
  get hass() {
    return this._hass;
  }
  set hass(val) {
    const old = this._hass;
    this._hass = val;
    this._updateHass();
    this.requestUpdate('hass', old);
  }
  @property({ type: Object }) accessor config;
  @state() accessor _meals: FeedingTime[];
  @state() accessor _persistedMeals: FeedingTime[];
  @state() accessor _dialogOpen: boolean = false;
  @property({ type: Boolean }) private _haComponentsReady = false;
  @state() private _decodeError: string | null = null;

  constructor() {
    super();
    this._meals = [];
    this._persistedMeals = [];
    this._dialogOpen = false;
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
    // Allow empty layout in editor, but require for normal operation
    if (!config.layout) {
      // If in editor, just set config and return
      if (window.location.pathname.includes('lovelace') && window.location.hash.includes('edit')) {
        this.config = config;
        return;
      }
      // Otherwise, show a user-friendly message in render
      this.config = config;
      return;
    }
    this.config = config;
  }

  async connectedCallback() {
    await setLanguage(this.hass.language); // Only loads once, even if called multiple times
    await loadHaComponents(['ha-button', 'ha-data-table']); // Remove ha-card-header
    this._haComponentsReady = true;
    super.connectedCallback();
  }

  get _sensorID() {
    return this.config?.sensor;
  }
  get _helperID() {
    return this.config?.helper;
  }

  get _stateObj() {
    return this.hass?.states?.[this._sensorID];
  }
  get _helperObj() {
    return this.hass?.states?.[this._helperID];
  }
  get _attributes() {
    return this._stateObj?.attributes || {};
  }
  get _name() {
    return this._attributes.friendly_name || this._sensorID;
  }

  _updateHass() {
    // Sensor is the source of new data, helper is the persistent memory and UI source
    const sensorRaw = this._stateObj?.state ?? '';
    const helperRaw = this._helperObj?.state ?? '';
    let raw = '';
    if (this._isValidSensorValue(sensorRaw)) {
      raw = sensorRaw;
      this._updateHelperIfOutOfSync(sensorRaw, helperRaw);
    } else {
      raw = helperRaw;
    }
    this._setMealsFromRaw(raw);
  }

  _isValidSensorValue(value: any): boolean {
    return (
      typeof value === 'string' &&
      value !== '' &&
      value !== 'unknown' &&
      value !== 'unavailable'
    );
  }

  _updateHelperIfOutOfSync(sensorRaw: string, helperRaw: string) {
    if (this._helperID && this.hass && sensorRaw !== helperRaw) {
      this.hass.callService('input_text', 'set_value', {
        entity_id: this._helperID,
        value: sensorRaw,
      });
    }
  }

  _setMealsFromRaw(raw: string) {
    let meals: FeedingTime[] = [];
    this._decodeError = null;
    if (!this.config?.layout) {
      this._decodeError = 'Please select a meal plan layout in the card editor.';
      this._persistedMeals = [];
      this._meals = [];
      return;
    }
    if (raw && typeof raw === 'string' && raw.trim().length > 0) {
      try {
        meals = decodeMealPlanData(raw, this.config.layout);
      } catch (err) {
        console.error('Meal plan decode error:', err);
        this._decodeError = (err as Error).message || 'Failed to decode meal plan data.';
        meals = [];
      }
    }
    this._persistedMeals = Array.isArray(meals) ? meals : [];
    this._meals = JSON.parse(JSON.stringify(this._persistedMeals));
  }

  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    if (!this.config?.layout) {
      return html`<div style="color: var(--error-color, red); margin: 8px;">Please select a meal plan layout in the card editor.</div>`;
    }
    return html`
      <ha-card header=${this.config?.title || 'Cleverio Pet Feeder'} style="height: 100%;">
        ${this._decodeError ? html`<div style="color: var(--error-color, red); margin: 8px;">${this._decodeError}</div>` : ''}
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
          <ha-chip class="overview-average">
            <ha-icon icon="mdi:scale-balance"></ha-icon>
            ${localize('avg_week')}: <span style="white-space:nowrap;">
              ${(() => {
                const totals = getTotalFoodPerDay(this._meals.filter(m => m.enabled));
                const avg = totals.reduce((a, b) => a + b, 0) / 7;
                return (avg * 6).toFixed(1);
              })()}g
            </span>
          </ha-chip>
          <ha-button class="manage-btn" @click=${() => { this._dialogOpen = true; }}>
            <ha-icon icon="mdi:table-edit"></ha-icon>
            ${localize('manage_schedules')}
          </ha-button>
        </div>
        ${this._dialogOpen
          ? html`
              <cleverio-schedule-view
                .meals=${[...this._meals]}
                .layout=${this.config.layout}
                .localize=${localize}
                .hass=${this.hass}
                @save-schedule=${this._onScheduleMealsChanged.bind(this)}
                @close-dialog=${this._onDialogClose.bind(this)}
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
    const value = encodeMealPlanData(this._meals, this.config.layout);
    this.hass.callService('text', 'set_value', {
      entity_id: this._sensorID,
      value,
    });
  }

  _onScheduleMealsChanged(e) {
    this._meals = e.detail.meals;
    this._saveMealsToSensor();
    this._dialogOpen = false;
  }

  _onDialogClose() {
    this._dialogOpen = false;
  }
}

function loadTranslations() {
  throw new Error('Function not implemented.');
}
