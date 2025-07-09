
import { html } from 'lit';
import { renderDaySelector } from '../day-selector';
import { localize } from '../locales/localize';
import { formatHourMinute } from '../util/mealplan-state';

// Static list of predefined feeding times
export const PREDEFINED_TIMES = [
  "06:00", "08:00", "12:00", "18:00", "21:00"
];
/**
 * Renders the edit form for a feeding time.
 * @param {object} params - The parameters for rendering.
 * @param {any} params.profile - The profile object (must have a `fields` array).
 * @param {FeedingTime|null} params.editForm - The current edit form state.
 * @param {string|null} params.editError - The current error message, if any.
 * @param {(update: Partial<FeedingTime>) => void} params.onUpdate - Callback for updating the edit form state.
 * @returns {TemplateResult} The rendered edit form.
 */
export function renderEditView({ profile, editForm, editError, onUpdate }: {
  profile: any,
  editForm: any,
  editError: string | null,
  onUpdate: (update: Partial<any>) => void
}) {
  const fields = profile.fields || [];
  return html`
    <form class="edit-form" @submit=${(e: Event) => e.preventDefault()}>
      ${editError ? html`<div class="error">${editError}</div>` : ''}
      ${fields.includes('daysMask') ? renderDaySelector({
        selectedDaysMask: editForm?.daysMask ?? 0,
        editable: true,
        onDaysChanged: (newMask: number) => onUpdate({ daysMask: newMask })
      }) : ''}
      <div class="edit-form-group">
        <label for="edit-time">${localize('time')}</label>
        <input
          id="edit-time"
          class="edit-time"
          type="time"
          .value=${editForm ? formatHourMinute(editForm.hour, editForm.minute) : ''}
          @input=${(e: Event) => {
            const val = (e.target as HTMLInputElement).value;
            const [h, m] = val.split(':').map(Number);
            onUpdate({ hour: h, minute: m });
          }}
        />
      </div>
      ${fields.includes('portion') ? html`
        <div class="edit-form-group">
          <label for="edit-portion">${localize('portion')}</label>
          <input
            id="edit-portion"
            type="number"
            min="1"
            .value=${editForm?.portion ?? 1}
            @input=${(e: Event) => { onUpdate({ portion: parseInt((e.target as HTMLInputElement).value, 10) }); }}
          />
          <div class="helper">1 portion = 6 grams</div>
        </div>
      ` : ''}
      <div class="edit-predefined-times">
        ${PREDEFINED_TIMES.map(time => html`
          <ha-button type="button" @click=${() => {
            const [h, m] = time.split(":").map(Number);
            onUpdate({ hour: h, minute: m });
          }}>${time}</ha-button>
        `)}
      </div>
    </form>
  `;
}
