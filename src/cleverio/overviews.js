import { LitElement, html, css } from 'lit';
import { commonCardStyle } from './common-styles.js';
import * as MealUtils from './util/mealplan-state.js';
import './schedule.js';

export class CleverioOverviewView extends LitElement {
  static get properties() {
    return {
      meals: { type: Array },
      title: { type: String },
    };
  }

  constructor() {
    super();
    this.meals = [];
    this.title = 'Cleverio Pet Feeder';
    this._dialogOpen = false;
  }

  static styles = [
    commonCardStyle,
    css`
      .overview-card {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--ha-card-section-margin, 1em);
        align-items: center;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--ha-card-background, var(--card-background-color, #fff));
        border: var(--ha-card-border-width, 1.5px) solid var(--ha-card-border-color, var(--divider-color, #444));
        box-shadow: none;
        overflow: hidden;
      }
      .overview-title {
        font-size: 1.5em;
        font-weight: bold;
        margin: 0.5em 0;
        color: var(--primary-text-color);
        text-align: center;
        width: 100%;
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
    `
  ];

  render() {
    const enabledCount = this.meals.filter(m => m.enabled).length;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const gramsValue = MealUtils.getTodaysFoodGrams(this.meals.filter(m => m.enabled), today) * 6;
    return html`
      <ha-card class="overview-card ha-card-style">
        <h2 class="overview-title">${this.title || 'Cleverio Pet Feeder'}</h2>
        <section class="overview-section">
          <div class="overview-summary">
            <span class="overview-schedules">Schedules: ${this.meals.length}</span>
          </div>
          <span class="overview-active">Active schedules: ${enabledCount}</span>
          <div class="overview-grams">Today: ${gramsValue}g (active)</div>
          <ha-button class="manage-btn" @click=${() => { this._dialogOpen = true; this.requestUpdate(); }}>Manage schedules</ha-button>
        </section>
        ${this._dialogOpen
          ? html`
              <ha-dialog open scrimClickAction @closed=${this._onDialogClose.bind(this)}>
                <cleverio-schedules-view
                  .meals=${this.meals}
                  @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></cleverio-schedules-view>
              </ha-dialog>
            `
          : ''}
      </ha-card>
    `;
  }

  _onDialogClose() {
    this._dialogOpen = false;
    this.requestUpdate();
  }

  _onScheduleMealsChanged(e) {
    this._dialogOpen = false;
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: e.detail.meals }, bubbles: true, composed: true }));
    this.requestUpdate();
  }
}

customElements.define('cleverio-overview-view', CleverioOverviewView);
