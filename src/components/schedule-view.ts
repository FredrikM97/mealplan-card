/**
 * ScheduleView component for managing meal schedules
 * Self-contained LitElement component with internal state
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { localize } from '../locales/localize';
import type { FeedingTime, EditMealState } from '../types';
import { ProfileField } from '../types';
import { MealStateController } from '../mealStateController';
import { hasProfileField } from '../utils';
import {
  ScheduleClosedEvent,
  MealMessageEvent,
  MESSAGE_TYPE_ERROR,
} from '../constants';
import './edit-dialog';
import './meal-card';

/**
 * Schedule view component
 * Emits: 'schedule-closed' when dialog closes
 */
@customElement('schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Object }) mealState!: MealStateController;
  @property({ type: Object }) hass: any;

  @state() private draftMeals: FeedingTime[] = [];
  @state() private editMeal: EditMealState | null = null;
  @state() private heading: string = localize('manage_schedules');

  static styles = css`
    .schedule-cards {
      display: block;
      min-height: 450px;
      padding: 8px 0;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--secondary-text-color);
    }
    .empty-state ha-icon {
      --mdc-icon-size: 48px;
      color: var(--disabled-text-color);
      margin-bottom: 16px;
    }
    .empty-state-title {
      font-size: 1.1em;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .empty-state-subtitle {
      font-size: 0.9em;
    }
    ha-dialog {
      --mdc-dialog-min-width: min(480px, 90vw);
      --mdc-dialog-max-width: 480px;
    }
    @media (max-width: 768px) {
      ha-dialog {
        --mdc-dialog-min-width: 95vw;
        --mdc-dialog-max-width: 95vw;
      }
    }
  `;

  /**
   * Reset draft to match controller's saved meals
   */
  private resetDraft(): void {
    this.draftMeals = [...this.mealState.meals];
  }

  /**
   * Lifecycle: sync draft with controller when needed
   */
  protected willUpdate(): void {
    if (this.draftMeals.length === 0 && this.mealState?.meals.length > 0) {
      this.resetDraft();
    }

    // Dispatch error message if no profile
    if (!this.mealState?.profile) {
      this.dispatchEvent(
        new MealMessageEvent(localize('error_no_profile'), MESSAGE_TYPE_ERROR),
      );
    }
  }

  /**
   * Lifecycle: refresh draft when mealState.meals changes (from external updates)
   */
  protected updated(changedProps: Map<string, any>): void {
    super.updated(changedProps);

    // When mealState updates (hass changes trigger updateFromHass), sync draft if no pending edits
    if (
      changedProps.has('mealState') &&
      this.mealState &&
      !this.hasPendingChanges()
    ) {
      this.resetDraft();
    }
  }
  private updateMeal(index: number, meal: FeedingTime): void {
    this.draftMeals = this.draftMeals.map((m, i) => (i === index ? meal : m));
  }

  /**
   * Unified handler for meal actions from meal-card
   */
  handleMealAction(
    action: 'update' | 'delete' | 'edit',
    index: number,
    meal: FeedingTime,
  ): void {
    if (action === 'update') {
      this.draftMeals = this.draftMeals.map((m, i) => (i === index ? meal : m));
    } else if (action === 'delete') {
      this.draftMeals = this.draftMeals.filter((_, i) => i !== index);
    } else if (action === 'edit') {
      this.heading = localize('edit_feeding_time');
      this.editMeal = { meal, index };
    }
  }

  /**
   * Add new meal to draft
   */
  private addMeal(meal: FeedingTime): void {
    this.draftMeals = [...this.draftMeals, meal];
  }

  private handleOpenAdd() {
    this.heading = localize('add_meal');
    this.editMeal = {
      meal: { hour: 12, minute: 0, portion: 1, days: 127, enabled: 1 },
    } satisfies EditMealState;
  }

  private async handleCancel() {
    this.resetDraft();
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  private async handleSave() {
    await this.mealState.saveMeals(this.draftMeals);
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  private handleEditSave(e: CustomEvent<EditMealState>) {
    const { meal, index } = e.detail;

    if (index !== undefined && index >= 0) {
      // Update existing meal
      this.updateMeal(index, meal);
    } else {
      // Add new meal
      this.addMeal(meal);
    }

    this.closeEditForm();
  }

  private closeEditForm() {
    this.heading = localize('manage_schedules');
    this.editMeal = null;
  }

  private hasPendingChanges(): boolean {
    return (
      JSON.stringify(this.draftMeals) !== JSON.stringify(this.mealState.meals)
    );
  }

  /**
   * Render meal form (for adding or editing)
   */
  private renderMealForm() {
    if (this.editMeal === null) return '';

    return html`
      <div>
        <meal-edit-dialog
          .meal=${this.editMeal.meal}
          .index=${this.editMeal.index}
          .profile=${this.mealState.profile}
          .open=${true}
          @save=${this.handleEditSave}
          @cancel=${this.closeEditForm}
        ></meal-edit-dialog>
      </div>
      <ha-button slot="secondaryAction" @click=${this.closeEditForm}>
        ${localize('back')}
      </ha-button>
      <ha-button
        slot="primaryAction"
        class="ha-primary"
        @click=${() => {
          const dialog = this.shadowRoot?.querySelector(
            'meal-edit-dialog',
          ) as any;
          dialog?.handleSave();
        }}
      >
        ${localize('save')}
      </ha-button>
    `;
  }

  /**
   * Render empty state when no meals exist
   */
  private renderEmptyState() {
    return html`
      <div class="empty-state">
        <ha-icon icon="mdi:calendar-blank"></ha-icon>
        <div class="empty-state-title">${localize('no_meals_scheduled')}</div>
        <div class="empty-state-subtitle">
          ${localize('click_add_meal_to_get_started')}
        </div>
      </div>
    `;
  }

  /**
   * Render Add Meal button if profile allows it
   */
  private renderAddButton() {
    if (!hasProfileField(this.mealState.profile, ProfileField.ADD)) return '';

    return html`
      <ha-button slot="secondaryAction" @click=${this.handleOpenAdd}>
        ${localize('add_meal')}
      </ha-button>
    `;
  }

  /**
   * Render card-based view
   */
  private renderCardView() {
    if (this.editMeal !== null) return '';
    if (!this.mealState.profile) return '';

    return html`
      <div class="schedule-cards">
        ${this.draftMeals.length === 0
          ? this.renderEmptyState()
          : this.draftMeals.map(
              (meal, index) => html`
                <meal-card
                  .meal=${meal}
                  .index=${index}
                  .profile=${this.mealState.profile}
                  .onMealAction=${this.handleMealAction.bind(this)}
                >
                </meal-card>
              `,
            )}
      </div>
      ${this.renderAddButton()}
      <ha-button slot="secondaryAction" @click=${this.handleCancel}>
        ${localize('cancel')}
      </ha-button>
      <ha-button
        slot="primaryAction"
        class="ha-primary"
        @click=${this.handleSave}
        ?disabled=${!this.hasPendingChanges()}
      >
        ${localize('save')}
      </ha-button>
    `;
  }

  render() {
    return html`
      <ha-dialog open scrimClickAction heading=${this.heading}>
        <meal-message-display></meal-message-display>
        ${this.renderCardView()} ${this.renderMealForm()}
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-view': ScheduleView;
  }
}
