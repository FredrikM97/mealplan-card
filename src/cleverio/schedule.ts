import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadHaComponents } from '@kipk/load-ha-components';
import {localize} from './locales/localize';
import './edit';
import './day-selector';
import type { FeedingTime } from './util/mealplan-state';

console.log('[cleverio-schedule-view] Module loaded');

@customElement('cleverio-schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Array }) accessor meals: FeedingTime[] = [];
  @property({ type: Array }) accessor _localMeals: FeedingTime[] = [];
  @property({ type: Boolean }) accessor _haComponentsReady = false;
  @property({ type: Boolean }) private _editDialogOpen = false;
  @state() private _editDialogReallyOpen: boolean = false;
  @state() private _editForm: FeedingTime | null = null;
  @state() private _editError: string | null = null;
  private _editIdx: number | null = null;

  constructor() {
    super();
    this.meals = [];
    this._localMeals = [];
    this._editDialogOpen = false;
    this._editDialogReallyOpen = false;
    console.log('[cleverio-schedule-view] Constructor');
  }

  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback();
    console.log('[cleverio-schedule-view] connectedCallback');
    await loadHaComponents(['ha-data-table', 'ha-switch', 'ha-button', 'ha-icon']);
    this._haComponentsReady = true;
    console.log('[cleverio-schedule-view] HA components loaded');
  }

  // Watch for changes in meals
  updated(changed: PropertyValues) {
    if (changed.has('meals')) {
      this._localMeals = this.meals.map(m => ({ ...m }));
      this._editDialogOpen = false;
      this._editDialogReallyOpen = false;
      console.log('[cleverio-schedule-view] Meals updated', this._localMeals);
    }
  }

  // Helper to check if there are unsaved changes
  private get _hasUnsavedChanges(): boolean {
    // Compare _localMeals and meals deeply
    const a = JSON.stringify(this._localMeals);
    const b = JSON.stringify(this.meals);
    return a !== b;
  }

  static styles = [
    css`
      .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1em;
        width: 100%;
        box-sizing: border-box;
      }
      .edit-form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
      }
      .edit-predefined-times {
        display: flex;
        gap: 0.5em;
        flex-wrap: wrap;
      }
      .edit-error {
        color: red;
        font-size: 0.9em;
      }
    `
  ];

  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    const columns = {
      time: { title: localize('time'), sortable: true, minWidth: '80px'},
      portion: { title: localize('portion'), sortable: true, minWidth: '80px'},
      days: {
        title: localize('days'),
        sortable: false,
        minWidth: '130px',
        template: (row: any) => html`
          <cleverio-day-selector .selectedDaysMask=${row.daysMask} .editable=${false}></cleverio-day-selector>`
      },
      enabled: {
        title: localize('enabled'),
        sortable: true,
        minWidth: '60px',
        template: (row: any) => html`
          <div style="display: flex; align-items: center; justify-content: center; height: 48px;">
            <ha-switch
              .checked=${row.enabled}
              @change=${(e: Event) => this._toggleEnabled(row._idx, e)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        `
      },
      actions: {
        title: localize('actions'),
        sortable: false,
        minWidth: '140px',
        template: (row: any) => html`
          <ha-icon-button @click=${() => this._openEditDialog(row._idx)} title="Edit">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button @click=${() => this._delete(row._idx)} title="Delete">
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        `
      }
    };
    const rows = this._localMeals.map((m, i) => ({ ...m, _idx: i }));
    const fakeHass = { locale: { language: 'en', country: 'US' } };
    const predefinedTimes = ['06:00', '08:00', '12:00', '15:00', '18:00', '21:00'];
    return html`
      <ha-dialog open scrimClickAction  heading= ${this._editDialogReallyOpen ? 'Edit Feeding Time' : localize('manage_schedules')}>
      
        ${this._editDialogReallyOpen
          ? html`
              <form class="edit-form" @submit=${(e: Event) => e.preventDefault()}>
                ${this._editError ? html`<div class="error">${this._editError}</div>` : ''}
                <cleverio-day-selector
                  .selectedDaysMask=${this._editForm?.daysMask ?? 0}
                  .editable=${true}
                  @days-changed=${(e: CustomEvent) => this._onEditDaysChanged(e)}
                ></cleverio-day-selector>
                <div class="edit-form-group">
                  <label for="edit-time">Time</label>
                  <input
                    id="edit-time"
                    class="edit-time"
                    type="time"
                    .value=${this._editForm?.time ?? ''}
                    @input=${(e: Event) => this._onEditTimeInput(e)}
                  />
                </div>
                <div class="edit-form-group">
                  <label for="edit-portion">Portion</label>
                  <input
                    id="edit-portion"
                    type="number"
                    min="1"
                    .value=${this._editForm?.portion ?? 1}
                    @input=${(e: Event) => this._onEditPortionInput(e)}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${predefinedTimes.map(time => html`
                    <ha-button type="button" @click=${() => this._onEditPredefinedTime(time)}>${time}</ha-button>
                  `)}
                </div>
              </form>
            `
          : html`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .hass=${fakeHass}
                  .localizeFunc=${localize}
                  .columns=${columns}
                  .data=${rows}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this._editDialogReallyOpen
          ? html`
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>Back</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>Save</ha-button>
            `
          : html`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>Add</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>Cancel</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>Save</ha-button>
            `}
      </ha-dialog>
    `;
  }

  _toggleEnabled(idx: number, e: Event) {
    this._localMeals[idx].enabled = (e.target as HTMLInputElement).checked;
    this.requestUpdate();
    console.log('[cleverio-schedule-view] _toggleEnabled', { idx, enabled: this._localMeals[idx].enabled });
  }

  _openEditDialog(idx: number) {
    this._editDialogOpen = true;
    this._editDialogReallyOpen = true;
    this._editIdx = idx;
    this._editForm = { ...this._localMeals[idx] };
    this._editError = null;
    this.requestUpdate();
  }

  _openAddDialog() {
    this._editDialogOpen = true;
    this._editDialogReallyOpen = true;
    this._editIdx = null;
    this._editForm = { time: '', portion: 1, daysMask: 0, enabled: true };
    this._editError = null;
    this.requestUpdate();
  }

  _closeEditDialog() {
    this._editDialogOpen = false;
    this._editDialogReallyOpen = false;
    this._editIdx = null;
    this._editForm = null;
    this._editError = null;
    this.requestUpdate();
  }

  _onEditDaysChanged(e: CustomEvent) {
    if (this._editForm) {
      this._editForm.daysMask = e.detail.daysMask;
      this.requestUpdate();
    }
  }

  _onEditTimeInput(e: Event) {
    if (this._editForm) {
      this._editForm.time = (e.target as HTMLInputElement).value;
      this.requestUpdate();
    }
  }

  _onEditPortionInput(e: Event) {
    if (this._editForm) {
      this._editForm.portion = parseInt((e.target as HTMLInputElement).value, 10);
      this.requestUpdate();
    }
  }

  _onEditPredefinedTime(time: string) {
    if (this._editForm) {
      this._editForm.time = time;
      this.requestUpdate();
    }
  }

  _onEditSave(e?: Event) {
    if (e) e.preventDefault();
    if (!this._editForm) return;
    // Validation
    if (!this._editForm.time || !/^[0-2]\d:[0-5]\d$/.test(this._editForm.time)) {
      this._editError = 'Please enter a valid time.';
      this.requestUpdate();
      return;
    }
    if (!this._editForm.portion || this._editForm.portion < 1) {
      this._editError = 'Portion must be at least 1.';
      this.requestUpdate();
      return;
    }
    this._editError = null;
    if (this._editIdx !== null) {
      // Update existing
      this.meals[this._editIdx] = { ...this._editForm };
      console.log('[cleverio-schedule-view] Updated meal', this.meals[this._editIdx]);
    } else {
      // Add new
      this.meals.push({ ...this._editForm });
      console.log('[cleverio-schedule-view] Added new meal', this.meals[this.meals.length - 1]);
    }
    this._closeEditDialog();
  }

  _delete(idx: number) {
    this._localMeals.splice(idx, 1);
    this.requestUpdate();
    console.log('[cleverio-schedule-view] _delete', { idx });
  }

  _cancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
    console.log('[cleverio-schedule-view] _cancel');
  }

  _save() {
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: this._localMeals }, bubbles: true, composed: true }));
    console.log('[cleverio-schedule-view] _save', { meals: this._localMeals });
  }
}
