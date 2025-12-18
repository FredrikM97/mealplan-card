import { html, css } from 'lit';

const daySelectorStyles = css`
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
    transition:
      background 0.2s,
      color 0.2s;
    cursor: pointer;
    user-select: none;
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
`;

/**
 * Renders a day selector row as a Lit template.
 */
export function renderDaySelector({
  days = 0,
  editable = false,
  dayLabels,
  onDaysChanged,
}: {
  days: number;
  editable: boolean;
  dayLabels?: string[];
  onDaysChanged?: (newDays: number) => void;
}): import('lit').TemplateResult {
  const defaultLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const labels =
    dayLabels && dayLabels.length === 7 ? dayLabels : defaultLabels;

  const handleClick = (i: number) => {
    if (!editable || !onDaysChanged) return;
    const newDays = days ^ (1 << i);
    onDaysChanged(newDays);
  };

  return html`
    <style>
      ${daySelectorStyles}
    </style>
    <div class="days-row${editable ? ' edit-mode' : ''}">
      ${labels.map(
        (d, i) => html`
          <span
            class="day-cell${days & (1 << i) ? ' selected' : ''}${editable
              ? ''
              : ' readonly'}"
            @click=${editable ? () => handleClick(i) : undefined}
            >${d}</span
          >
        `,
      )}
    </div>
  `;
}
