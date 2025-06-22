import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { loadHaComponents } from '@kipk/load-ha-components';
import { commonCardStyle, commonTableStyle } from './common-styles';
import {localize} from './locales/localize';
import './edit';

console.log('[cleverio-schedule-view] Module loaded');

@customElement('cleverio-schedule-view')
export class ScheduleView extends LitElement {
  @property({ type: Array }) accessor meals: any[] = [];
  @property({ type: Array }) accessor _localMeals: any[] = [];
  @property({ type: String }) accessor _view: 'table' | 'edit' = 'table';
  @property({ type: Number }) accessor _editIdx: number | null = null;
  @property({ type: Boolean }) private _haComponentsReady = false;

  constructor() {
    super();
    this.meals = [];
    this._localMeals = [];
    this._view = 'table';
    this._editIdx = null;
    console.log('[cleverio-schedule-view] Constructor');
  }

  // Load Ha components when connected
  async connectedCallback() {
    super.connectedCallback();
    console.log('[cleverio-schedule-view] connectedCallback');
    await loadHaComponents(['ha-data-table', 'ha-switch', 'ha-button']);
    this._haComponentsReady = true;
    console.log('[cleverio-schedule-view] HA components loaded');
  }

  // Watch for changes in meals
  updated(changed: PropertyValues) {
    if (changed.has('meals')) {
      this._localMeals = this.meals.map(m => ({ ...m }));
      this._view = 'table';
      this._editIdx = null;
      console.log('[cleverio-schedule-view] Meals updated', this._localMeals);
    }
  }

  static styles = [
    commonCardStyle,
    commonTableStyle,
    css`
      .ha-actions-row ha-button.ha-primary {
        background: var(--primary-color, #03a9f4) !important;
        color: var(--text-primary-color, #fff) !important;
      }
      .ha-actions-row ha-button.ha-primary:active,
      .ha-actions-row ha-button.ha-primary:focus {
        filter: brightness(0.95);
      }
      .ha-table-style th, .ha-table-style td {
        font-size: 0.92em;
        padding: 0.18em 0.15em;
        min-width: 0;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ha-table-style th.enabled-col, .ha-table-style td.enabled-col {
        min-width: 32px !important;
        max-width: 38px !important;
        width: 38px !important;
        text-align: center;
      }
      .ha-table-style th.actions-col, .ha-table-style td.actions-col {
        min-width: 70px !important;
        max-width: 90px !important;
        width: 80px !important;
        text-align: center;
      }
      .ha-table-wrapper {
        width: 100%;
        max-width: 100vw;
        overflow-x: auto;
        margin: 0 auto 1em auto;
      }
    `
  ];

  render() {
    console.log('[cleverio-schedule-view] render', { _view: this._view, _editIdx: this._editIdx });
    if (this._view === 'edit') {
      return this._renderEditView();
    }
    if (!this._haComponentsReady) {
      return html`<div>Loading Home Assistant components...</div>`;
    }
    // ha-data-table columns as an object, not array, and add a compact days column
    const columns = {
      time: { title: localize('time'), sortable: true, minWidth: '60px', maxWidth: '80px' },
      portion: { title: localize('portion'), sortable: true, minWidth: '40px', maxWidth: '60px' },
      days: {
        title: localize('days'), sortable: false, minWidth: '80px', maxWidth: '110px',
        template: (row: any) => html`
          <div style="display:flex; gap:1px; flex-wrap:wrap;">
            ${['M','T','W','T','F','S','S'].map((d, i) => html`
              <span style="display:inline-block; width:1.2em; text-align:center; border-radius:8px; background:${row.daysMask & (1<<i) ? 'var(--primary-color, #03a9f4)' : 'var(--card-background-color, #eee)'}; color:${row.daysMask & (1<<i) ? 'var(--text-primary-color, #fff)' : '#888'}; font-weight:bold;">${d}</span>
            `)}
          </div>`
      },
      enabled: { title: html`<span style="font-size:0.9em;">${localize('enabled')}</span>`, sortable: false, minWidth: '32px', maxWidth: '38px', width: '38px', className: 'enabled-col', template: (row: any) => html`
        <ha-switch .checked=${row.enabled} @change=${(e: Event) => this._toggleEnabled(row._idx, e)} title="Enable/disable schedule"></ha-switch>
      ` },
      actions: { title: html`<span style="font-size:0.9em;">${localize('actions')}</span>`, sortable: false, minWidth: '70px', maxWidth: '90px', width: '80px', className: 'actions-col', template: (row: any) => html`
        <ha-button @click=${() => this._edit(row._idx)}>Edit</ha-button>
        <ha-button @click=${() => this._delete(row._idx)} style="margin-left:0.2em; background: var(--error-color, #b71c1c); color: #fff;">Delete</ha-button>
      ` }
    };
    // rows as array of objects with _idx
    const rows = this._localMeals.map((m, i) => ({ ...m, _idx: i }));
    return html`
      <div class="ha-table-wrapper">
        <ha-data-table
          .localizeFunc=${localize}
          .columns=${columns}
          .data=${rows}
          class="ha-table-style"
          style="width:100%; min-width:420px; max-width:600px; margin:auto;"
          auto-height
        ></ha-data-table>
      </div>
      <div class="ha-actions-row">
        <ha-button @click=${this._add.bind(this)}>Add</ha-button>
        <ha-button @click=${this._cancel.bind(this)}>Cancel</ha-button>
        <ha-button class="ha-primary" @click=${this._save.bind(this)}>${localize('save')}</ha-button>
      </div>
    `;
  }

  _toggleEnabled(idx: number, e: Event) {
    this._localMeals[idx].enabled = (e.target as HTMLInputElement).checked;
    this.requestUpdate();
    console.log('[cleverio-schedule-view] _toggleEnabled', { idx, enabled: this._localMeals[idx].enabled });
  }

  _edit(idx: number) {
    this._editIdx = idx;
    this._view = 'edit';
    this.requestUpdate();
    console.log('[cleverio-schedule-view] _edit', { idx });
  }

  _delete(idx: number) {
    this._localMeals.splice(idx, 1);
    this.requestUpdate();
    console.log('[cleverio-schedule-view] _delete', { idx });
  }

  _add() {
    this._editIdx = null;
    this._view = 'edit';
    this.requestUpdate();
    console.log('[cleverio-schedule-view] _add');
  }

  _cancel() {
    this.dispatchEvent(new CustomEvent('close-dialog', { bubbles: true, composed: true }));
    console.log('[cleverio-schedule-view] _cancel');
  }

  _save() {
    this.dispatchEvent(new CustomEvent('meals-changed', { detail: { meals: this._localMeals }, bubbles: true, composed: true }));
    console.log('[cleverio-schedule-view] _save', { meals: this._localMeals });
  }

  _renderEditView() {
    const meal = this._editIdx != null && this._localMeals[this._editIdx]
      ? this._localMeals[this._editIdx]
      : { time: '', portion: 1, daysMask: 0, enabled: true };
    console.log('[cleverio-schedule-view] _renderEditView', { meal, _editIdx: this._editIdx });
    return html`
      <cleverio-edit-view
        .data=${meal}
        @save=${this._onEditSave}
        @back=${this._onEditBack}
      ></cleverio-edit-view>
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
    console.log('[cleverio-schedule-view] _onEditSave', { meal });
  }

  _onEditBack() {
    this._view = 'table';
    this._editIdx = null;
    this.requestUpdate();
    console.log('[cleverio-schedule-view] _onEditBack');
  }
}
