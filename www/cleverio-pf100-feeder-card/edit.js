import { LitElement, html, css } from 'lit';
import { commonCardStyle } from './common-styles.js';
import DaysUtil from './utils/days-util.js';

export class CleverioEditView extends LitElement {
  static properties = {
    meal: { type: Object },
    _time: { state: true },
    _portion: { state: true },
    _daysMask: { state: true },
  };

  constructor() {
    super();
    this.meal = { time: '', portion: 1, daysMask: 0, enabled: true };
    this._time = '';
    this._portion = 1;
    this._daysMask = 0;
  }

  updated(changed) {
    if (changed.has('meal') && this.meal) {
      this._time = this.meal.time || '';
      this._portion = this.meal.portion || 1;
      this._daysMask = this.meal.daysMask || 0;
    }
  }

  static styles = [
    css([commonCardStyle]),
    css`
      .edit-form {
        max-width: 320px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--ha-card-section-margin, 1em);
        /* Remove border, background, border-radius to avoid double border */
        border: none;
        background: none;
        border-radius: 0;
      }
      .edit-title {
        margin-bottom: 0.2em;
        font-size: 1.2em;
        font-weight: bold;
        color: var(--primary-text-color);
        text-align: left;
      }
      .edit-days-row {
        display: flex;
        gap: 0.5em;
        justify-content: flex-start;
        margin-bottom: 0.5em;
      }
      .day-btn {
        width: 2.4em;
        height: 2.4em;
        min-width: 2.4em;
        min-height: 2.4em;
        border-radius: 50%;
        border: 2px solid var(--divider-color, #888);
        background: var(--card-background-color, #eee);
        color: var(--primary-text-color);
        font-weight: bold;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
        margin-bottom: 0;
        position: relative;
        box-sizing: border-box;
      }
      .day-btn.selected {
        background: var(--primary-color);
        color: var(--text-primary-color);
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px #2196f344;
      }
      /* Remove the checkmark span entirely */
      .day-check { display: none !important; }
      .edit-fields-row {
        display: flex;
        gap: 1em;
        align-items: flex-end;
        margin-bottom: 0.2em;
      }
      .edit-portion-row {
        margin-bottom: 0.7em;
      }
      .edit-fields-row label,
      .edit-portion-row label {
        max-width: 10em;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.2em;
        position: relative;
      }
      .edit-form input[type="time"],
      .edit-form input[type="number"] {
        max-width: 10em;
        width: 100%;
        height: 2.4em;
        border-radius: var(--ha-card-border-radius, 8px);
        border: 1.5px solid var(--divider-color, #ccc);
        background: var(--input-background-color, var(--card-background-color, #fff));
        color: var(--primary-text-color);
        font-size: 1em;
        padding: 0 0.7em;
        box-sizing: border-box;
        outline: none;
        transition: border 0.2s, background 0.2s;
      }
      .edit-form input[type="time"]:focus,
      .edit-form input[type="number"]:focus {
        border: 1.5px solid var(--primary-color);
        background: var(--input-background-color, var(--ha-card-background));
      }
      .edit-portion { width: 100%; min-width: 0; }
      .portion-helper {
        display: none;
      }
      .portion-helper-inline {
        font-size: 0.95em;
        color: var(--secondary-text-color, #888);
        line-height: 1.2;
        white-space: nowrap;
        pointer-events: none;
      }
      .suggested-label {
        color: var(--secondary-text-color, #888);
        font-size: 0.97em;
        margin-left: 0.2em;
        margin-bottom: 0.2em;
        display: block;
      }
      .suggested-times-btn-row {
        display: flex;
        gap: 0.5em;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 1em;
        margin-left: 0.2em;
      }
      .suggested-time-btn {
        border-radius: var(--ha-card-border-radius, 8px);
        border: 2px solid var(--divider-color, #888);
        background: var(--card-background-color, #eee);
        color: var(--primary-text-color);
        font-weight: bold;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1em;
        transition: background 0.2s, color 0.2s, border 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        padding: 0 1.1em;
        min-width: 3.2em;
        height: 2.2em;
      }
      .suggested-time-btn:active, .suggested-time-btn:focus {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: var(--text-primary-color);
      }
      menu { display: flex; gap: 1em; justify-content: flex-end; margin-top: 1em; }
      .edit-save-btn, .back-to-list-btn {
        border-radius: var(--ha-card-border-radius, 8px);
        background: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        font-weight: 500;
        transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        padding: var(--ha-card-button-padding, 0.5em 1em);
      }
    `
  ];

  render() {
    return html`
      <form class="edit-form" @submit=${this._onSave}>
        <h3 class="edit-title" style="margin-top:0; text-align:left;">Edit Meal</h3>
        <div class="edit-days-row" style="justify-content:flex-start;">
          ${DaysUtil.DAYS.map((day, i) => html`
            <button type="button" class="day-btn${this._daysMask & (1 << i) ? ' selected' : ''}" @click=${e => this._toggleDay(e, i)}>${day.slice(0,2)}</button>
          `)}
        </div>
        <div class="edit-fields-row">
          <label>Time:
            <input class="edit-time" type="time" required .value=${this._time} @input=${e => this._time = e.target.value}>
          </label>
        </div>
        <div class="edit-portion-row">
          <label style="position:relative; display:block;">
            <span style="display:flex; align-items:center; gap:0.5em;">
              Portion:
              <span class="portion-helper-inline">(1 portion = 6g)</span>
            </span>
            <input class="edit-portion" type="number" min="1" required .value=${this._portion} @input=${e => this._portion = Number(e.target.value)}>
          </label>
        </div>
        <span class="suggested-label">Suggested:</span>
        <div class="suggested-times-btn-row">
          ${['07:00','12:00','18:00'].map(t => html`<button type="button" class="suggested-time-btn" @click=${e => this._suggestTime(e, t)}>${t}</button>`)}
        </div>
        <div class="edit-divider"></div>
        <menu>
          <button type="button" class="button back-to-list-btn" @click=${this._onBack}>Back</button>
          <button type="submit" class="button edit-save-btn">Save</button>
        </menu>
      </form>
    `;
  }

  _toggleDay(e, i) {
    e.preventDefault();
    this._daysMask ^= (1 << i);
  }
  _suggestTime(e, t) {
    e.preventDefault();
    this._time = t;
  }
  _onBack(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  }
  _onSave(e) {
    e.preventDefault();
    const meal = {
      ...this.meal,
      time: this._time,
      portion: this._portion,
      daysMask: this._daysMask,
      enabled: true,
    };
    this.dispatchEvent(new CustomEvent('save', { detail: { meal }, bubbles: true, composed: true }));
  }
}

customElements.define('cleverio-edit-view', CleverioEditView);
