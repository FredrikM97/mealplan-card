/**
 * Overview component displaying meal plan statistics
 * Self-contained LitElement component
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FeedingTime } from '../types.js';
import type { MealStateController } from '../mealStateController.js';

/**
 * Get next scheduled feeding time
 */
export function getNextSchedule(feedingTimes: FeedingTime[]): string {
  if (!feedingTimes || feedingTimes.length === 0) return '-';

  const enabledTimes = feedingTimes.filter((t) => {
    // If enabled field exists, check it; otherwise include all times
    return t.enabled === undefined || t.enabled === 1;
  });

  if (enabledTimes.length === 0) return '-';

  // Find earliest time
  const sorted = [...enabledTimes].sort((a, b) => {
    const aMinutes = (a.hour ?? 0) * 60 + (a.minute ?? 0);
    const bMinutes = (b.hour ?? 0) * 60 + (b.minute ?? 0);
    return aMinutes - bMinutes;
  });

  const hour = sorted[0].hour!.toString().padStart(2, '0');
  const minute = sorted[0].minute!.toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * Calculate total food per day across all feeding times
 */
export function getTotalFoodPerDay(feedingTimes: FeedingTime[]): number[] {
  const totals = Array(7).fill(0);
  feedingTimes.forEach((t) => {
    if (typeof t.days !== 'number' || typeof t.portion !== 'number') return;
    for (let i = 0; i < 7; i++) {
      if (t.days & (1 << i)) {
        totals[i] += t.portion;
      }
    }
  });
  return totals;
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
    if (typeof t.days !== 'number' || typeof t.portion !== 'number') return;
    if (t.days & (1 << dayIdx)) {
      total += t.portion;
    }
  });
  return total;
}

/**
 * Overview statistics component
 */
@customElement('meal-overview')
export class MealOverview extends LitElement {
  @property({ type: Object }) mealState!: MealStateController;
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
    const meals = this.mealState?.meals || [];
    const enabledMeals = meals.filter(
      (m) => m.enabled === undefined || m.enabled === 1,
    );
    const today = new Date().getDay();
    const totalToday = getTodaysFoodGrams(enabledMeals, today) * this.portions;
    const totals = getTotalFoodPerDay(enabledMeals);
    const avg = totals.reduce((a, b) => a + b, 0) / 7;

    return html`
      <div class="overview-row">
        <ha-chip class="overview-schedules">
          <ha-icon icon="mdi:calendar-clock"></ha-icon>
          Schedules:
          <span style="white-space:nowrap;">${meals.length}</span>
        </ha-chip>
        <ha-chip class="overview-active">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          Active:
          <span style="white-space:nowrap;">${enabledMeals.length}</span>
        </ha-chip>
        <ha-chip class="overview-grams">
          <ha-icon icon="mdi:food-drumstick"></ha-icon>
          Today: <span style="white-space:nowrap;">${totalToday}g</span>
        </ha-chip>
        <ha-chip class="overview-average">
          <ha-icon icon="mdi:scale-balance"></ha-icon>
          Avg/Week:
          <span style="white-space:nowrap;"
            >${(avg * this.portions).toFixed(1)}g</span
          >
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
