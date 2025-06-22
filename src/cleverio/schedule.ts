import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { loadHaComponents } from '@kipk/load-ha-components';
import { commonCardStyle } from './common-styles';
import {localize} from './locales/localize';
import './edit';
import './day-selector';
import type { FeedingTime } from './util/mealplan-state';

@customElement('cleverio-schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Array }) accessor meals: FeedingTime[] = [];
  @property({ type: Array }) accessor _localMeals: FeedingTime[] = [];
  @property({ type: Boolean }) accessor _haComponentsReady = false;
  private _editIdx: number | null = null;
  @state() private _hasUnsavedChanges = false;
  @property({ type: String }) private _mode: 'table' | 'edit' = 'table';

  constructor() {
    super();
    this.meals = [];
    this._localMeals = [];
    console.log('[cleverio-schedule-view] Constructor');
  }

  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback();
    await loadHaComponents(['ha-data-table', 'ha-switch', 'ha-button', 'ha-icon']);
    this._haComponentsReady = true;
  }

  // Watch for changes in meals
  updated(changed: PropertyValues) {
    if (changed.has('meals')) {
      this._localMeals = this.meals.map(m => ({ ...m }));
      this._hasUnsavedChanges = false;
      console.log('[cleverio-schedule-view] Meals updated', this._localMeals);
    }
  }

  static styles = [
    commonCardStyle,
    css`
      .ha-actions-row {
        display: flex;
        gap: 0.5em;
        justify-content: flex-end;
        margin: 1em 0 0 0;
      }
      .ha-table-wrapper {
        margin: 0 auto 1em auto;
      }
      .days-row {
        display: flex;
        gap: 1px;
        flex-wrap: wrap;
        align-items: center;
        white-space: normal;
        word-break: break-word;
      }
      .day-cell {
        height: 1.7em;
        line-height: 1.7em;
        text-align: center;
        border-radius: 6px;
        background: var(--card-background-color, #f0f0f0);
        color: #8a8a8a;
        font-weight: 600;
        font-size: 0.95em;
        margin: 0 1px;
        transition: background 0.2s, color 0.2s;
      }
      .day-cell.selected {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
      }
      .switch-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 4px;
        padding-bottom: 4px;
      }
      .ha-table-style td, .ha-table-style th {
        padding: 0 4px;
        vertical-align: middle;
        border: none;
      }
      .ha-table-style td.enabled-cell, .ha-table-style th.enabled-cell {
        width: 70px;
        min-width: 70px;
        max-width: 80px;
        text-align: center;
        padding: 0;
        overflow: visible;
        position: relative;
        vertical-align: middle;
      }
      .switch-flex {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 40px;
      }
      .ha-table-style td.enabled-cell ha-switch {
        min-width: 48px;
        min-height: 32px;
        max-width: 100%;
        z-index: 1;
        position: relative;
        margin: 0;
      }
      .ha-table-style td.enabled-cell {
        background: transparent;
      }
      :host ::ng-deep .mdc-data-table__cell,
      :host ::ng-deep .mdc-data-table__header-cell {
        box-sizing: content-box !important;
      }
    `
  ];

  render() {
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    if (this._mode === 'edit') {
      return html`
        <cleverio-edit-view
          .data=${this._editIdx !== null && this._editIdx !== undefined ? { ...this._localMeals[this._editIdx] } : { time: '', portion: 1, daysMask: 0, enabled: true }}
          @edit-save=${this._onEditSave}
          @back=${this._onEditBack}
        ></cleverio-edit-view>
      `;
    }
    // ha-data-table columns as an object, not array, and add a compact days column
    const columns = {
      time: { title: localize('time'), sortable: true, minWidth: '80px'},
      portion: { title: localize('portion'), sortable: true, minWidth: '80px'},
      days: {
        title: localize('days'),
        sortable: false,
        minWidth: '125px',
        template: (row: any) => html`
          <cleverio-day-selector .selectedDaysMask=${row.daysMask} .editable=${false}></cleverio-day-selector>`
      },
      enabled: {
        title: html`<span style="font-size:0.9em;">${localize('enabled')}</span>`,
        sortable: false,
        minWidth: '70px',
        cellClass: 'enabled-cell',
        template: (row: any) => html`
          <div class="switch-flex"><ha-switch .checked=${row.enabled} @change=${(e: Event) => this._toggleEnabled(row._idx, e)} title="Enable/disable schedule"></ha-switch></div>
        `
      },
      actions: {
        title: html`<span style="font-size:0.9em;">${localize('actions')}</span>`,
        sortable: false,
        minWidth: '100px',
        template: (row: any) => html`
          <ha-icon
            icon="mdi:pencil"
            @click=${() => this._openEditDialog(row._idx)}
            title="Edit"
            style="cursor:pointer;margin-right:8px;"
            tabindex="0"
            role="button"
          ></ha-icon>
          <ha-icon
            icon="mdi:delete"
            @click=${() => this._delete(row._idx)}
            title="Delete"
            style="color: var(--error-color, #b71c1c); cursor:pointer;"
            tabindex="0"
            role="button"
          ></ha-icon>
        `
      }
    };
    const rows = this._localMeals.map((m, i) => ({ ...m, _idx: i }));
    const fakeHass = { locale: { language: 'en', country: 'US' } };
    return html`
      <div class="ha-table-wrapper">
        <ha-data-table
          .hass=${fakeHass}
          .localizeFunc=${localize}
          .columns=${columns}
          .data=${rows}
          class="ha-table-style"
          auto-height
        ></ha-data-table>
      </div>
      <div class="ha-actions-row">
        <ha-button @click=${this._openAddDialog.bind(this)}>Add</ha-button>
        <ha-button @click=${this._cancel.bind(this)}>Cancel</ha-button>
        <ha-button class="ha-primary" @click=${() => {
          this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: this._localMeals }, bubbles: true, composed: true }));
          this._hasUnsavedChanges = false;
        }}>
          ${localize('save')}
        </ha-button>
      </div>
      ${this._hasUnsavedChanges ? html`<div class="save-note">Unsaved changes</div>` : ''}
    `;
  }

  _markUnsaved() {
    // Compare localMeals to meals for unsaved changes
    const orig = JSON.stringify(this.meals);
    const local = JSON.stringify(this._localMeals);
    this._hasUnsavedChanges = orig !== local;
  }

  _toggleEnabled(idx: number, e: Event) {
    this._localMeals[idx].enabled = (e.target as HTMLInputElement).checked;
    this.requestUpdate();
    this._markUnsaved();
  }

  _openEditDialog(idx: number) {
    this._mode = 'edit';
    this._editIdx = idx;
    this.requestUpdate();
  }

  _openAddDialog() {
    this._mode = 'edit';
    this._editIdx = null;
    this.requestUpdate();
  }

  _onEditBack() {
    this._mode = 'table';
    this._editIdx = null;
    this.requestUpdate();
  }

  _onEditSave(e: CustomEvent) {
    const meal = e.detail.meal;
    if (this._editIdx !== null && this._editIdx !== undefined) {
      this._localMeals[this._editIdx] = meal;
    } else {
      this._localMeals = [...this._localMeals, meal];
    }
    this._mode = 'table';
    this._editIdx = null;
    this.requestUpdate();
    this._markUnsaved();
    // Do NOT emit meals-changed or update public meals property here.
  }

  _delete(idx: number) {
    this._localMeals.splice(idx, 1);
    this.requestUpdate();
    this._markUnsaved();
  }

  _cancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
  }
}
