import DaysUtil from './utils/days-util.js';
import * as MealUtils from './utils/mealplan-state.js';
import { mealsEqual } from './utils/mealplan-state.js';

class CleverioPetFeederCard extends HTMLElement {
  _config;
  _hass;
  _elements = {};

  constructor() {
    super();
    this._elements = {};
    this._meals = [];
    this._persistedMeals = [];
    this._unsaved = false;
    console.log('[cleverio-pf100-card] constructor called');
    this._initCard();
    this._initStyle();
    this._attach();
  }

  connectedCallback() {
    console.log('[cleverio-pf100-card] connectedCallback');
    this._queryElements();
    // Only call _listen if all elements are present, or if not in test (jsdom)
    try {
      this._listen();
    } catch (e) {
      if (!(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('jsdom'))) {
        console.error('[cleverio-pf100-card] Error in _listen:', e);
        throw e;
      }
      // swallow in test
    }
  }

  setConfig(config) {
    this._config = config;
    console.log('[cleverio-pf100-card] setConfig', config);
    this._checkConfig();
    this._updateConfig();
  }

  set hass(hass) {
    this._hass = hass;
    console.log('[cleverio-pf100-card] set hass', hass);
    this._updateHass();
  }

  // Accessors
  getSensorID() {
    return this._config.sensor;
  }

  getState() {
    return this._hass.states[this.getSensorID()];
  }

  getAttributes() {
    return this.getState()?.attributes || {};
  }

  getName() {
    return this.getAttributes().friendly_name || this.getSensorID();
  }

  // Card setup
  _checkConfig() {
    if (!this._config.sensor) {
      throw new Error("Please define a sensor!");
    }
  }

  _initCard() {
    this._elements.card = document.createElement("ha-card");
    this._elements.card.innerHTML = `
      <div class="card-content">
        <p class="error error hidden"></p>
        <div class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules"></span>
            <span class="overview-active"></span>
          </div>
          <div class="overview-grams"></div>
          <button class="manage-btn button">Manage schedules</button>
        </div>
        <dialog class="edit-dialog">
          <ha-card class="popup-card">
            <div class="popup-table-section">
              <h3>Scheduled Meals</h3>
              <table class="popup-meal-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Portion</th>
                    <th>Days</th>
                    <th>Enabled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody class="popup-meal-table-body"></tbody>
              </table>
              <div class="empty-table-row" style="display:none;text-align:center;color:#888;">No schedules yet</div>
              <button class="add-schema-btn button">Add schedule</button>
              <div class="popup-actions-row">
                <button type="button" class="cancel-list-btn button">Cancel</button>
                <button class="save-schemas-btn button">Save</button>
              </div>
            </div>
            <form method="dialog" class="edit-form" style="display:none;">
              <h3 style="margin-top:0;">Edit Meal</h3>
              <div class="edit-fields-row">
                <label>Time: <input class="edit-time" type="time" required></label>
                <label>Portion: <input class="edit-portion" type="number" min="1" required style="width:4em;"> <span class="portion-helper">(1 portion = 6g)</span></label>
              </div>
              <div class="suggested-times-row">
                <span>Suggested:</span>
                <button type="button" class="suggested-time-btn button" data-time="07:00">07:00</button>
                <button type="button" class="suggested-time-btn button" data-time="12:00">12:00</button>
                <button type="button" class="suggested-time-btn button" data-time="18:00">18:00</button>
              </div>
              <div class="edit-days-row">
                ${[
                  {abbr: 'Mo', full: 'Monday'},
                  {abbr: 'Tu', full: 'Tuesday'},
                  {abbr: 'We', full: 'Wednesday'},
                  {abbr: 'Th', full: 'Thursday'},
                  {abbr: 'Fr', full: 'Friday'},
                  {abbr: 'Sa', full: 'Saturday'},
                  {abbr: 'Su', full: 'Sunday'}
                ].map((d, i) =>
                  `<button type="button" class="day-btn button" data-day="${i}" aria-label="${d.full}" title="${d.full}">${d.abbr}<span class="day-check" aria-hidden="true"></span></button>`).join('')}
              </div>
              <div class="edit-divider"></div>
              <menu>
                <button type="button" class="button back-to-list-btn">Back</button>
                <button value="save" class="button">Save</button>
              </menu>
            </form>
          </ha-card>
        </dialog>
      </div>
    `;
  }

