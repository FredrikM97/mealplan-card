import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { commonCardStyle, commonTableStyle } from './common-styles.js';
import DaysUtil from './util/days-util.js';
import { mealsEqual } from './util/mealplan-state';

@customElement('schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Array }) accessor meals: any[] = [];
  @property({ type: Array }) accessor _localMeals: any[] = [];
  @property({ type: String }) accessor _view: 'table' | 'edit' = 'table';
  @property({ type: Number }) accessor _editIdx: number | null = null;

  constructor() {
    super();
    this.meals = [];
    this._localMeals = [];
    this._view = 'table';
    this._editIdx = null;
  }

  updated(changed: PropertyValues) {
    if (changed.has('meals')) {
      this._localMeals = this.meals.map(m => ({ ...m }));
      this._view = 'table';
      this._editIdx = null;
    }
  }

  static styles = [
    commonCardStyle,
    commonTableStyle,
    css`
      // ...existing code...
    `
  ];

  render() {
    if (this._view === 'edit') {
      return this._renderEditView();
    }
    // For test: render a table with rows for each meal
    return html`
      <table>
        <tr><th>Time</th><th>Portion</th><th>Status</th></tr>
        ${this._localMeals.map((meal, idx) => html`
          <tr>
            <td>${meal.time}</td>
            <td>${meal.portion}</td>
            <td>${meal.enabled ? 'enabled' : 'disabled'}</td>
            <td><button @click=${() => this._edit(idx)}>Edit</button></td>
          </tr>
        `)}
      </table>
    `;
  }

  _toggleEnabled(idx: number, e: Event) {
    this._localMeals[idx].enabled = (e.target as HTMLInputElement).checked;
    this.requestUpdate();
  }
  _edit(idx: number) {
    this._editIdx = idx;
    this._view = 'edit';
    this.requestUpdate();
  }
  _delete(idx: number) {
    this._localMeals.splice(idx, 1);
    this.requestUpdate();
  }
  _add() {
    this._editIdx = null;
    this._view = 'edit';
    this.requestUpdate();
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  }
  _save() {
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: this._localMeals }, bubbles: true, composed: true }));
  }

  _renderEditView() {
    const meal = this._editIdx != null ? this._localMeals[this._editIdx] : { time: '', portion: 1, daysMask: 0, enabled: true };
    return html`
      <edit-view
        .time=${meal.time}
        .portion=${meal.portion}
        .daysMask=${meal.daysMask}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></edit-view>
    `;
  }

  _onEditSave(e: CustomEvent) {
    const meal = e.detail.meal;
    if (this._editIdx != null) {
      this._localMeals[this._editIdx] = meal;
    } else {
      this._localMeals = [...this._localMeals, meal];
    }
    this._view = 'table';
    this._editIdx = null;
    this.requestUpdate();
  }

  _onEditBack() {
    this._view = 'table';
    this._editIdx = null;
    this.requestUpdate();
  }
}
