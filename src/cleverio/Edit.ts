import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FeedingTime } from './util/mealplan-state';
import { loadHaComponents } from '@kipk/load-ha-components';
import './day-selector';

@customElement('cleverio-edit-view')
export class CleverioEditView extends LitElement {
  @property({ type: Object }) accessor data!: FeedingTime;

  @state() private _haComponentsReady = false;
  @state() private _localEdit: FeedingTime | null = null;
  @state() private _error: string | null = null;

  static styles = css`
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.2em;
      padding: 1.2em 0.5em 0.5em 0.5em;
      min-width: 260px;
      max-width: 350px;
      margin: 0 auto;
    }
    .error {
      color: var(--error-color, #b71c1c);
      background: #fff0f0;
      border-radius: 4px;
      padding: 0.5em 0.8em;
      margin-bottom: 0.5em;
      font-size: 0.98em;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3em;
    }
    label {
      font-size: 1em;
      font-weight: 500;
      margin-bottom: 0.1em;
      color: var(--primary-text-color, #333);
    }
    .helper {
      font-size: 0.92em;
      color: #888;
      margin-top: -0.2em;
      margin-bottom: 0.2em;
    }
    .predefined-times {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      margin: 0.5em 0 0.5em 0;
      justify-content: flex-start;
    }
    .edit-actions {
      display: flex;
      flex-direction: row;
      gap: 1em;
      justify-content: flex-end;
      margin-top: 1.2em;
    }
    .edit-actions ha-button:first-child {
      order: 1;
    }
    .edit-actions .save-btn {
      order: 2;
    }
  `;

  constructor() {
    super();
  }

  async connectedCallback() {
    super.connectedCallback();
    await loadHaComponents(['ha-form', 'ha-button', 'ha-switch']);
    this._haComponentsReady = true;
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('data') && this.data) {
      this._localEdit = { ...this.data };
      this._error = null;
    }
  }

  render() {
    if (!this._haComponentsReady || !this._localEdit) {
      return html`<div>Loading…</div>`;
    }
    const editData = this._localEdit;
    const predefinedTimes = ['06:00', '08:00', '12:00', '15:00', '18:00', '21:00'];
    return html`
      <form class="edit-form" @submit=${(e: Event) => e.preventDefault()}>
        ${this._error ? html`<div class="error">${this._error}</div>` : ''}
        <cleverio-day-selector
          .selectedDaysMask=${editData.daysMask}
          .editable=${true}
          @days-changed=${(e: CustomEvent) => this._onDaysChanged(e)}
        ></cleverio-day-selector>
        <div class="form-group">
          <label for="edit-time">Time</label>
          <input
            id="edit-time"
            class="edit-time"
            type="time"
            .value=${editData.time}
            @input=${(e: Event) => (editData.time = (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="form-group">
          <label for="edit-portion">Portion</label>
          <input
            id="edit-portion"
            type="number"
            min="1"
            .value=${editData.portion}
            @input=${(e: Event) => (editData.portion = parseInt((e.target as HTMLInputElement).value, 10))}
          />
          <div class="helper">1 portion = 6 grams</div>
        </div>
        <div class="predefined-times">
          ${predefinedTimes.map(time => html`
            <ha-button type="button" @click=${() => { editData.time = time; this.requestUpdate(); }}>${time}</ha-button>
          `)}
        </div>
        <div class="edit-actions">
          <ha-button type="button" @click=${() => this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }))}>Back</ha-button>
          <ha-button class="ha-primary save-btn" type="button" @click=${this._onEditSave}>Save</ha-button>
        </div>
      </form>
    `;
  }

  private _onDaysChanged(e: CustomEvent) {
    if (this._localEdit) {
      this._localEdit.daysMask = e.detail.daysMask;
      this.requestUpdate();
    }
  }

  /**
   * Save handler for edit view: validates, emits 'edit-save', then 'back'.
   */
  private _onEditSave = (e: Event) => {
    e.preventDefault();
    if (!this._localEdit) return;
    // Validation
    if (!this._localEdit.time || !/^\d{2}:\d{2}$/.test(this._localEdit.time)) {
      this._error = 'Please enter a valid time.';
      this.requestUpdate();
      return;
    }
    if (!this._localEdit.portion || this._localEdit.portion < 1) {
      this._error = 'Portion must be at least 1.';
      this.requestUpdate();
      return;
    }
    this._error = null;
    this.dispatchEvent(new CustomEvent('edit-save', {
      detail: { meal: this._localEdit },
      bubbles: true,
      composed: true
    }));
    this.dispatchEvent(new CustomEvent('back', { bubbles: true, composed: true }));
  };
}