  _initStyle() {
    this._elements.style = document.createElement("style");
    this._elements.style.textContent = `
      .error { color: red; }
      .error.hidden { display: none; }
      .overview-section { margin-bottom: 1em; }
      .overview-summary { display: flex; flex-direction: row; gap: 1.5em; margin-bottom: 0.2em; align-items: baseline; }
      .overview-grams { margin-bottom: 1em; font-weight: bold; }
      .button, .manage-btn, .add-schema-btn, .edit-row-btn, .delete-row-btn, .cancel-btn, .day-btn, .suggested-time-btn {
        border-radius: 8px; background: var(--primary-color, #03a9f4); color: #fff; border: none; padding: 0.5em 1em; cursor: pointer; margin-bottom: 0.5em; font-weight: bold;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      }
      .edit-divider { border-top: 1px solid #eee; margin: 1em 0; }
      .portion-helper { color: #888; font-size: 0.9em; margin-left: 0.5em; }
      .clear-btn { background: #bbb; color: #222; margin-left: 1em; }
      .clear-btn:hover { background: #e53935; color: #fff; }
      .popup-card {
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        border-radius: 8px;
        padding: 1em;
        background: var(--ha-card-background, var(--card-background-color, #fff)) !important;
        color: var(--primary-text-color, var(--primary-text-color, #222)) !important;
      }
      .edit-form {
        background: transparent !important;
        color: inherit !important;
      }
      .popup-table-section {
        background: transparent !important;
      }
      @media (prefers-color-scheme: dark) {
        .popup-card {
          background: var(--ha-card-background, #222) !important;
          color: var(--primary-text-color, #fff) !important;
        }
      }
      .edit-dialog {
        background: transparent !important;
      }
      .edit-dialog[open] {
        background: transparent !important;
      }
      .edit-dialog::backdrop {
        background: rgba(0,0,0,0.2) !important;
      }
      @media (prefers-color-scheme: dark) {
        .popup-card {
          background: #222 !important;
          color: #fff !important;
        }
      }
      .edit-dialog { border: none; border-radius: 8px; padding: 0; }
      .edit-dialog[open] { display: block; }
      .edit-dialog menu { display: flex; gap: 1em; justify-content: flex-end; margin-top: 1em; }
      .edit-days-row { display: flex; gap: 0.5em; justify-content: center; margin-bottom: 1em; }
      .day-btn {
        width: 2.5em; height: 2.5em; border-radius: 50%; border: 2px solid #888; background: #eee; color: #333; font-weight: bold; cursor: pointer; outline: none;
        display: flex; align-items: center; justify-content: center; font-size: 1em;
        transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
        margin-bottom: 0; position: relative;
      }
      .day-btn.selected {
        background: var(--primary-color, #03a9f4); color: #fff; border-color: var(--primary-color, #03a9f4); box-shadow: 0 0 0 2px #2196f344;
      }
      .day-btn.selected .day-check {
        content: "\\2713";
        display: inline-block;
        color: #fff;
        font-size: 1.1em;
        position: absolute;
        right: 0.3em;
        top: 0.2em;
      }
      .day-check { display: none; }
      .day-btn.selected .day-check { display: inline; }
      .popup-table-section { margin-bottom: 1em; }
      .popup-meal-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 1em; background: none; }
      .popup-meal-table th, .popup-meal-table td { border: none; padding: 0.3em 0.5em; text-align: center; }
      .popup-meal-table th { font-weight: bold; }
      .popup-meal-table tr:not(:last-child) td { border-bottom: 1px solid #eee; }
      .popup-meal-table tr:hover { background: var(--ha-card-background, #222c) !important; }
      @media (prefers-color-scheme: dark) {
        .popup-meal-table tr:hover { background: #333a !important; }
      }
      .edit-fields-row { display: flex; gap: 1em; align-items: center; margin-bottom: 1em; }
      .edit-portion { width: 4em; }
      .suggested-times-row { display: flex; gap: 0.5em; align-items: center; margin-bottom: 1em; }
      .empty-table-row { font-style: italic; }
      .edit-form {
        transition: box-shadow 0.2s, background 0.2s;
        box-shadow: 0 2px 8px #0002;
        background: #fff !important;
        border-radius: 8px;
        padding: 1em 0.5em;
        color: #222 !important;
      }
      .edit-dialog, .popup-card {
        background: transparent !important;
      }
      @media (prefers-color-scheme: dark) {
        .edit-form {
          background: #222 !important;
          color: #fff !important;
        }
      }
      .popup-actions-row { display: flex; flex-direction: row; gap: 1em; justify-content: space-between; margin-top: 1em; }
      @media (prefers-color-scheme: dark) {
        .edit-form { background: var(--ha-card-background, #222); }
      }
    `;
  }

