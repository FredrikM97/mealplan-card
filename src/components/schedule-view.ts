/**
 * ScheduleView component for managing meal schedules
 * Self-contained LitElement component with internal state
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { localize } from '../locales/localize';
import type { FeedingTime, EditMealState, HomeAssistant } from '../types';
import { ProfileField } from '../types';
import { MealStateController } from '../mealStateController';
import { hasProfileField, timeToMinutes, areMealsEqual } from '../utils';
import { ScheduleClosedEvent } from '../constants';
import './edit-dialog';
import './dialog-shell';
import type { DialogAction, MealDialogShell } from './dialog-shell';
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
  @query('meal-dialog-shell') private dialogShell?: MealDialogShell;

  @state() private draftMeals: FeedingTime[] = [];
  @state() private editMeal: EditMealState | null = null;
  @state() private heading: string = localize('schedule_view.manage_schedules');
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

  static styles = css`
    .schedule-cards {
      display: block;
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
      this.heading = localize('schedule_view.edit_feeding_time');
      this.editMeal = { meal, index };
      this.dialogShell?.show({ headerTitle: this.heading });
    }
  }

  /**
   * Add new meal to draft
   */
  public addMeal(meal: FeedingTime): void {
    this.draftMeals = this.sortMealsByTime([...this.draftMeals, meal]);
  }

  public handleOpenAdd() {
    this.heading = localize('common.add_meal');
    this.editMeal = {
      meal: { hour: 12, minute: 0, portion: 1, days: 127, enabled: 1 },
    } satisfies EditMealState;
    this.dialogShell?.show({ headerTitle: this.heading });
  }

  public async handleCancel() {
    this.dialogShell?.hide();
    this.syncMealsWithController();
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  public async handleSave() {
    this.dialogShell?.hide();
    await this.mealState.saveMeals(this.draftMeals);
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  private handleEditCancel() {
    this.closeEditForm();
  }

  private handleDialogClosed() {
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  public handleEditSave(e: CustomEvent<EditMealState>) {
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

  private async handleDeleteFromEdit() {
    if (this.editMeal?.index === undefined) return;
    const updatedMeals = this.draftMeals.filter(
      (_, i) => i !== this.editMeal!.index,
    );
    this.draftMeals = updatedMeals;
    await this.mealState.saveMeals(updatedMeals);
    this.closeEditForm();
  }

  private closeEditForm() {
    this.heading = localize('schedule_view.manage_schedules');
    this.editMeal = null;
    this.dialogShell?.setHeaderTitle(this.heading);
  }

  private getFooterActions(): DialogAction[] {
    const actions: DialogAction[] = [];

    if (hasProfileField(this.mealState.profile, ProfileField.ADD)) {
      actions.push({
        id: 'add-meal',
        label: localize('common.add_meal'),
        slot: 'secondaryAction',
        onClick: () => this.handleOpenAdd(),
      });
    }

    actions.push(
      {
        id: 'cancel',
        label: localize('common.cancel'),
        slot: 'secondaryAction',
        onClick: () => {
          void this.handleCancel();
        },
      },
      {
        id: 'save',
        label: localize('common.save'),
        slot: 'primaryAction',
        disabled: !this.hasPendingChanges() || !this.dataAvailable,
        onClick: () => {
          void this.handleSave();
        },
      },
    );

    return actions;
  }

  private hasPendingChanges(): boolean {
    return !areMealsEqual(this.draftMeals, this.mealState.meals);
  }

  /**
   * Render meal form (for adding or editing)
   */
  private renderMealForm() {
    if (this.editMeal === null) return '';

    return html`
      <meal-edit-dialog
        .meal=${this.editMeal.meal}
        .index=${this.editMeal.index}
        .profile=${this.mealState.profile}
        @save=${this.handleEditSave}
        @cancel=${this.handleEditCancel}
        @delete-meal=${this.handleDeleteFromEdit}
      ></meal-edit-dialog>
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
   * Render card-based view
   */
  private renderCardView() {
    if (this.editMeal !== null) return '';
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
    `;
  }

  render() {
    return html`
      <meal-dialog-shell
        .headerTitle=${this.heading}
        .actions=${this.getFooterActions()}
        @closed=${this.handleDialogClosed}
      >
        <meal-message-display></meal-message-display>
        ${this.renderCardView()} ${this.renderMealForm()}
      </meal-dialog-shell>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-view': ScheduleView;
  }
}
