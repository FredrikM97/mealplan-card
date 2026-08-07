/**
 * ScheduleView component for managing meal schedules
 * Self-contained LitElement component with internal state
 */

import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { localize } from '../locales/localize';
import type { FeedingTime, EditMealState, HomeAssistant } from '../types';
import { ProfileField } from '../types';
import { MealStateController } from '../mealStateController';
import { hasProfileField, timeToMinutes, areMealsEqual } from '../utils';
import { ScheduleClosedEvent } from '../constants';
import type { DialogAction } from './dialog-shell';
import './dialog-shell';
import './edit-dialog';
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

  private get isInlineMode(): boolean {
    return !!this.mealState?.config?.show_schedules;
  }

  private get isWrappedInDialogShell(): boolean {
    return this.closest('meal-dialog-shell') !== null;
  }

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

    this.addEventListener('footer-action', this.onFooterAction);
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
    this.removeEventListener('footer-action', this.onFooterAction);
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private readonly onFooterAction = (e: Event) => {
    const customEvent = e as CustomEvent<{ id: string }>;
    this.handleFooterActionId(customEvent.detail.id);
  };

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (
      changedProperties.has('editMeal') ||
      changedProperties.has('draftMeals') ||
      changedProperties.has('dataAvailable')
    ) {
      this.dispatchEvent(
        new CustomEvent('footer-actions-changed', {
          detail: undefined,
          bubbles: true,
          composed: true,
        }),
      );
    }
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
    if (this.isInlineMode) {
      return;
    }
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  public async handleSave() {
    await this.mealState.saveMeals(this.draftMeals);
    if (this.isInlineMode) {
      return;
    }
    this.dispatchEvent(new ScheduleClosedEvent());
  }

  private handleEditCancel() {
    this.closeEditForm();
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
    this.editMeal = null;
  }

  public get footerActions(): DialogAction[] {
    // When embedded in a parent dialog, reuse the same shell footer for edit actions.
    if (this.editMeal !== null && this.isWrappedInDialogShell) {
      return this.getEditFooterActions();
    }

    // In inline mode, keep the schedule footer stable while edit dialog is open.
    if (this.editMeal !== null && this.isInlineMode) {
      return this.getScheduleFooterActions();
    }

    if (this.editMeal !== null) {
      return this.getEditFooterActions();
    }

    return this.getScheduleFooterActions();
  }

  private handleFooterActionId(id: string): void {
    if (this.editMeal !== null) {
      const editDialog = this.renderRoot?.querySelector('meal-edit-dialog');

      if (editDialog) {
        editDialog.dispatchEvent(
          new CustomEvent('edit-footer-action', {
            detail: { id },
            bubbles: false,
            composed: false,
          }),
        );
        return;
      }

      if (id === 'cancel') {
        this.handleEditCancel();
      } else if (id === 'delete') {
        void this.handleDeleteFromEdit();
      }

      return;
    }

    if (id === 'add-meal') {
      this.handleOpenAdd();
      return;
    }

    if (id === 'save') {
      void this.handleSave();
    }
  }

  private getScheduleFooterActions(): DialogAction[] {
    const actions: DialogAction[] = [];

    if (hasProfileField(this.mealState.profile, ProfileField.ADD)) {
      actions.push({
        id: 'add-meal',
        label: localize('common.add_meal'),
        slot: 'secondaryAction',
        icon: 'mdi:plus',
      });
    }

    actions.push({
      id: 'save',
      label: localize('common.save'),
      slot: 'primaryAction',
      disabled: !this.hasPendingChanges() || !this.dataAvailable,
    });

    return actions;
  }

  private getEditFooterActions(): DialogAction[] {
    const actions: DialogAction[] = [];

    const canDelete =
      this.editMeal?.index !== undefined &&
      this.editMeal.index >= 0 &&
      hasProfileField(this.mealState.profile, ProfileField.DELETE);

    if (canDelete) {
      actions.push({
        id: 'delete',
        label: localize('common.delete'),
        slot: 'secondaryAction',
        destructive: true,
      });
    }

    actions.push(
      {
        id: 'cancel',
        label: localize('common.cancel'),
        slot: 'primaryAction',
      },
      {
        id: 'save',
        label: localize('common.save'),
        slot: 'primaryAction',
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

    const isNew = this.editMeal.index === undefined || this.editMeal.index < 0;

    if (this.isInlineMode) {
      return html`
        <meal-dialog-shell
          .headerTitle=${
            isNew
              ? localize('common.add_meal')
              : localize('schedule_view.edit_feeding_time')
          }
          @closed=${this.handleEditCancel}
          @footer-action=${(e: CustomEvent<{ id: string }>) =>
            this.handleFooterActionId(e.detail.id)}
          .actions=${this.getEditFooterActions()}
        >
          <meal-edit-dialog
            .meal=${this.editMeal.meal}
            .index=${this.editMeal.index}
            .profile=${this.mealState.profile}
            @save=${this.handleEditSave}
            @cancel=${this.handleEditCancel}
            @delete-meal=${this.handleDeleteFromEdit}
          ></meal-edit-dialog>
        </meal-dialog-shell>
      `;
    }

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
    if (this.editMeal !== null && this.isWrappedInDialogShell) return '';
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

  private renderActions() {
    const actions = this.footerActions;

    return html`
      <meal-dialog-actions
        class="inline-actions"
        .inline=${true}
        .actions=${actions}
        @action=${(e: CustomEvent<{ id: string }>) =>
          this.handleFooterActionId(e.detail.id)}
      ></meal-dialog-actions>
    `;
  }

  render() {
    const shouldRenderOwnFooter =
      this.isInlineMode || !this.isWrappedInDialogShell;

    return html`
      <meal-message-display></meal-message-display>
      ${this.renderCardView()} ${this.renderMealForm()}
      ${shouldRenderOwnFooter ? this.renderActions() : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'schedule-view': ScheduleView;
  }
}
