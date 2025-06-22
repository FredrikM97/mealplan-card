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

  static styles = css`
    .days-row {
      display: flex;
      gap: 1px;
      flex-wrap: wrap;
      align-items: center;
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
      transition: background 0.2s, color 0.2s;
      cursor: pointer;
      user-select: none;
    }
    .day-cell.selected {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .day-cell.readonly {
      cursor: default;
    }
  `;

  _toggleDay(i: number) {
    if (!this.editable) return;
    const newMask = this.selectedDaysMask ^ (1 << i);
    this.dispatchEvent(new CustomEvent('days-changed', { detail: { daysMask: newMask }, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="days-row">
        ${SHORT_LABELS.map((d, i) => html`
          <span
            class="day-cell${this.selectedDaysMask & (1 << i) ? ' selected' : ''}${this.editable ? '' : ' readonly'}"
            @click=${() => this._toggleDay(i)}
            title=${TOOLTIP_LABELS[i]}
          >${d}</span>
        `)}
      </div>
    `;
  }
}
