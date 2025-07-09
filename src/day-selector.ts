import { html } from 'lit';

/**
 * Renders a day selector row as a Lit template (function version).
 * @param {object} params
 * @param {number} params.selectedDaysMask - Bitmask for selected days (0 = none, 127 = all).
 * @param {boolean} params.editable - If true, days are clickable and emit events.
 * @param {string[]} [params.dayLabels] - Optional array of 7 day labels.
 * @param {(newMask: number) => void} [params.onDaysChanged] - Optional callback for when days change.
 * @returns {import('lit').TemplateResult}
 *
 * Usage example:
 *
 * import { renderDaySelector } from './day-selector';
 *
 * html`
 *   ${renderDaySelector({
 *     selectedDaysMask: daysMask,
 *     editable: true,
 *     dayLabels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
 *     onDaysChanged: (newMask) => { ... }
 *   })}
 * `;
 */
export function renderDaySelector({
  selectedDaysMask = 0,
  editable = false,
  dayLabels,
  onDaysChanged
}: {
  selectedDaysMask: number,
  editable: boolean,
  dayLabels?: string[],
  onDaysChanged?: (newMask: number) => void
}): import('lit').TemplateResult {
  const labels = dayLabels && dayLabels.length === 7 ? dayLabels : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const handleClick = (i: number) => {
    if (!editable) return;
    const newMask = selectedDaysMask ^ (1 << i);
    if (onDaysChanged) onDaysChanged(newMask);
  };
  return html`
    <style>
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
        position: relative;
        pointer-events: auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .edit-mode .days-row {
        justify-content: center;
        margin: 0 auto;
        gap: 8px;
      }
      .edit-mode .day-cell {
        width: 2.6em;
        height: 2.6em;
        line-height: 2.6em;
        font-size: 1.25em;
        margin: 0 4px;
      }
      .day-cell.selected {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
      }
      .day-cell.readonly {
        cursor: default;
      }
    </style>
    <div class="days-row${editable ? ' edit-mode' : ''}">
      ${labels.map((d, i) => html`
        <span
          class="day-cell${selectedDaysMask & (1 << i) ? ' selected' : ''}${editable ? '' : ' readonly'}"
          @click=${() => handleClick(i)}
        >${d}</span>
      `)}
    </div>
  `;
}