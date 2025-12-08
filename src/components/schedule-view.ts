/**
 * ScheduleView component for managing meal schedules
 * Self-contained LitElement component with internal state
 */

import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { renderDaySelector } from '../day-selector.js';
import { localize } from '../locales/localize.js';
import type { FeedingTime, DeviceProfileGroup } from '../types.js';
import { ProfileField } from '../types.js';
import { MealStateController } from '../mealStateController.js';
import './edit-dialog.js';

/**
 * Event for when schedule dialog closes
 */
class ScheduleClosedEvent extends CustomEvent<void> {
  constructor(cancelled: boolean = false) {
    super('schedule-closed', {
      detail: undefined,
      bubbles: true,
      composed: true,
    });
  }
}

// Declare event type for type checking
declare global {
  interface HTMLElementEventMap {
    'schedule-closed': ScheduleClosedEvent;
  }
}

/**
 * Format hour and minute as HH:MM string
 */
export function formatHourMinute(hour?: number, minute?: number): string {
  if (
    typeof hour !== 'number' ||
    isNaN(hour) ||
    typeof minute !== 'number' ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  )
    return '--:--';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

/**
 * Validate a feeding time entry
 */
export function validateFeedingTime(
  entry: Partial<FeedingTime>,
): string | null {
  if (
    typeof entry.hour !== 'number' ||
    typeof entry.minute !== 'number' ||
    isNaN(entry.hour) ||
    isNaN(entry.minute) ||
    entry.hour < 0 ||
    entry.hour > 23 ||
    entry.minute < 0 ||
    entry.minute > 59
  ) {
    return 'Please enter a valid time.';
  }
  if (!entry.portion || entry.portion < 1) {
    return 'Portion must be at least 1.';
  }
  return null;
}

/**
 * Schedule view component
 * Emits: 'schedule-closed' when dialog closes
 */
/**
 * Edit state for meal dialog
 */
interface EditState {
  index?: number;
  meal: FeedingTime;
  error: string | null;
}

@customElement('schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Object }) mealState!: MealStateController;
  @property({ type: Object }) profile!: DeviceProfileGroup;
  @property({ type: Object }) hass: any;
  @property({ type: Array }) meals!: FeedingTime[];

  @state() private editState: EditState | null = null;

  static styles = css`
    .schedule-table-wrapper {
      width: 100%;
      box-sizing: border-box;
      overflow-x: auto;
    }
    .error {
      color: var(--error-color, red);
      font-size: 0.9em;
      margin: 8px 0;
    }
  `;

  private handleOpenEdit(idx: number) {
    this.editState = {
      index: idx,
      meal: { ...this.meals[idx] },
      error: null,
    };
  }

  private handleOpenAdd() {
    this.editState = {
      index: undefined,
      meal: {
        hour: 12,
        minute: 0,
        portion: 1,
        days: 127,
        enabled: 1,
      },
      error: null,
    };
  }

  private handleDelete(idx: number) {
    const updatedMeals = this.meals.filter((_, i) => i !== idx);
    this.mealState.setMeals(updatedMeals);
    this.editState = null;
  }

  private async handleCancel() {
    this.mealState.resetToSaved();
    this.dispatchEvent(new ScheduleClosedEvent(true));
  }

  private async handleSave() {
    await this.mealState.saveMeals();
    this.dispatchEvent(new ScheduleClosedEvent(false));
  }

  private handleEditSave(e: CustomEvent) {
    if (!this.editState) return;

    const mealData = e.detail;
    const validationError = validateFeedingTime(mealData);

    if (validationError) {
      this.editState = { ...this.editState, error: validationError };
      return;
    }

    let updatedMeals: FeedingTime[];
    if (this.editState.index !== undefined && this.editState.index >= 0) {
      // Update existing meal
      updatedMeals = this.meals.map((m, i) =>
        i === this.editState!.index ? { ...mealData } : m,
      );
    } else {
      // Add new meal
      updatedMeals = [...this.meals, { ...mealData }];
    }

    this.mealState.setMeals(updatedMeals);
    this.editState = null;
  }

  private handleToggleEnabled(idx: number, e: Event) {
    const target = e.target as HTMLInputElement | null;
    const checked =
      target && typeof target.checked === 'boolean' ? target.checked : false;

    const updatedMeals = this.meals.map((m, i) =>
      i === idx ? { ...m, enabled: checked ? 1 : 0 } : m,
    );

    this.mealState.setMeals(updatedMeals);
  }

  private buildColumns() {
    if (!this.profile) return {};

    const fields = this.profile.fields || [];
    const columns: any = {};

    columns.time = {
      title: localize('time'),
      sortable: true,
      minWidth: '80px',
      valueColumn: 'hourMinute',
      template: (row: any) => formatHourMinute(row.hour, row.minute),
    };

    if (fields.includes(ProfileField.PORTION)) {
      columns.portion = {
        title: localize('portion'),
        sortable: true,
        minWidth: '80px',
      };
    }

    if (fields.includes(ProfileField.DAYS)) {
      columns.days = {
        title: localize('days'),
        sortable: false,
        minWidth: '130px',
        template: (row: any) =>
          renderDaySelector({
            days: row.days,
            editable: false,
            firstDay: this.profile!.firstDay,
          }),
      };
    }

    if (fields.includes(ProfileField.ENABLED)) {
      columns.enabled = {
        title: localize('enabled'),
        sortable: true,
        minWidth: '60px',
        template: (row: any) => html`
          <div
            style="display: flex; align-items: center; justify-content: center; height: 48px;"
          >
            <ha-switch
              .checked=${!!row.enabled}
              @change=${(e: Event) => this.handleToggleEnabled(row._idx, e)}
              title="Enable/disable schedule"
            ></ha-switch>
          </div>
        `,
      };
    }

    columns.actions = {
      title: localize('actions'),
      sortable: false,
      minWidth: '140px',
      template: (row: any) => html`
        <ha-icon-button
          @click=${() => this.handleOpenEdit(row._idx)}
          title="Edit"
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </ha-icon-button>
        ${fields.includes(ProfileField.DELETE)
          ? html`
              <ha-icon-button
                @click=${() => this.handleDelete(row._idx)}
                title="Delete"
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </ha-icon-button>
            `
          : ''}
      `,
    };

    return columns;
  }

  private buildRows() {
    return this.meals.map((m, i) => ({
      ...m,
      _idx: i,
      hourMinute: (m.hour ?? 0) * 60 + (m.minute ?? 0),
    }));
  }

  render() {
    if (!this.profile) {
      return html``;
    }

    const columns = this.buildColumns();
    const rows = this.buildRows();
    const fields = this.profile.fields || [];

    return html`
      <ha-dialog
        open
        scrimClickAction
        heading=${this.editState
          ? localize('edit_feeding_time')
          : localize('manage_schedules')}
      >
        ${this.editState
          ? html`
              <meal-edit-dialog
                .meal=${this.editState.meal}
                .profile=${this.profile}
                .open=${true}
                .error=${this.editState.error}
                @save=${this.handleEditSave}
                @cancel=${() => (this.editState = null)}
              ></meal-edit-dialog>
            `
          : html`
              <div class="schedule-table-wrapper">
                <ha-data-table
                  .localizeFunc=${localize}
                  .columns=${columns}
                  .hass=${this.hass}
                  .data=${rows}
                  class="schedule-table-style"
                  auto-height
                ></ha-data-table>
              </div>
            `}
        ${this.editState
          ? html`
              <ha-button
                slot="secondaryAction"
                @click=${() => (this.editState = null)}
                >${localize('back')}</ha-button
              >
              <ha-button
                slot="primaryAction"
                class="ha-primary"
                @click=${() => {
                  const dialog =
                    this.shadowRoot?.querySelector('meal-edit-dialog');
                  if (dialog) {
                    (dialog as any).handleSave();
                  }
                }}
                >${localize('save')}</ha-button
              >
            `
          : html`
              ${fields.includes(ProfileField.ADD)
                ? html`<ha-button
                    slot="secondaryAction"
                    @click=${this.handleOpenAdd}
                    >${localize('add_meal')}</ha-button
                  >`
                : ''}
              <ha-button slot="secondaryAction" @click=${this.handleCancel}
                >${localize('cancel')}</ha-button
              >
              <ha-button
                slot="primaryAction"
                class="ha-primary"
                @click=${this.handleSave}
                ?disabled=${!this.mealState.hasPendingChanges()}
                >${localize('save')}</ha-button
              >
            `}
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-view': ScheduleView;
  }
}