  _attach() {
    this.attachShadow({ mode: "open" });
    if (this._elements.style && this._elements.card) {
      this.shadowRoot.append(this._elements.style, this._elements.card);
    }
  }

  _queryElements() {
    const card = this._elements.card;
    this._elements.error = card.querySelector(".error");
    this._elements.overviewSchedules = card.querySelector(".overview-schedules");
    this._elements.overviewGrams = card.querySelector(".overview-grams");
    this._elements.overviewActive = card.querySelector(".overview-active");
    this._elements.manageBtn = card.querySelector(".manage-btn");
    this._elements.editDialog = card.querySelector(".edit-dialog");
    this._elements.editTime = card.querySelector(".edit-time");
    this._elements.editPortion = card.querySelector(".edit-portion");
    this._elements.dayBtns = Array.from(card.querySelectorAll('.day-btn'));
    this._elements.popupMealTableBody = card.querySelector('.popup-meal-table-body');
    this._elements.addSchemaBtn = card.querySelector('.add-schema-btn');
    this._elements.saveSchemasBtn = card.querySelector('.save-schemas-btn');
    this._elements.editForm = card.querySelector('.edit-form');
    this._elements.backBtn = card.querySelector('.back-btn');
    this._elements.backToListBtn = card.querySelector('.back-to-list-btn');
    this._elements.popupTableSection = this._elements.card.querySelector('.popup-table-section');
  }

  _listen() {
    if (this._elements.manageBtn) this._elements.manageBtn.addEventListener("click", this._onEditSchedule.bind(this));
    if (this._elements.addSchemaBtn) this._elements.addSchemaBtn.addEventListener('click', () => this._onAddSchema());
    if (this._elements.saveSchemasBtn) this._elements.saveSchemasBtn.addEventListener('click', () => this._onSaveSchemasClick());
    if (this._elements.popupMealTableBody) this._elements.popupMealTableBody.addEventListener('click', e => {
      if (e.target.classList.contains('edit-row-btn')) {
        const idx = Number(e.target.dataset.idx);
        this._onEditRow(idx);
      } else if (e.target.classList.contains('delete-row-btn')) {
        const idx = Number(e.target.dataset.idx);
        this._onDeleteRow(idx);
      } else if (e.target.classList.contains('enabled-checkbox')) {
        const idx = Number(e.target.dataset.idx);
        this._meals[idx].enabled = e.target.checked;
        this._updateUnsavedIndicator();
      }
    });
    if (this._elements.dayBtns) {
      this._elements.dayBtns.forEach(btn => btn.addEventListener('click', e => {
        btn.classList.toggle('selected');
      }));
    }
    if (this._elements.editDialog) {
      this._elements.editDialog.addEventListener("close", this._onDialogClose.bind(this));
      const form = this._elements.editDialog.querySelector('form');
      if (form) form.addEventListener('submit', this._onDialogSubmit.bind(this));
    }
    if (this._elements.backBtn) this._elements.backBtn.addEventListener('click', e => {
      e.preventDefault();
      this._showEditForm(false);
      this._renderPopupMealTable();
    });
    if (this._elements.backToListBtn) this._elements.backToListBtn.addEventListener('click', e => {
      e.preventDefault();
      this._showEditForm(false);
      this._renderPopupMealTable();
    });
    // Suggested time buttons
    if (this._elements.card) {
      this._elements.card.addEventListener('click', e => {
        if (e.target.classList.contains('suggested-time-btn')) {
          const t = e.target.getAttribute('data-time');
          if (this._elements.editTime) this._elements.editTime.value = t;
        }
        if (e.target.classList.contains('clear-btn')) {
          if (this._elements.editTime) this._elements.editTime.value = '';
          if (this._elements.editPortion) this._elements.editPortion.value = '';
          if (this._elements.dayBtns) this._elements.dayBtns.forEach(btn => btn.classList.remove('selected'));
        }
        if (e.target.classList.contains('cancel-list-btn')) {
          // Only close if in list view
          if (this._elements.editForm && this._elements.editForm.style.display === 'none') {
            if (this._elements.editDialog) this._elements.editDialog.close();
          }
        }
      });
    }
  }

  _updateConfig() {
    if (this._config.title) {
      this._elements.card.setAttribute("header", this._config.title);
    } else {
      this._elements.card.removeAttribute("header");
    }
  }

