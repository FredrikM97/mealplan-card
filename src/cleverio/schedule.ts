import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadHaComponents } from '@kipk/load-ha-components';
import {localize} from './locales/localize';
import './edit';
import './day-selector';
import type { FeedingTime } from './util/mealplan-state';

@customElement('cleverio-schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Array }) accessor meals: FeedingTime[] = [];
  @state() private viewMeals: FeedingTime[] = [];
  @state() private editForm: FeedingTime | null = null;
  @state() private editError: string | null = null;
  @state() private editDialogOpen: boolean = false;
  private editIdx: number | null = null;
  @property({ type: Boolean }) accessor haComponentsReady = false;

  constructor() {
    super();
    this.meals = [];
    this.viewMeals = [];
  }

  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback();
    await loadHaComponents(['ha-data-table', 'ha-switch', 'ha-button', 'ha-icon']);
    this.haComponentsReady = true;
  }

  // Watch for changes in meals
  updated(changed: PropertyValues) {
    if (changed.has('meals')) {
      this.viewMeals = this.meals.map(m => ({ ...m }));
      this.editDialogOpen = false;
    }
  }

  // Helper to check if there are unsaved changes
  private get _hasUnsavedChanges(): boolean {
    // Compare _localMeals and meals deeply
    const a = JSON.stringify(this.viewMeals);
    const b = JSON.stringify(this.meals);
    return a !== b;
  }

  static styles = [
    css`
      ha-dialog {
        min-width: unset !important;
        width: 100vw !important;
        max-width: 100vw !important;
        box-sizing: border-box;
      }
      .schedule-table-wrapper {
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
      }
      .edit-mode .days-row {
        justify-content: center;
        margin: 0 auto;
        gap: 8px;
      }
      .edit-mode .day-cell {
        width: 2.6em;
        height: 2.6em;
        line-height: 2.6em;
        font-size: 1.25em;
        margin: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
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

  _toggleEnabled(idx: number, e: Event) {
    this.viewMeals[idx].enabled = (e.target as HTMLInputElement).checked;
    this.requestUpdate();
  }

  _openEditDialog(idx: number) {
    this.editDialogOpen = true;
    this.editIdx = idx;
    this.viewMeals = this.meals.map(m => ({ ...m }));
    this.editForm = { ...this.viewMeals[idx] };
    this.editError = null;
    this.requestUpdate();
  }
  _openAddDialog() {
    this.editDialogOpen = true;
    this.editIdx = null;
    this.viewMeals = this.meals.map(m => ({ ...m }));
    this.editForm = { time: '', portion: 1, daysMask: 0, enabled: true };
    this.editError = null;
    this.requestUpdate();
  }
  _closeEditDialog() {
    this.editDialogOpen = false;
    this.editForm = null;
    this.requestUpdate();
  }

  _delete(idx: number) {
    this.viewMeals.splice(idx, 1);
    this.requestUpdate();
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  }
  _save() {
    this.meals = this.viewMeals.map(m => ({ ...m }));
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: this.viewMeals }, bubbles: true, composed: true }));
  }

  render() {
    if (!this.haComponentsReady) {
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
          <cleverio-day-selector
            .selectedDaysMask=${row.daysMask}
            .editable=${false}
          ></cleverio-day-selector>
        `
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
    const rows = this.viewMeals.map((m, i) => ({ ...m, _idx: i }));
    const predefinedTimes = ['06:00', '08:00', '12:00', '15:00', '18:00', '21:00'];
    return html`
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? 'Edit Feeding Time' : localize('manage_schedules')}>
      
        ${this.editDialogOpen
          ? html`
              <form class="edit-form" @submit=${(e: Event) => e.preventDefault()}>
                ${this.editError ? html`<div class="error">${this.editError}</div>` : ''}
                <cleverio-day-selector
                  class="edit-mode"
                  .selectedDaysMask=${this.editForm?.daysMask ?? 0}
                  .editable=${true}
                  @days-changed=${(e: CustomEvent) => { this.editForm!.daysMask = e.detail.daysMask; this.requestUpdate(); }}
                ></cleverio-day-selector>
                <div class="edit-form-group">
                  <label for="edit-time">Time</label>
                  <input
                    id="edit-time"
                    class="edit-time"
                    type="time"
                    .value=${this.editForm?.time ?? ''}
                    @input=${(e: Event) => { this.editForm!.time = (e.target as HTMLInputElement).value; this.requestUpdate(); }}
                  />
                </div>
                <div class="edit-form-group">
                  <label for="edit-portion">Portion</label>
                  <input
                    id="edit-portion"
                    type="number"
                    min="1"
                    .value=${this.editForm?.portion ?? 1}
                    @input=${(e: Event) => { this.editForm!.portion = parseInt((e.target as HTMLInputElement).value, 10); this.requestUpdate(); }}
                  />
                  <div class="helper">1 portion = 6 grams</div>
                </div>
                <div class="edit-predefined-times">
                  ${predefinedTimes.map(time => html`
                    <ha-button type="button" @click=${() => { this.editForm!.time = time; this.requestUpdate(); }}>${time}</ha-button>
                  `)}
                </div>
              </form>
            `
          : html`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${localize}
                  .columns=${columns}
                  .data=${rows}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editDialogOpen
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

  _onEditSave(e?: Event) {
    if (e) e.preventDefault();
    if (!this.editForm) return;
    // Validation
    if (!this.editForm.time || !/^[0-2]\d:[0-5]\d$/.test(this.editForm.time)) {
      this.editError = 'Please enter a valid time.';
      this.requestUpdate();
      return;
    }
    if (!this.editForm.portion || this.editForm.portion < 1) {
      this.editError = 'Portion must be at least 1.';
      this.requestUpdate();
      return;
    }
    this.editError = null;
    if (this.editIdx !== null) {
      // Update existing
      this.viewMeals[this.editIdx] = { ...this.editForm };
    } else {
      // Add new
      this.viewMeals.push({ ...this.editForm });
    }
    this.requestUpdate();
    this._closeEditDialog();
  }
}
