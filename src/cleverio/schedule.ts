import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadHaComponents } from '@kipk/load-ha-components';
import {localize} from './locales/localize';
import './day-selector';
import type { FeedingTime } from './util/mealplan-state';

@customElement('cleverio-schedule-view')
export class ScheduleView extends LitElement {
  private _meals: FeedingTime[] | null = null;

  @property({ type: Array })
  get meals(): FeedingTime[] | null {
    return this._meals;
  }

  set meals(newMeals: FeedingTime[] | null) {
    const oldMeals = this._meals;
    this._meals = newMeals;
    // Allow sync if dialog is not open and (no unsaved changes or _meals is null)
    if (!this.editDialogOpen && (!this._hasUnsavedChanges || oldMeals == null)) {
      this.viewMeals = Array.isArray(newMeals) ? newMeals.map(meal => ({ ...meal })) : [];
      this.requestUpdate('meals', oldMeals);
    }
  }
  @state() private viewMeals: FeedingTime[] = [];
  @state() private editForm: FeedingTime | null = null;
  @state() private editError: string | null = null;
  @state() private editDialogOpen: boolean = false;
  private editIdx: number | null = null;
  @property({ type: Boolean }) accessor haComponentsReady = false;

  constructor() {
    super();
    this.viewMeals = [];
  }

  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback();
    await loadHaComponents(['ha-data-table', 'ha-switch', 'ha-button', 'ha-icon']);
    this.haComponentsReady = true;
  }



  // Helper to check if there are unsaved changes
  private get _hasUnsavedChanges(): boolean {
    // Compare _localMeals and meals deeply
    const a = JSON.stringify(this.viewMeals);
    const b = JSON.stringify(this.meals ?? []);
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
    const checked = (e.target as HTMLInputElement).checked;
    this.viewMeals = this.viewMeals.map((m, i) => i === idx ? { ...m, enabled: checked } : m);
  }

  _openEditDialog(idx: number) {
    this.editDialogOpen = true;
    this.editIdx = idx;
    this.editForm = { ...this.viewMeals[idx] };
    this.editError = null;
  }
  _openAddDialog() {
    this.editDialogOpen = true;
    this.editIdx = null;
    this.editForm = { time: '', portion: 1, daysMask: 0, enabled: true };
    this.editError = null;
  }
  _closeEditDialog() {
    this.editDialogOpen = false;
    this.editForm = null;
  }

  _delete(idx: number) {
    this.viewMeals = this.viewMeals.filter((_, i) => i !== idx);
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  }
  _save() {
    this.dispatchEvent(new CustomEvent('save-schedule', { detail: { meals: this.viewMeals }, bubbles: true, composed: true }));
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
      <ha-dialog open scrimClickAction  heading= ${this.editDialogOpen ? localize('edit_feeding_time') : localize('manage_schedules')}>

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
                  <label for="edit-time">${localize('time')}</label>
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
              <ha-button slot="secondaryAction" @click=${this._closeEditDialog.bind(this)}>${localize('back')}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._onEditSave.bind(this)}>${localize('save')}</ha-button>
            `
          : html`
              <ha-button slot="secondaryAction" @click=${this._openAddDialog.bind(this)}>${localize('add_meal')}</ha-button>
              <ha-button slot="secondaryAction" @click=${this._cancel.bind(this)}>${localize('cancel')}</ha-button>
              <ha-button slot="primaryAction" class="ha-primary" @click=${this._save.bind(this)} ?disabled=${!this._hasUnsavedChanges}>${localize('save')}</ha-button>
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
      return;
    }
    if (!this.editForm.portion || this.editForm.portion < 1) {
      this.editError = 'Portion must be at least 1.';
      return;
    }
    this.editError = null;
    if (this.editIdx !== null) {
      // Update existing
      this.viewMeals = this.viewMeals.map((m, i) => i === this.editIdx ? { ...this.editForm! } : m);
    } else {
      // Add new
      this.viewMeals = [...this.viewMeals, { ...this.editForm! }];
    }
    this._closeEditDialog();
  }
}
