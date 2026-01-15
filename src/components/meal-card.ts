import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FeedingTime, DeviceProfile, MealActionHandler } from '../types';
import { ProfileField } from '../types';
import { localize } from '../locales/localize';
import { renderDaySelector } from './day-selector';
import {
  formatTime,
  getProfilePortionCount,
  hasProfileField,
} from '../utils';

@customElement('meal-card')
export class MealCard extends LitElement {
  @property({ type: Object }) meal!: FeedingTime;
  @property({ type: Number }) index: number = 0;
  @property({ type: Object }) profile!: DeviceProfile;
  @property({ type: Boolean }) expanded = false;
  @property({ attribute: false }) onMealAction?: MealActionHandler;

  static styles = css`
    .meal-card {
      background: var(--card-background-color, #fff);
      border-radius: 6px;
      margin-bottom: 6px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .meal-card-header {
      display: flex;
      align-items: center;
      padding: 8px 4px 8px 10px;
      cursor: pointer;
    }
    .meal-card-header:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .meal-card-header ha-switch,
    .meal-card-header ha-icon {
      pointer-events: auto;
    }
    .meal-card-number {
      font-size: 0.75em;
      font-weight: 600;
      color: var(--primary-color);
      background: var(--primary-color-light, rgba(3, 169, 244, 0.1));
      padding: 2px 6px;
      border-radius: 10px;
      margin-right: 8px;
      min-width: 20px;
      text-align: center;
    }
    .meal-card-summary {
      flex: 1;
      min-width: 0;
    }
    .meal-card-time {
      font-weight: 600;
      font-size: 1em;
      line-height: 1.4;
    }
    .meal-card-info {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      line-height: 1.2;
    }
    .meal-card-days {
      margin-right: 8px;
    }
    .meal-card-days .days-row {
      margin: 0;
    }
    .meal-card-days .day-cell {
      width: 1.6em;
      height: 1.6em;
      font-size: 0.85em;
    }
    ha-switch {
      margin-left: auto;
    }
    @media (max-width: 500px) {
      .meal-card-header {
        flex-wrap: wrap;
      }
      .meal-card-summary {
        order: 1;
      }
      ha-switch {
        order: 2;
      }
      .meal-card-expand-icon {
        order: 3;
      }
      .meal-card-days {
        order: 10;
        width: 100%;
        margin: 4px 0 2px 36px;
      }
      .meal-card-days .days-row {
        gap: 3px;
        row-gap: 2px;
      }
    }
    .meal-card-expand-icon {
      transition: transform 0.2s;
      margin-left: 4px;
      --mdc-icon-size: 24px;
      color: var(--primary-color);
      cursor: pointer;
    }
    .meal-card-expand-icon:hover {
      color: var(--primary-color-dark, var(--primary-color));
    }
    .meal-card-expand-icon.expanded {
      transform: rotate(180deg);
    }
    .meal-card-details {
      padding: 0 10px 8px 10px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color, #f5f5f5);
    }
    .meal-card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
    }
    .meal-card-label {
      font-weight: 500;
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
    .meal-card-value {
      font-size: 0.9em;
    }
    .meal-card-actions-section {
      margin-top: 8px;
      padding-top: 8px;
      display: flex;
      gap: 8px;
    }
    .meal-card-actions-section ha-button {
      flex: 1;
      --ha-button-height: 32px;
    }
    .meal-card-actions-section .delete-button {
      --mdc-theme-primary: var(--error-color, #db4437);
    }
  `;

  private toggleExpand() {
    const wasExpanded = this.expanded;
    this.expanded = !this.expanded;

    if (this.expanded && !wasExpanded) {
      // Collapse all sibling cards
      const parent = this.parentElement;
      if (parent) {
        parent.querySelectorAll<MealCard>('meal-card').forEach((card) => {
          if (card !== this && card.expanded) {
            card.expanded = false;
          }
        });
      }

      // Scroll card into view after expanding
      this.updateComplete.then(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  private getSummary(): string {
    const parts: string[] = [];
    const label = localize('common.portion');
    const portionCount = getProfilePortionCount(this.profile);
    const useNumberedLabels = portionCount > 1;
    const portions = Array.isArray(this.meal.portions)
      ? this.meal.portions
      : [];
    for (let i = 0; i < portionCount; i++) {
      const value = portions[i];
      if (typeof value === 'number') {
        parts.push(
          `${useNumberedLabels ? `${label} ${i + 1}` : label}: ${value}`,
        );
      }
    }

    return parts.join(' • ');
  }

  private handleMealUpdate(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    const updatedMeal = { ...this.meal, enabled: checked ? 1 : 0 };
    if (this.onMealAction) {
      this.onMealAction('update', this.index, updatedMeal);
    }
  }

  render() {
    const time = formatTime(this.meal.hour, this.meal.minute);

    return html`
      <div class="meal-card">
        <div class="meal-card-header" @click=${this.toggleExpand}>
          <div class="meal-card-number">${this.index + 1}</div>
          <div class="meal-card-summary">
            <div class="meal-card-time">${time}</div>
            <div class="meal-card-info">${this.getSummary()}</div>
          </div>
          <div class="meal-card-days">${this.renderDaysInline()}</div>
          ${this.renderEnabledToggle()}
          <ha-icon
            class="meal-card-expand-icon ${this.expanded ? 'expanded' : ''}"
            icon="mdi:chevron-down"
          ></ha-icon>
        </div>
        ${this.expanded ? this.renderDetails() : ''}
      </div>
    `;
  }

  private renderDetails() {
    return html`
      <div class="meal-card-details">${this.renderActionButtons()}</div>
    `;
  }

  private renderDaysInline() {
    if (
      !hasProfileField(this.profile, ProfileField.DAYS) ||
      this.meal.days === undefined
    )
      return '';

    return renderDaySelector({
      days: this.meal.days,
      editable: false,
    });
  }

  private renderEnabledToggle() {
    if (!hasProfileField(this.profile, ProfileField.ENABLED)) return '';

    return html`
      <ha-switch
        .checked=${!!this.meal.enabled}
        @change=${(e: Event) => {
          this.handleMealUpdate(e);
        }}
        @click=${(e: Event) => {
          e.stopPropagation();
        }}
        title="${this.meal.enabled
          ? localize('common.enabled')
          : localize('common.disabled')}"
      ></ha-switch>
    `;
  }

  private renderActionButtons() {
    if (!hasProfileField(this.profile, ProfileField.DELETE)) return '';

    return html`
      <div class="meal-card-actions-section">
        <ha-button
          @click=${() => {
            if (this.onMealAction) {
              this.onMealAction('edit', this.index, this.meal);
            }
          }}
        >
          <ha-icon icon="mdi:pencil" slot="icon"></ha-icon>
          ${localize('meal_card.edit_meal')}
        </ha-button>
        <ha-button
          class="delete-button"
          @click=${() => {
            if (confirm(localize('meal_card.confirm_delete'))) {
              if (this.onMealAction) {
                this.onMealAction('delete', this.index, this.meal);
              }
            }
          }}
        >
          <ha-icon icon="mdi:delete" slot="icon"></ha-icon>
          ${localize('common.delete')}
        </ha-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-card': MealCard;
  }
}
