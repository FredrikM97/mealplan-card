import DaysUtil from './utils/days-util.js';
import * as MealUtils from './utils/mealplan-state.js';
import { mealsEqual } from './utils/mealplan-state.js';
import { renderOverviewView } from './overview.js';
import { showSchedulesView } from './schedules.js';

class CleverioPetFeederCard extends HTMLElement {
  _config;
  _hass;
  _meals = [];
  _persistedMeals = [];
  _unsaved = false;

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
    const overview = renderOverviewView({
      meals: this._meals,
      onManageSchedules: () => showSchedulesView({
        container: this.shadowRoot,
        meals: this._meals,
        onMealsChanged: updatedMeals => {
          this._meals = updatedMeals;
          this._render();
        },
        onSave: (updatedMeals) => {
          this._meals = updatedMeals;
          this._saveMealsToSensor(); // Persist to backend and refresh, will re-render after
        },
        onCancel: () => this._render()
      })
    });
    this.shadowRoot.appendChild(overview);
  }

  _saveMealsToSensor() {
    const value = MealUtils.encodeMealPlanData(this._meals);
    this._hass.callService('text', 'set_value', {
      entity_id: this.getSensorID(),
      value
    });
    // Instead of just updating local state, re-fetch from Home Assistant
    setTimeout(() => this._updateHass(), 500); // Give backend a moment to update
  }
}

customElements.define('cleverio-pf100-card', CleverioPetFeederCard);
