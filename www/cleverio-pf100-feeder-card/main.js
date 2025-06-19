import { getNextSchedule, getTotalFoodPerDay } from './utils/mealplan-state.js';
import DaysUtil from './utils/days-util.js';
import * as MealUtils from './utils/mealplan-state.js';
import { mealsEqual } from './utils/mealplan-state.js';
import './overview.js';
import './schedules.js';
import './edit.js';
import './cleverio-pf100-card-editor.js';

class CleverioPetFeederCard extends HTMLElement {
  _config;
  _hass;
  _meals = [];
  _persistedMeals = [];
  _unsaved = false;
  _overlayView = null; // 'schedules' or null

  constructor() {
    super();
    this._meals = [];
    this._persistedMeals = [];
    this._unsaved = false;
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    this._config = config;
    this._checkConfig();
    this._updateConfig();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateHass();
  }

  getSensorID() {
    return this._config?.sensor;
  }

  getState() {
    if (!this._hass || !this._config) return undefined;
    return this._hass.states?.[this.getSensorID()];
  }

  getAttributes() {
    return this.getState()?.attributes || {};
  }

  getName() {
    return this.getAttributes().friendly_name || this.getSensorID();
  }

  _checkConfig() {
    if (!this._config?.sensor) {
      throw new Error('Please define a sensor!');
    }
  }

  _updateConfig() {
    this._render();
  }

  _updateHass() {
    const stateObj = this.getState();
    let loadedMeals = null;
    if (stateObj) {
      try {
        loadedMeals = MealUtils.decodeMealPlanData(stateObj.state);
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
    this._render();
  }

  _render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = '';
    // Render overview
    const overview = document.createElement('cleverio-overview-view');
    overview.meals = this._meals;
    overview.title = this._config?.title || 'Cleverio Pet Feeder';
    overview.addEventListener('manage-schedules', () => {
      this._showSchedulesDialog();
    });
    this.shadowRoot.appendChild(overview);
    // If overlay is active, render it
    if (this._overlayView === 'schedules') {
      this._renderSchedulesDialog();
    }
  }

  _showSchedulesDialog() {
    this._overlayView = 'schedules';
    this._render();
  }

  _closeOverlay() {
    this._overlayView = null;
    this._render();
  }

  _renderSchedulesDialog() {
    // Remove any existing dialog
    const oldDialog = this.shadowRoot.querySelector('cleverio-schedules-dialog');
    if (oldDialog) oldDialog.remove();
    const dialog = document.createElement('cleverio-schedules-dialog');
    dialog.meals = this._meals;
    dialog.addEventListener('close-dialog', () => this._closeOverlay());
    dialog.addEventListener('save', e => {
      this._meals = e.detail.meals;
      this._saveMealsToSensor();
      this._closeOverlay();
    });
    this.shadowRoot.appendChild(dialog);
  }

  _saveMealsToSensor() {
    const value = MealUtils.encodeMealPlanData(this._meals);
    this._hass.callService('text', 'set_value', {
      entity_id: this.getSensorID(),
      value
    });
    setTimeout(() => this._updateHass(), 500);
  }

  getNextSchedule() {
    return getNextSchedule(this.feedingTimes || this._meals || []);
  }

  getTotalFoodPerDay() {
    return getTotalFoodPerDay(this.feedingTimes || this._meals || []);
  }

  static async getConfigElement() {
    await import('./cleverio-pf100-card-editor.js');
    return document.createElement('cleverio-pf100-card-editor');
  }

  static getStubConfig() {
    return { sensor: '', title: 'Cleverio Pet Feeder' };
  }

  static getCardSize(config) {
    // Default grid size: 2x2 (width x height)
    return 2;
  }
}

customElements.define('cleverio-pf100-card', CleverioPetFeederCard);
