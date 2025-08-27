import { html } from "lit";
import { getTotalFoodPerDay, getTodaysFoodGrams } from "../util/mealplan-metrics";

export function renderOverview({
  meals,
  localize,
}: {
  meals: any[];
  localize: (k: string) => string;
}) {
  const enabledMeals = meals.filter((m: any) => m.enabled);
  const today = new Date().getDay();
  const totalToday = getTodaysFoodGrams(enabledMeals, today) * 6;
  const totals = getTotalFoodPerDay(enabledMeals);
  const avg = totals.reduce((a, b) => a + b, 0) / 7;
  return html`
    <div class="overview-row">
      <ha-chip class="overview-schedules">
        <ha-icon icon="mdi:calendar-clock"></ha-icon>
        ${localize("schedules")}:
        <span style="white-space:nowrap;">${meals.length}</span>
      </ha-chip>
      <ha-chip class="overview-active">
        <ha-icon icon="mdi:check-circle-outline"></ha-icon>
        ${localize("active_schedules")}:
        <span style="white-space:nowrap;">${enabledMeals.length}</span>
      </ha-chip>
      <ha-chip class="overview-grams">
        <ha-icon icon="mdi:food-drumstick"></ha-icon>
        ${localize("today")}:
        <span style="white-space:nowrap;">${totalToday}g</span>
      </ha-chip>
      <ha-chip class="overview-average">
        <ha-icon icon="mdi:scale-balance"></ha-icon>
        ${localize("avg_week")}:
        <span style="white-space:nowrap;">${(avg * 6).toFixed(1)}g</span>
      </ha-chip>
    </div>
  `;
}