  _updateHass() {
    const stateObj = this.getState();
    let loadedMeals = null;
    if (!stateObj) {
      console.warn('[cleverio-pf100-card] Sensor state not found:', this.getSensorID());
      if (this._elements.error) this._elements.error.textContent = `${this.getSensorID()} is unavailable.`;
      if (this._elements.error) this._elements.error.classList.remove("hidden");
      if (this._elements.dl) this._elements.dl.classList.add("hidden");
    } else {
      if (this._elements.error) this._elements.error.textContent = "";
      if (this._elements.topic) this._elements.topic.textContent = this.getName();
      if (this._elements.value) this._elements.value.textContent = stateObj.state;
      if (this._elements.error) this._elements.error.classList.add("hidden");
      if (this._elements.dl) this._elements.dl.classList.remove("hidden");
      // Try to decode the sensor value
      try {
        loadedMeals = MealUtils.decodeMealPlanData(stateObj.state);
        if (Array.isArray(loadedMeals)) {
          this._persistedMeals = loadedMeals;
        }
      } catch (e) {
        console.error('[cleverio-pf100-card] Failed to decode sensor state:', stateObj.state, e);
      }
    }
    // Always set _meals as a deep copy of _persistedMeals (do this last)
    if (Array.isArray(this._persistedMeals)) {
      this._meals = JSON.parse(JSON.stringify(this._persistedMeals));
    } else {
      this._persistedMeals = [];
      this._meals = [];
    }
    this._renderOverview();
    this._renderMealTable();
  }

  _renderOverview() {
    // Show number of schedules, number of enabled schedules, and today's grams (active only)
    if (!this._elements.overviewSchedules || !this._elements.overviewGrams || !this._elements.overviewActive) return;
    const count = Array.isArray(this._meals) ? this._meals.length : 0;
    const enabledCount = Array.isArray(this._meals) ? this._meals.filter(m => m.enabled).length : 0;
    this._elements.overviewSchedules.textContent = `Schedules: ${count}`;
    this._elements.overviewActive.textContent = `Active schedules: ${enabledCount}`;
    // Calculate today's grams (only enabled schedules)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const grams = MealUtils.getTodaysFoodGrams(this._meals.filter(m => m.enabled), today) * 6; // 6g per portion
    this._elements.overviewGrams.textContent = `Today: ${grams}g (active)`;
  }

  _saveMealsToSensor() {
    if (!this._hass || !this.getSensorID()) return;
    const value = MealUtils.encodeMealPlanData(this._meals);
    this._hass.callService('text', 'set_value', {
      entity_id: this.getSensorID(),
      value
    });
  }

