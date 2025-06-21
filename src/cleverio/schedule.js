import { LitElement, html, css } from 'lit';
import { commonCardStyle, commonTableStyle } from './common-styles.js';
import DaysUtil from './util/days-util.js';
import { mealsEqual } from './util/mealplan-state.js';
import './Edit.js';

/**
 * SchedulesView: Pure view for displaying and editing meal schedules.
 * To be rendered inside parent card's <ha-dialog>, does not use <ha-dialog> directly.
 */
export class CleverioSchedulesView extends LitElement {
  static get properties() {
    return {
      meals: { type: Array },
      _localMeals: { type: Array },
      _view: { type: String },
      _editIdx: { type: Number },
    };
  }

  constructor() {
    super();
    this.meals = [];
    this._localMeals = [];
    this._view = 'table';
    this._editIdx = null;
  }

  updated(changed) {
    if (changed.has('meals')) {
      this._localMeals = this.meals.map(m => ({ ...m }));
      this._view = 'table';
      this._editIdx = null;
    }
  }

  static styles = [
    commonCardStyle,
    commonTableStyle,
    css`
      .schedules-title {
        font-size: 1.15em;
        margin: 0.5em 0 0.5em 0;
        text-align: center;
        color: var(--primary-text-color);
      }
      .add-schema-btn, .popup-actions-row button {
        border-radius: var(--ha-card-border-radius, 8px);
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        font-weight: 500;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        padding: var(--ha-card-button-padding, 0.3em 0.8em);
        font-size: 0.95em;
        margin-bottom: 0.2em;
      }
      .popup-actions-row {
        display: flex;
        gap: 0.7em;
        justify-content: flex-end;
        margin-top: 0.5em;
        flex-direction: row;
        align-items: center;
      }
      .popup-actions-row .add-schema-btn {
        order: 1;
        margin-right: auto;
        margin-bottom: 0;
      }
      .popup-actions-row .cancel-btn {
        order: 2;
      }
      .popup-actions-row .save-btn {
        order: 3;
      }
      .action-btns {
        display: flex;
        gap: 0.3em;
        justify-content: center;
        align-items: center;
      }
      .icon-btn {
        background: none;
        border: none;
        padding: 0.2em;
        border-radius: 50%;
        cursor: pointer;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .icon-btn:active, .icon-btn:focus {
        background: var(--primary-color, #2196f3)11;
      }
      .icon-btn svg {
        width: 1.3em;
        height: 1.3em;
        display: block;
      }
      .save-helper {
        text-align: right;
        margin-top: 0.2em;
        font-size: 0.97em;
      }
      .popup-meal-table {
        border: none;
        box-shadow: none;
        background: transparent;
      }
      .popup-meal-table th, .popup-meal-table td {
        border: none;
      }
    `
  ];

  render() {
    if (this._view === 'edit') {
      return this._renderEditView();
    }
    return html`
      <div class="schedules-view ha-card-style">
        <h3 class="schedules-title">Scheduled Meals</h3>
        <table class="popup-meal-table ha-table-style">
          <thead>
            <tr>
              <th>Time</th>
              <th>Portion</th>
              <th>Days</th>
              <th>Enabled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this._localMeals.length === 0
              ? html`<tr><td colspan="5" style="text-align:center;color:#888;">No schedules yet</td></tr>`
              : this._localMeals.map((meal, idx) => html`
                  <tr>
                    <td>${meal.time}</td>
                    <td>${meal.portion}</td>
                    <td>${DaysUtil.getDaysLabel(meal.daysMask || 0)}</td>
                    <td><ha-checkbox class="enabled-checkbox" .checked=${meal.enabled} @change=${e => this._toggleEnabled(idx, e)}></ha-checkbox></td>
                    <td><span class="action-btns">
                      <button type="button" class="edit-row-btn icon-btn" @click=${() => this._edit(idx)} aria-label="Edit schedule">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                      </button>
                      <button type="button" class="delete-row-btn icon-btn" @click=${() => this._delete(idx)} aria-label="Delete schedule">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </span></td>
                  </tr>
                `)}
          </tbody>
        </table>
        <div class="popup-actions-row">
          <button class="add-schema-btn" @click=${this._add}>Add schedule</button>
          <button class="cancel-btn" @click=${this._cancel}>Cancel</button>
          <button class="save-btn" @click=${this._save} .disabled=${mealsEqual(this._localMeals, this.meals)} style=${mealsEqual(this._localMeals, this.meals) ? '' : 'background: var(--error-color, #e53935); color: var(--text-primary-color, #fff); box-shadow: 0 0 0 2px var(--error-color, #e53935)33;'}>Save</button>
        </div>
        <div class="save-helper" style="color:${mealsEqual(this._localMeals, this.meals) ? 'var(--secondary-text-color, #888)' : 'var(--error-color, #e53935)'};">
          ${mealsEqual(this._localMeals, this.meals) ? 'No changes to save.' : 'You have unsaved changes.'}
        </div>
      </div>
    `;
  }

  _toggleEnabled(idx, e) {
    this._localMeals[idx].enabled = e.target.checked;
    this.requestUpdate();
  }
  _edit(idx) {
    this._editIdx = idx;
    this._view = 'edit';
    this.requestUpdate();
  }
  _delete(idx) {
    this._localMeals.splice(idx, 1);
    this.requestUpdate();
  }
  _add() {
    this._editIdx = null;
    this._view = 'edit';
    this.requestUpdate();
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  }
  _save() {
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: this._localMeals }, bubbles: true, composed: true }));
  }

  _renderEditView() {
    const meal = this._editIdx != null ? this._localMeals[this._editIdx] : { time: '', portion: 1, daysMask: 0, enabled: true };
    return html`
      <cleverio-edit-view
        .meal=${meal}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></cleverio-edit-view>
    `;
  }

  _onEditSave(e) {
    const meal = e.detail.meal;
    if (this._editIdx != null) {
      this._localMeals[this._editIdx] = meal;
    } else {
      this._localMeals = [...this._localMeals, meal];
    }
    this._view = 'table';
    this._editIdx = null;
    this.requestUpdate();
  }

  _onEditBack() {
    this._view = 'table';
    this._editIdx = null;
    this.requestUpdate();
  }
}