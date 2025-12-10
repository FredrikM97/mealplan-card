/**
 * EditDialog component for editing feeding times
 * Self-contained LitElement component with form validation
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { renderDaySelector } from '../day-selector.js';
import { localize } from '../locales/localize.js';
import type { FeedingTime } from '../types.js';
import {
  MealMessageEvent,
  SaveEvent,
  MESSAGE_TYPE_ERROR,
} from '../constants.js';
import { DeviceProfileGroup, ProfileField } from '../types.js';

/**
 * Validate that hour and minute are valid time values
 */
function isValidTime(hour?: number, minute?: number): boolean {
  return (
    typeof hour === 'number' &&
    !isNaN(hour) &&
    typeof minute === 'number' &&
    !isNaN(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

/**
 * Format hour and minute as HH:MM string
 */
function formatHourMinute(hour?: number, minute?: number): string {
  if (!isValidTime(hour, minute)) return '--:--';
  return `${hour!.toString().padStart(2, '0')}:${minute!.toString().padStart(2, '0')}`;
}

// Static list of predefined feeding times
const PREDEFINED_TIMES = ['06:00', '08:00', '12:00', '18:00', '21:00'];

/**
 * Meal edit dialog component
 * Emits: 'save' with FeedingTime detail, 'cancel' with no detail
 */
@customElement('meal-edit-dialog')
export class MealEditDialog extends LitElement {
  @property({ type: Object }) meal?: FeedingTime;
  @property({ type: Number }) index?: number;
  @property({ type: Object }) profile?: DeviceProfileGroup;
  @property({ type: Boolean }) open = false;

  @state() private formData: Partial<FeedingTime> = {};

  static styles = css`
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1em;
      width: 100%;
      box-sizing: border-box;
    }
    .edit-form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }
    .edit-predefined-times {
      display: flex;
      gap: 0.5em;
      flex-wrap: wrap;
    }
    label {
      font-weight: 500;
    }
    input[type='time'],
    input[type='number'] {
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      font-size: 1em;
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
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('meal') && this.meal) {
      this.formData = { ...this.meal };
    }
  }

  private handleUpdate(update: Partial<FeedingTime>) {
    this.formData = { ...this.formData, ...update };
  }

  private handleTimeInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    const [h, m] = val.split(':').map(Number);
    this.handleUpdate({ hour: h, minute: m });
  }

  private handlePortionInput(e: Event) {
    this.handleUpdate({
      portion: parseInt((e.target as HTMLInputElement).value, 10),
    });
  }

  private handlePredefinedTime(time: string) {
    const [h, m] = time.split(':').map(Number);
    this.handleUpdate({ hour: h, minute: m });
  }

  handleSave() {
    // Validate and dispatch error event if validation fails
    if (!this.validate(this.formData)) {
      return;
    }

    this.dispatchEvent(new SaveEvent(this.formData, this.index));
  }

  private validate(entry: Partial<FeedingTime>): boolean {
    if (!isValidTime(entry.hour, entry.minute)) {
      this.dispatchError('Please enter a valid time.');
      return false;
    }
    if (!entry.portion || entry.portion < 1) {
      this.dispatchError('Portion must be at least 1.');
      return false;
    }
    return true;
  }

  private dispatchError(message: string): void {
    this.dispatchEvent(new MealMessageEvent(message, MESSAGE_TYPE_ERROR));
  }

  private renderDaysField() {
    if (!this.profile?.fields.includes(ProfileField.DAYS)) {
      return '';
    }

    return renderDaySelector({
      days: this.formData?.days ?? 0,
      editable: true,
      onDaysChanged: (newDays: number) => this.handleUpdate({ days: newDays }),
      firstDay: this.profile.firstDay,
    });
  }

  private renderPortionField() {
    if (!this.profile?.fields.includes(ProfileField.PORTION)) {
      return '';
    }

    return html`
      <div class="edit-form-group">
        <label for="edit-portion">${localize('portion')}</label>
        <input
          id="edit-portion"
          type="number"
          min="1"
          .value=${String(this.formData?.portion ?? 1)}
          @input=${this.handlePortionInput}
        />
      </div>
    `;
  }

  private renderPredefinedTimes() {
    return html`
      <div class="edit-predefined-times">
        ${PREDEFINED_TIMES.map(
          (time) => html`
            <ha-button
              type="button"
              @click=${() => this.handlePredefinedTime(time)}
            >
              ${time}
            </ha-button>
          `,
        )}
      </div>
    `;
  }

  render() {
    if (!this.open || !this.profile) {
      return html``;
    }

    return html`
      <form class="edit-form" @submit=${(e: Event) => e.preventDefault()}>
        ${this.renderDaysField()}
        <div class="edit-form-group">
          <label for="edit-time">${localize('time')}</label>
          <input
            id="edit-time"
            class="edit-time"
            type="time"
            .value=${formatHourMinute(this.formData.hour, this.formData.minute)}
            @input=${this.handleTimeInput}
          />
        </div>
        ${this.renderPortionField()} ${this.renderPredefinedTimes()}
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meal-edit-dialog': MealEditDialog;
  }
}
