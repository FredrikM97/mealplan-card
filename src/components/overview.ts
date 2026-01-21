/**
 * Overview component displaying meal plan statistics
 * Self-contained LitElement component
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FeedingTime } from '../types';
import { localize } from '../locales/localize';
import { isMealEnabled } from '../utils';

/**
 * Calculate average food per day across all feeding times
 */
export function getWeeklyAveragePortion(feedingTimes: FeedingTime[]): number {
  let weeklyTotal = 0;
  feedingTimes.forEach((t) => {
    if (typeof t.days !== 'number') return;
    const portions = Array.isArray(t.portions) ? t.portions : [];
    const portionTotal =
      portions.reduce(
        (sum, val) => sum + (typeof val === 'number' ? val : 0),
        0,
      );
    if (portionTotal <= 0) return;
    for (let i = 0; i < 7; i++) {
      if (t.days & (1 << i)) {
        weeklyTotal += portionTotal;
      }
    }
  });
  return weeklyTotal / 7;
}

/**
 * Get today's total food in grams
 */
export function getTodaysFoodGrams(
  feedingTimes: FeedingTime[],
  dayIdx: number,
): number {
  let total = 0;
  feedingTimes.forEach((t) => {
    if (typeof t.days !== 'number') return;
    const portions = Array.isArray(t.portions) ? t.portions : [];
    const portionTotal =
      portions.reduce(
        (sum, val) => sum + (typeof val === 'number' ? val : 0),
        0,
      );
    if (portionTotal <= 0) return;
    if (t.days & (1 << dayIdx)) {
      total += portionTotal;
    }
  });
  return total;
}

/**
 * Overview statistics component
 */
@customElement('meal-overview')
export class MealOverview extends LitElement {
  @property({ type: Array }) meals: FeedingTime[] = [];
  @property({ type: Number }) portions = 6;

  static styles = css`
    .overview-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin: 0 16px 8px 16px;
      box-sizing: border-box;
      padding-right: 8px;
    }
    @media (max-width: 600px) {
      .overview-row {
        flex-direction: column;
        gap: 4px;
        margin: 0 4px 8px 4px;
      }
    }
  `;

  render() {
    const enabledMeals = this.meals.filter(isMealEnabled);
    const today = new Date().getDay();
    const totalToday = getTodaysFoodGrams(enabledMeals, today) * this.portions;
    const avg = getWeeklyAveragePortion(enabledMeals) * this.portions;

    return html`
      <div class="overview-row">
        <ha-chip class="overview-schedules">
          <ha-icon icon="mdi:calendar-clock"></ha-icon>
          ${localize('overview.schedules')}:
          <span style="white-space:nowrap;">${this.meals.length}</span>
        </ha-chip>
        <ha-chip class="overview-active">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          ${localize('overview.active')}:
          <span style="white-space:nowrap;">${enabledMeals.length}</span>
        </ha-chip>
        <ha-chip class="overview-grams">
          <ha-icon icon="mdi:food-drumstick"></ha-icon>
          ${localize('overview.today')}:
          <span style="white-space:nowrap;">${totalToday}g</span>
        </ha-chip>
        <ha-chip class="overview-average">
          <ha-icon icon="mdi:scale-balance"></ha-icon>
          ${localize('overview.avg_week')}:
          <span style="white-space:nowrap;">${avg.toFixed(1)}g</span>
        </ha-chip>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-overview': MealOverview;
  }
}