  _renderMealTable() {
    // Only render if _meals is defined and is an array
    if (!Array.isArray(this._meals)) return;
    const tbody = this._elements.mealTableBody;
    if (!tbody) return;
    tbody.innerHTML = '';
    this._meals.forEach((meal, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${meal.time}</td>
        <td>${meal.portion}</td>
        <td>${meal.days}</td>
        <td>${meal.enabled ? 'Yes' : 'No'}</td>
        <td><button class="edit-row-btn" data-idx="${idx}">Edit</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  _onEditSchedule() {
    // Open the popup dialog for managing schedules
    this._unsaved = false;
    if (this._elements.editDialog) this._elements.editDialog.showModal();
    this._renderPopupMealTable();
    if (this._elements.editForm) this._elements.editForm.style.display = 'none';
    this._updateUnsavedIndicator();
  }

  _renderPopupMealTable() {
    if (!this._elements.popupMealTableBody) return;
    this._elements.popupMealTableBody.innerHTML = '';
    if (!this._meals || this._meals.length === 0) {
      const emptyRow = this._elements.card.querySelector('.empty-table-row');
      if (emptyRow) emptyRow.style.display = '';
    } else {
      const emptyRow = this._elements.card.querySelector('.empty-table-row');
      if (emptyRow) emptyRow.style.display = 'none';
      const dayAbbrs = ['Mo','Tu','We','Th','Fr','Sa','Su'];
      const uiDays = DaysUtil.DAYS; // Monday-Sunday
      (this._meals || []).forEach((meal, idx) => {
        const mask = meal.daysMask || 0;
        const days = DaysUtil.getDaysLabel(mask);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${meal.time}</td>
          <td>${meal.portion}</td>
          <td>${days}</td>
          <td><input type="checkbox" class="enabled-checkbox" data-idx="${idx}" ${meal.enabled ? 'checked' : ''}></td>
          <td>
            <button type="button" class="edit-row-btn button" data-idx="${idx}" aria-label="Edit schedule">Edit</button>
            <button type="button" class="delete-row-btn button" data-idx="${idx}" aria-label="Delete schedule">Delete</button>
          </td>
        `;
        this._elements.popupMealTableBody.appendChild(tr);
      });
    }
  }

  _onAddSchema() {
    // Show the edit form as a subview overlaying the list
    this._showEditForm(true);
    this._elements.editTime.value = '';
    this._elements.editPortion.value = '';
    // Deselect all day buttons by default
    if (this._elements.dayBtns) this._elements.dayBtns.forEach(btn => btn.classList.remove('selected'));
    this._editMealIdx = null;
  }

  _onEditRow(idx) {
    // Show the edit form for the selected meal as a subview overlaying the list
    const meal = this._meals[idx];
    if (!meal) return;
    this._showEditForm(true);
    this._elements.editTime.value = meal.time;
    this._elements.editPortion.value = meal.portion;
    // Select day buttons based on meal.daysMask
    if (this._elements.dayBtns) {
      this._elements.dayBtns.forEach((btn, i) => {
        btn.classList.toggle('selected', (meal.daysMask & (1 << i)) !== 0);
      });
    }
    this._editMealIdx = idx;
    this._elements.popupMealTableBody.innerHTML = '';
  }

  _onDeleteRow(idx) {
    // Remove the meal from the array and update the sensor
    this._meals.splice(idx, 1);
    this._saveMealsToSensor();
    this._renderMealTable();
    this._renderPopupMealTable();
  }

  // When dialog is closed/cancelled, reset working copy to persisted
  _onDialogClose() {
    this._meals = JSON.parse(JSON.stringify(this._persistedMeals));
    this._unsaved = false;
    this._editMealIdx = null;
    if (this._elements.editForm) this._elements.editForm.style.display = 'none';
    this._renderPopupMealTable();
    this._updateUnsavedIndicator();
  }

  _onDialogSubmit(e) {
    e.preventDefault();
    // Save or update meal (do not save to sensor yet)
    const meal = this._createMealFromForm();
    if (this._editMealIdx != null) {
      // Update existing meal
      this._meals[this._editMealIdx] = meal;
    } else {
      // Add new meal
      this._meals.push(meal);
    }
    this._updateUnsavedIndicator();
    // Only return to list view, do not close dialog or show popup
    this._showEditForm(false);
    this._renderPopupMealTable();
  }

  // Helper to create a meal object from form fields
  _createMealFromForm() {
    // Get selected days from buttons
    const selectedDays = this._elements.dayBtns
      .map((btn, i) => btn.classList.contains('selected') ? i : null)
      .filter(i => i !== null);
    // Convert to bitmask
    const daysMask = selectedDays.reduce((mask, i) => mask | (1 << i), 0);
    return {
      time: this._elements.editTime.value,
      portion: Number(this._elements.editPortion.value),
      daysMask,
      enabled: this._editMealIdx != null ? this._meals[this._editMealIdx].enabled : true
    };
  }

  _onSaveSchemasClick() {
    if (!this._unsaved) return;
    // Remove confirm dialog for save
    const encoded = MealUtils.encodeMealPlanData(this._meals);
    this._hass.callService('text', 'set_value', {
      entity_id: this.getSensorID(),
      value: encoded
    });
    this._persistedMeals = JSON.parse(JSON.stringify(this._meals));
    this._updateUnsavedIndicator();
    // Close dialog after save
    if (this._elements.editDialog) this._elements.editDialog.close();
  }

  // Helper to update unsaved indicator (red dot) on the manage button
  _updateUnsavedIndicator() {
    // Only mark as unsaved if meals differ from persisted
    const isUnsaved = !mealsEqual(this._meals, this._persistedMeals);
    this._unsaved = isUnsaved;
    if (this._elements.saveSchemasBtn) {
      this._elements.saveSchemasBtn.style.background = isUnsaved ? '#ff9800' : 'var(--primary-color, #03a9f4)';
      this._elements.saveSchemasBtn.textContent = isUnsaved ? 'Save (unsaved changes)' : 'Save';
      this._elements.saveSchemasBtn.title = isUnsaved ? 'You have unsaved changes' : '';
    }
  }

  // Helper to show/hide edit form vs. table section
  _showEditForm(show) {
    if (this._elements.editForm && this._elements.popupTableSection) {
      this._elements.editForm.style.display = show ? '' : 'none';
      this._elements.popupTableSection.style.display = show ? 'none' : '';
    }
  }

  // Debugging aid: log the internal state of meals
  _logMealsState() {
    console.groupCollapsed('[cleverio-pf100-card] Meals State');
    console.log('Persisted Meals:', this._persistedMeals);
    console.log('Current Meals:', this._meals);
    console.groupEnd();
  }
}

customElements.define('cleverio-pf100-card', CleverioPetFeederCard);
