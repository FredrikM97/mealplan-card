import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FeedingTime, DeviceProfile, MealActionHandler } from '../types';
import { ProfileField } from '../types';
import { localize } from '../locales/localize';
import { renderDaySelector } from './day-selector';
import { formatTime, hasProfileField } from '../utils';

@customElement('meal-card')
export class MealCard extends LitElement {
  @property({ type: Object }) meal!: FeedingTime;
  @property({ type: Number }) index: number = 0;
  @property({ type: Object }) profile!: DeviceProfile;
  @property({ attribute: false }) onMealAction?: MealActionHandler;

  static styles = css`
    .meal-card {
      background: var(
        --meal-card-background,
        var(--secondary-background-color, #f5f5f5)
      );
      border-radius: var(--meal-card-border-radius, 6px);
      margin-bottom: 6px;
      border: 1px solid
        var(--meal-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
      box-shadow: var(--meal-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.08));
    }
    .meal-card-header {
      display: flex;
      align-items: center;
      padding: 8px 4px 8px 10px;
      cursor: pointer;
    }
    .meal-card-header:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: var(--meal-card-border-radius, 6px);
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
  `;

  private handleClick() {
    if (this.onMealAction && hasProfileField(this.profile, ProfileField.EDIT)) {
      this.onMealAction('edit', this.index, this.meal);
    }
  }

  private getSummary(): string {
    const parts: string[] = [];

    if (hasProfileField(this.profile, ProfileField.PORTION)) {
      parts.push(`${localize('common.portion')}: ${this.meal.portion}`);
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
        <div class="meal-card-header" @click=${this.handleClick}>
          <div class="meal-card-number">${this.index + 1}</div>
          <div class="meal-card-summary">
            <div class="meal-card-time">${time}</div>
            <div class="meal-card-info">${this.getSummary()}</div>
          </div>
          <div class="meal-card-days">${this.renderDaysInline()}</div>
          ${this.renderEnabledToggle()}
        </div>
      </div>
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
        title="${
          this.meal.enabled
            ? localize('common.enabled')
            : localize('common.disabled')
        }"
      ></ha-switch>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-card': MealCard;
  }
}
