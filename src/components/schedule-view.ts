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
import { hasProfileField, timeToMinutes, areMealsEqual } from '../utils';
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
  @state() private dataAvailable = true;

  private unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    // Initialize draft from current meals (sorted by time)
    this.draftMeals = this.sortMealsByTime([...this.mealState.meals]);

    this.mealState.isDataAvailable().then((available) => {
      this.dataAvailable = available;
    });

    // Subscribe to meals changes from MealStateController
    this.unsubscribe = this.mealState.subscribe(() => {
      this.syncMealsWithController();
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

  /**
   * Render meal list for inline display (no dialog wrapper, no save button)
   */
  static styles = css`
    .schedule-cards {
      display: block;
      overflow-y: auto;
      padding: 8px 0;
    }
    .inline-schedules {
      padding: 0 16px 8px 16px;
    }
    .card-actions {
      padding: 8px 0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
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
    ha-button.delete-action {
      --mdc-theme-primary: var(--error-color, #db4437);
      margin-inline-end: auto;
    }
  `;

  /**
   * Reset draft to match controller's saved meals
   */
  private syncMealsWithController(): void {
    this.draftMeals = this.sortMealsByTime([...this.mealState.meals]);
  }

  private updateMeal(index: number, meal: FeedingTime): void {
    this.draftMeals = this.sortMealsByTime(
      this.draftMeals.map((m, i) => (i === index ? meal : m)),
    );
  }
  public getMeals(): FeedingTime[] {
    return this.draftMeals;
  }

  public getEditMeals(): EditMealState | null {
    return this.editMeal;
  }
  /**
   * Unified handler for meal actions from meal-card
   */
  public handleMealAction(
    action: 'update' | 'delete' | 'edit',
    index: number,
    meal: FeedingTime,
  ): void {
    if (action === 'update') {
      this.draftMeals = this.draftMeals.map((m, i) => (i === index ? meal : m));
    } else if (action === 'delete') {
      this.draftMeals = this.draftMeals.filter((_, i) => i !== index);
    } else if (action === 'edit') {
      this.editMeal = { meal, index };
    }
  }

  /**
   * Add new meal to draft
   */
  public addMeal(meal: FeedingTime): void {
    this.draftMeals = this.sortMealsByTime([...this.draftMeals, meal]);
  }

  public handleOpenAdd() {
    this.editMeal = {
      meal: { hour: 12, minute: 0, portion: 1, days: 127, enabled: 1 },
    } satisfies EditMealState;
  }

  public async handleCancel() {
    this.syncMealsWithController();
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  public async handleSave() {
    await this.mealState.saveMeals(this.draftMeals);
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  public handleEditSave(e: CustomEvent<EditMealState>) {
    const { meal, index } = e.detail;

    if (index !== undefined && index >= 0) {
      this.updateMeal(index, meal);
    } else {
      this.addMeal(meal);
    }

    this.editMeal = null;
  }

  private handleDeleteFromEdit(): void {
    if (this.editMeal?.index === undefined) return;
    this.draftMeals = this.draftMeals.filter(
      (_, i) => i !== this.editMeal!.index,
    );
    this.editMeal = null;
  }

  private hasPendingChanges(): boolean {
    return !areMealsEqual(this.draftMeals, this.mealState.meals);
  }

  /**
   * Triggers save on the meal-edit-dialog element
   */
  private triggerSave() {
    const dialog = this.shadowRoot?.querySelector(
      'meal-edit-dialog',
    ) as MealEditDialog | null;
    dialog?.handleSave();
  }

  /**
   * Render the edit form as inline content — no nested dialog.
   * Reuses the existing dialog wrapper (from main.ts) or renders inline on card.
   */
  private renderEditView() {
    const isEditing = this.editMeal!.index !== undefined;

    return html`
      <meal-edit-dialog
        .meal=${this.editMeal!.meal}
        .index=${this.editMeal!.index}
        .profile=${this.mealState.profile}
        .open=${true}
        @save=${this.handleEditSave}
      ></meal-edit-dialog>
      <ha-dialog-footer slot="footer">
        ${
          isEditing
            ? html`
                <ha-button
                  slot="secondaryAction"
                  class="delete-action"
                  @click=${this.handleDeleteFromEdit}
                >
                  <ha-icon icon="mdi:delete" slot="icon"></ha-icon>
                  ${localize('common.delete')}
                </ha-button>
              `
            : ''
        }
        <ha-button
          slot="secondaryAction"
          @click=${() => {
            this.editMeal = null;
          }}
        >
          ${localize('common.cancel')}
        </ha-button>
        <ha-button slot="primaryAction" @click=${this.triggerSave}>
          ${localize('common.save')}
        </ha-button>
      </ha-dialog-footer>
    `;
  }

  /**
   * Render empty state when no meals exist
   */
  private renderEmptyState() {
    return html`
      <div class="empty-state">
        <ha-icon icon="mdi:calendar-blank"></ha-icon>
        <div class="empty-state-title">
          ${localize('schedule_view.no_meals_scheduled')}
        </div>
        <div class="empty-state-subtitle">
          ${localize('schedule_view.click_add_meal_to_get_started')}
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
      <ha-button
        slot="secondaryAction"
        appearance="plain"
        @click=${this.handleOpenAdd}
      >
        ${localize('common.add_meal')}
      </ha-button>
    `;
  }

  /**
   * Render card-based view
   */
  private renderCardView() {
    if (!this.mealState.profile) return '';

    return html`
      <message-banner
        .type=${'warning'}
        .title=${localize('schedule_view.sensor_unavailable')}
        .message=${localize('schedule_view.sensor_unavailable_message')}
        ?hidden=${this.dataAvailable}
      ></message-banner>
      <div class="schedule-cards">
        ${
          this.draftMeals.length === 0
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
              )
        }
      </div>
      <ha-dialog-footer slot="footer">
        ${this.renderAddButton()}
        <ha-button
          slot="secondaryAction"
          appearance="plain"
          @click=${this.handleCancel}
        >
          ${localize('common.cancel')}
        </ha-button>
        <ha-button
          slot="primaryAction"
          @click=${this.handleSave}
          ?disabled=${!this.hasPendingChanges() || !this.dataAvailable}
        >
          ${localize('common.save')}
        </ha-button>
      </ha-dialog-footer>
    `;
  }

  render() {
    if (this.editMeal) {
      return this.renderEditView();
    }
    return html`
      <meal-message-display></meal-message-display>
      ${this.renderCardView()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-view': ScheduleView;
  }
}
