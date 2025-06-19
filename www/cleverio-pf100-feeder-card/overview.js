// Overview view: returns HTML and attaches listeners
import * as MealUtils from './utils/mealplan-state.js';

// CSS for overview view
const overviewStyle = `
  .overview-card {
    background: var(--ha-card-background, var(--card-background-color, #222));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.16));
    border: 1.5px solid var(--divider-color, #444);
    color: var(--primary-text-color);
    font-family: var(--primary-font-family, inherit);
    padding: var(--ha-card-padding, 16px);
    margin: var(--ha-card-margin, 0.5em auto 1em auto);
    max-width: 420px;
    min-width: 260px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--ha-card-section-margin, 1em);
    align-items: center;
    box-sizing: border-box;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .overview-section {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    width: 100%;
    align-items: flex-start;
  }
  .overview-summary {
    display: flex;
    flex-direction: row;
    gap: 1.5em;
    align-items: baseline;
    width: 100%;
    justify-content: space-between;
  }
  .overview-grams { font-weight: bold; }
  .overview-schedules { font-size: 1.1em; }
  .overview-active { font-size: 1.1em; margin-top: 0.2em; display: block; }
  .manage-btn {
    border-radius: var(--ha-card-border-radius);
    background: var(--primary-color);
    color: var(--text-primary-color);
    border: none;
    padding: var(--ha-card-button-padding, 0.5em 1em);
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    align-self: flex-start;
  }
`;

// Render the overview view and return the root element
export function renderOverviewView({ meals, onManageSchedules }) {
  const card = document.createElement('div');
  card.className = 'overview-card';

  // Always attach CSS
  const style = document.createElement('style');
  style.textContent = overviewStyle;
  card.appendChild(style);

  const enabledCount = meals.filter(m => m.enabled).length;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const gramsValue = MealUtils.getTodaysFoodGrams(meals.filter(m => m.enabled), today) * 6;

  card.innerHTML += `
    <section class="overview-section">
      <div class="overview-summary">
        <span class="overview-schedules">Schedules: ${meals.length}</span>
      </div>
      <span class="overview-active">Active schedules: ${enabledCount}</span>
      <div class="overview-grams">Today: ${gramsValue}g (active)</div>
      <button class="manage-btn">Manage schedules</button>
    </section>
  `;

  card.querySelector('.manage-btn')?.addEventListener('click', onManageSchedules);

  return card;
}

// Attach all listeners for the overview view
export function attachOverviewListeners({ root, onManageSchedules }) {
  root.querySelector('.manage-btn')?.addEventListener('click', onManageSchedules);
}

// Main entry for orchestration
export function showOverviewView({ container, meals, onManageSchedules }) {
  container.innerHTML = '';
  const view = renderOverviewView({ meals });
  container.appendChild(view);
  attachOverviewListeners({ root: view, onManageSchedules });
}
