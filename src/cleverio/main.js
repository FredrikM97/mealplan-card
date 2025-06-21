import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getTotalFoodPerDay, decodeMealPlanData, encodeMealPlanData, mealsEqual } from './util/mealplan-state.js';

import './overviews.js';
import './schedule.js';
import './Edit.js';
import './CardEditor.js';

/**
 * Cleverio PF100 Feeder Card - LitElement version, modular, uses <ha-card> and slot.
 */
@customElement('cleverio-pf100-card')
export class CleverioPf100Card extends LitElement {
  @property({ type: Object }) accessor hass;
  @property({ type: Object }) accessor config;
  @state() accessor _meals = [];
  @state() accessor _persistedMeals = [];
  @state() accessor _dialogView = null; // 'schedules' | 'edit'
  @state() accessor _dialogData = undefined;

  constructor() {
    super();
    this.hass = undefined;
    this.config = undefined;
    this._meals = [];
    this._persistedMeals = [];
    this._dialogView = null;
    this._dialogData = undefined;
  }

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
    let loadedMeals = null;
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
    return html`
      <ha-card>
        <cleverio-overview-view
          .meals=${this._meals}
          .title=${this.config?.title || 'Cleverio Pet Feeder'}
          @manage-schedules=${this._onManageSchedules}
        ></cleverio-overview-view>
        <slot></slot>
        ${this._dialogView
          ? html`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose}>
                ${this._dialogView === 'schedules'
                  ? html`<cleverio-schedules-view
                      .meals=${this._meals}
                      @edit-meal=${this._onEditMeal}
                      @close-dialog=${this._onDialogClose}
                      @save=${this._onSaveSchedules}
                    ></cleverio-schedules-view>`
                  : this._dialogView === 'edit'
                  ? html`<cleverio-edit-view
                      .meal=${this._dialogData}
                      @back=${this._onEditBack}
                      @save=${this._onSaveEdit}
                    ></cleverio-edit-view>`
                  : ''}
              </ha-dialog>
            `
          : ''}
      </ha-card>
    `;
  }

  _onManageSchedules = () => {
    this._dialogView = 'schedules';
    this._dialogData = null;
  };

  _onEditMeal = (e) => {
    this._dialogView = 'edit';
    this._dialogData = e.detail.meal;
  };

  _onEditBack = () => {
    this._dialogView = 'schedules';
    this._dialogData = null;
  };

  _onDialogClose = () => {
    this._dialogView = null;
    this._dialogData = undefined;
  };

  _onSaveSchedules = (e) => {
    this._meals = e.detail.meals;
    this._saveMealsToSensor();
    this._dialogView = null;
    this._dialogData = undefined;
  };

  _onSaveEdit = (e) => {
    // Add or update meal in _meals
    const meal = e.detail.meal;
    let updated = false;
    this._meals = this._meals.map((m) => {
      if (m.time === meal.time && m.daysMask === meal.daysMask) {
        updated = true;
        return meal;
      }
      return m;
    });
    if (!updated) {
      this._meals = [...this._meals, meal];
    }
    this._saveMealsToSensor();
    this._dialogView = null;
    this._dialogData = undefined;
  };

  _saveMealsToSensor() {
    const value = encodeMealPlanData(this._meals);
    this.hass.callService('text', 'set_value', {
      entity_id: this._sensorID,
      value,
    });
    setTimeout(() => this._updateHass(), 500);
  }

  static async getConfigElement() {
    await import('./CardEditor.js');
    return document.createElement('cleverio-pf100-card-editor');
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