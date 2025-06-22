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
    /* your styles here */
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
      <form @submit=${(e: Event) => e.preventDefault()}>
        ${this._error ? html`<div class="error">${this._error}</div>` : ''}
        <cleverio-day-selector
          .selectedDaysMask=${editData.daysMask}
          .editable=${true}
          @days-changed=${(e: CustomEvent) => this._onDaysChanged(e)}
        ></cleverio-day-selector>
        <div class="predefined-times">
          ${predefinedTimes.map(time => html`
            <ha-button type="button" @click=${() => { editData.time = time; this.requestUpdate(); }}>${time}</ha-button>
          `)}
        </div>
        <input
          class="edit-time"
          type="time"
          .value=${editData.time}
          @input=${(e: Event) => (editData.time = (e.target as HTMLInputElement).value)}
        />
        <input
          type="number"
          min="1"
          .value=${editData.portion}
          @input=${(e: Event) => (editData.portion = parseInt((e.target as HTMLInputElement).value, 10))}
        />
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
