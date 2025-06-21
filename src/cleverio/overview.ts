import { LitElement, html, css, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { commonCardStyle } from './common-styles.js';
import * as MealUtils from './util/mealplan-state.js';
import './schedule.js';

export class OverviewsView extends LitElement {
  @property({ type: Array }) accessor meals: any[] = [];
  @property({ type: String }) accessor title: string = 'Cleverio Pet Feeder';

  private _dialogOpen: boolean;

  constructor() {
    super();
    this.meals = [];
    this.title = 'Cleverio Pet Feeder';
    this._dialogOpen = false;
  }

  static styles = [
    commonCardStyle,
    css`
      // ...existing code...
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
                <schedule-view
                  .meals=${this.meals}
                  @meals-changed=${this._onScheduleMealsChanged.bind(this)}
                  @close-dialog=${this._onDialogClose.bind(this)}
                ></schedule-view>
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

  _onScheduleMealsChanged(e: CustomEvent) {
    this._dialogOpen = false;
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: e.detail.meals }, bubbles: true, composed: true }));
    this.requestUpdate();
  }
}

// customElements.define('cleverio-overview-view', CleverioOverviewView);

// Rename this file to overviews.ts and update the class and custom element name to follow Home Assistant frontend conventions (kebab-case, lower case).
// Use modern Lit decorators, e.g.:
// @property() public domain!: string;
