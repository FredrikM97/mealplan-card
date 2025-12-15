import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FeedingTime, DeviceProfile } from '../types';
import { ProfileField } from '../types';
import { localize } from '../locales/localize';
import { renderDaySelector } from '../day-selector';
import { formatTime, hasProfileField } from '../utils';

@customElement('meal-card')
export class MealCard extends LitElement {
  @property({ type: Object }) meal!: FeedingTime;
  @property({ type: Number }) index: number = 0;
  @property({ type: Object }) profile!: DeviceProfile;
  @property({ type: Boolean }) expanded = false;
  @property({ attribute: false }) onMealAction?: (
    action: 'update' | 'delete' | 'edit',
    index: number,
    meal: FeedingTime,
  ) => void;

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
    .meal-card-header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .meal-card-header-actions .day-cell {
      width: 1.6em;
      height: 1.6em;
      font-size: 0.85em;
      margin-right: 1px;
    }
    .meal-card-header-actions .days-row {
      margin-right: 20px;
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
      border-top: 1px solid var(--divider-color, #e0e0e0);
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
    .meal-card-info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
  `;

  private toggleExpand() {
    const wasExpanded = this.expanded;
    this.expanded = !this.expanded;

    if (this.expanded && !wasExpanded) {
      // Collapse all sibling cards
      const parent = this.parentElement;
      if (parent) {
        parent.querySelectorAll('meal-card').forEach((card: any) => {
          if (card !== this && card.expanded) {
            card.expanded = false;
          }
        });
      }
    }
  }

  private getSummary(): string {
    const parts: string[] = [];

    if (hasProfileField(this.profile, ProfileField.PORTION)) {
      parts.push(`${localize('portion')}: ${this.meal.portion}g`);
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
        <div class="meal-card-header">
          <div class="meal-card-number" @click=${this.toggleExpand}>
            ${this.index + 1}
          </div>
          <div class="meal-card-summary" @click=${this.toggleExpand}>
            <div class="meal-card-time">${time}</div>
            <div class="meal-card-info">${this.getSummary()}</div>
          </div>
          <div class="meal-card-header-actions">
            ${this.renderDaysInline()} ${this.renderEnabledToggle()}
          </div>
          <ha-icon
            class="meal-card-expand-icon ${this.expanded ? 'expanded' : ''}"
            icon="mdi:chevron-down"
            @click=${this.toggleExpand}
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
        title="${this.meal.enabled
          ? localize('enabled')
          : localize('disabled')}"
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
          ${localize('edit_meal')}
        </ha-button>
        <ha-button
          class="delete-button"
          @click=${() => {
            if (confirm(localize('confirm_delete_meal'))) {
              if (this.onMealAction) {
                this.onMealAction('delete', this.index, this.meal);
              }
            }
          }}
        >
          <ha-icon icon="mdi:delete" slot="icon"></ha-icon>
          ${localize('delete')}
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
