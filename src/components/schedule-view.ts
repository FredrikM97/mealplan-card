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
 * Schedule view component
 * Emits: 'schedule-closed' when dialog closes
 */
@customElement('schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Object }) mealState!: MealStateController;
  @property({ type: Object }) hass: any;

  @state() private draftMeals: FeedingTime[] = [];
  @state() private editMeal: { meal: FeedingTime; index?: number } | null =
    null;

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

  /**
   * Reset draft to match controller's saved meals
   */
  private resetDraft(): void {
    this.draftMeals = [...this.mealState.meals];
  }

  /**
   * Update meal at index
   */
  private updateMeal(index: number, meal: FeedingTime): void {
    this.draftMeals = this.draftMeals.map((m, i) => (i === index ? meal : m));
  }

  /**
   * Add new meal to draft
   */
  private addMeal(meal: FeedingTime): void {
    this.draftMeals = [...this.draftMeals, meal];
  }

  /**
   * Remove meal at index
   */
  private removeMeal(index: number): void {
    this.draftMeals = this.draftMeals.filter((_, i) => i !== index);
  }

  /**
   * Check if profile supports a specific field
   */
  private hasField(field: ProfileField): boolean {
    return this.mealState.profile?.fields.includes(field) ?? false;
  }

  private handleOpenEdit(idx: number) {
    this.editMeal = { meal: this.draftMeals[idx], index: idx };
  }

  private handleOpenAdd() {
    this.editMeal = {
      meal: { hour: 12, minute: 0, portion: 1, days: 127, enabled: 1 },
    };
  }

  private handleDelete(idx: number) {
    this.removeMeal(idx);
  }

  private async handleCancel() {
    this.resetDraft();
    this.dispatchEvent(new ScheduleClosedEvent(true));
  }

  private async handleSave() {
    await this.mealState.saveMeals(this.draftMeals);
    this.dispatchEvent(new ScheduleClosedEvent(false));
  }

  private handleEditSave(
    e: CustomEvent<{ meal: FeedingTime; index?: number }>,
  ) {
    const { meal, index } = e.detail;

    if (index !== undefined && index >= 0) {
      // Update existing meal
      this.updateMeal(index, meal);
    } else {
      // Add new meal
      this.addMeal(meal);
    }

    this.editMeal = null;
  }

  private handleToggleEnabled(idx: number, e: Event) {
    const target = e.target as HTMLInputElement | null;
    const checked =
      target && typeof target.checked === 'boolean' ? target.checked : false;

    this.updateMeal(idx, { ...this.draftMeals[idx], enabled: checked ? 1 : 0 });
  }

  private buildColumns() {
    if (!this.mealState.profile) return {};

    const columns: any = {};

    columns.time = {
      title: localize('time'),
      sortable: true,
      minWidth: '80px',
      valueColumn: 'hourMinute',
      template: (row: any) => formatHourMinute(row.hour, row.minute),
    };

    if (this.hasField(ProfileField.PORTION)) {
      columns.portion = {
        title: localize('portion'),
        sortable: true,
        minWidth: '80px',
      };
    }

    if (this.hasField(ProfileField.DAYS)) {
      columns.days = {
        title: localize('days'),
        sortable: false,
        minWidth: '130px',
        template: (row: any) =>
          renderDaySelector({
            days: row.days,
            editable: false,
            firstDay: this.mealState.profile!.firstDay,
          }),
      };
    }

    if (this.hasField(ProfileField.ENABLED)) {
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
      template: (row: any) => this.renderActions(row),
    };

    return columns;
  }

  /**
   * Render action buttons for a row
   */
  private renderActions(row: any) {
    return html`
      <ha-icon-button
        @click=${() => this.handleOpenEdit(row._idx)}
        title="Edit"
      >
        <ha-icon icon="mdi:pencil"></ha-icon>
      </ha-icon-button>
      ${this.hasField(ProfileField.DELETE)
        ? html`
            <ha-icon-button
              @click=${() => this.handleDelete(row._idx)}
              title="Delete"
            >
              <ha-icon icon="mdi:delete"></ha-icon>
            </ha-icon-button>
          `
        : ''}
    `;
  }

  private buildRows() {
    return this.draftMeals.map((m, i) => ({
      ...m,
      _idx: i,
      hourMinute: (m.hour ?? 0) * 60 + (m.minute ?? 0),
    }));
  }

  private hasPendingChanges(): boolean {
    return (
      JSON.stringify(this.draftMeals) !== JSON.stringify(this.mealState.meals)
    );
  }

  /**
   * Render the main dialog content (either table or edit form)
   */
  private renderDialogContent(isEditing: boolean) {
    if (isEditing && this.editMeal) {
      return html`
        <meal-edit-dialog
          .meal=${this.editMeal.meal}
          .index=${this.editMeal.index}
          .profile=${this.mealState.profile}
          .open=${true}
          @save=${this.handleEditSave}
          @cancel=${() => (this.editMeal = null)}
        ></meal-edit-dialog>
      `;
    }

    const columns = this.buildColumns();
    const rows = this.buildRows();

    return html`
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
    `;
  }

  /**
   * Render dialog action buttons
   */
  private renderDialogActions(isEditing: boolean) {
    if (isEditing) {
      return html`
        <ha-button slot="secondaryAction" @click=${() => (this.editMeal = null)}
          >${localize('back')}</ha-button
        >
        <ha-button
          slot="primaryAction"
          class="ha-primary"
          @click=${() => {
            const dialog = this.shadowRoot?.querySelector(
              'meal-edit-dialog',
            ) as any;
            dialog?.handleSave();
          }}
          >${localize('save')}</ha-button
        >
      `;
    }

    return html`
      ${this.hasField(ProfileField.ADD)
        ? html`<ha-button slot="secondaryAction" @click=${this.handleOpenAdd}
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
        ?disabled=${!this.hasPendingChanges()}
        >${localize('save')}</ha-button
      >
    `;
  }

  render() {
    if (!this.mealState?.profile) {
      return html``;
    }

    // Initialize draft if empty
    if (this.draftMeals.length === 0 && this.mealState.meals.length > 0) {
      this.resetDraft();
    }

    const isEditing = this.editMeal !== null;

    return html`
      <ha-dialog
        open
        scrimClickAction
        heading=${isEditing
          ? localize('edit_feeding_time')
          : localize('manage_schedules')}
      >
        ${this.renderDialogContent(isEditing)}
        ${this.renderDialogActions(isEditing)}
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-view': ScheduleView;
  }
}
