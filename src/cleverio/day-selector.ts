import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const SHORT_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TOOLTIP_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

@customElement('cleverio-day-selector')
export class CleverioDaySelector extends LitElement {
  @property({ type: Number }) selectedDaysMask;
  @property({ type: Boolean }) editable;

  constructor() {
    super();
    this.selectedDaysMask = 0;
    this.editable = false;
  }

  _toggleDay(i: number) {
    if (!this.editable) return;
    const newMask = this.selectedDaysMask ^ (1 << i);
    this.dispatchEvent(new CustomEvent('days-changed', { detail: { daysMask: newMask }, bubbles: true, composed: true }));
  }

  render() {
    // Use bigger, improved UI only if editable (edit view)
    const isEdit = this.editable;
    return html`
      <div class="days-row${isEdit ? ' days-row-edit' : ''}">
        ${SHORT_LABELS.map((d, i) => html`
          <span
            class="day-cell${isEdit ? ' day-cell-edit' : ''}${this.selectedDaysMask & (1 << i) ? ' selected' : ''}${this.editable ? '' : ' readonly'}"
            @click=${() => this._toggleDay(i)}
            title=${TOOLTIP_LABELS[i]}
          >${d}</span>
        `)}
      </div>
    `;
  }

  static styles = css`
    .days-row {
      display: flex;
      gap: 1px;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      margin: 0.2em 0 0.4em 0;
    }
    .day-cell {
      width: 1.7em;
      height: 1.7em;
      line-height: 1.7em;
      text-align: center;
      border-radius: 6px;
      background: var(--card-background-color, #f0f0f0);
      color: #8a8a8a;
      font-weight: 600;
      font-size: 0.95em;
      margin: 0 1px;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      cursor: pointer;
      user-select: none;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .day-cell.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      box-shadow: 0 2px 6px rgba(3,169,244,0.10);
    }
    .day-cell.readonly {
      cursor: default;
      opacity: 0.7;
    }
    /* Improved, larger style for edit view only */
    .days-row-edit {
      gap: 4px;
      justify-content: center;
      margin: 0.5em 0 0.7em 0;
    }
    .day-cell-edit {
      width: 2.3em;
      height: 2.3em;
      line-height: 2.3em;
      border-radius: 8px;
      font-size: 1.15em;
      margin: 0 2px;
    }
  `;
}
