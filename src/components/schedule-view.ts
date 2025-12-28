/**
 * ScheduleView component for managing meal schedules
 * Self-contained LitElement component with internal state
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { localize } from '../locales/localize';
import type { FeedingTime, EditMealState, HomeAssistant } from '../types';
import { ProfileField } from '../types';
import { MealStateController } from '../mealStateController';
import { hasProfileField, timeToMinutes } from '../utils';
import { ScheduleClosedEvent } from '../constants';
import './edit-dialog';
import type { MealEditDialog } from './edit-dialog';
import './meal-card';
import './message-banner';

/**
 * Schedule view component
 * Emits: 'schedule-closed' when dialog closes
 */
@customElement('schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Object }) mealState!: MealStateController;
  @property({ type: Object }) hass!: HomeAssistant;

  @state() private draftMeals: FeedingTime[] = [];
  @state() private editMeal: EditMealState | null = null;
  @state() private heading: string = localize('manage_schedules');

  private unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    // Initialize draft from current meals (sorted by time)
    this.draftMeals = this.sortMealsByTime([...this.mealState.meals]);

    // Subscribe to meals changes from MealStateController
    this.unsubscribe = this.mealState.subscribe(() => {
      this.resetDraft();
    });
  }

  /**
   * Sort meals by time (hour, then minute)
   */
  private sortMealsByTime(meals: FeedingTime[]): FeedingTime[] {
    return [...meals].sort(
      (a, b) =>
        timeToMinutes(a.hour, a.minute) - timeToMinutes(b.hour, b.minute),
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  static styles = css`
    .schedule-cards {
      display: block;
      max-height: 330px;
      overflow-y: auto;
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
    this.draftMeals = this.sortMealsByTime([...this.mealState.meals]);
  }

  private updateMeal(index: number, meal: FeedingTime): void {
    this.draftMeals = this.sortMealsByTime(
      this.draftMeals.map((m, i) => (i === index ? meal : m)),
    );
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
    this.draftMeals = this.sortMealsByTime([...this.draftMeals, meal]);
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
   * Check if the sensor is available (not unknown or unavailable)
   */
  private isSensorAvailable(): boolean {
    const sensorEntity = this.hass?.states?.[this.mealState.config.sensor];
    if (!sensorEntity) return false;
    const state = sensorEntity.state;
    return state !== 'unknown' && state !== 'unavailable';
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
          const dialog =
            this.shadowRoot?.querySelector<MealEditDialog>('meal-edit-dialog');
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

    const sensorAvailable = this.isSensorAvailable();

    return html`
      <message-banner
        .type=${'warning'}
        .title=${localize('sensor_unavailable')}
        .message=${localize('sensor_unavailable_message')}
        ?hidden=${sensorAvailable}
      ></message-banner>
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
        ?disabled=${!this.hasPendingChanges() || !sensorAvailable}
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
